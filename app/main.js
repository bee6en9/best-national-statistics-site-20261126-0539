// NusaStat router and controls. Hash routes, one page per section:
//   #/                overview        #/kesehatan      health
//   #/populasi        population      #/pendidikan     education
//   #/ekonomi         economy         #/kerja          employment
//   #/bandingkan      compare         #/jelajahi       indicator explorer
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { SERIES, PROVINCES, INDICATORS } from './data.js';
import { lineChart, barChart } from './charts.js';
import * as views from './views.js';

const app = document.getElementById('app');
const headerNav = document.getElementById('site-nav');

const fmt = (n) => n.toLocaleString('en-US');

function density(p) { return (p.population * 1e6) / p.area; }

function mountCharts(route) {
  const mount = (selector, svg) => {
    const host = document.querySelector(selector);
    if (host) host.innerHTML = svg;
  };
  if (route === '#/') {
    mount('[data-chart="population-line"]', lineChart(SERIES.population.values, { ySuffix: '' }));
    mount('[data-chart="growth-bar"]', barChart(
      SERIES.gdpGrowth.values.map((v) => ({ label: String(v.year), value: Math.max(v.value, 0.1), display: `${v.value}%` })),
      { color: '#0c4a38' }));
    mount('[data-chart="provinces-bar"]', barChart(
      [...PROVINCES].sort((a, b) => b.population - a.population).slice(0, 5)
        .map((p) => ({ label: p.name, value: p.population, display: `${p.population} m` }))));
  }
  if (route === '#/populasi') mount('[data-chart="population-line"]', lineChart(SERIES.population.values));
  if (route === '#/ekonomi') {
    mount('[data-chart="gdpGrowth-line"]', lineChart(SERIES.gdpGrowth.values, { ySuffix: '%' }));
    mount('[data-chart="inflation-line"]', lineChart(SERIES.inflation.values, { ySuffix: '%' }));
  }
  if (route === '#/kesehatan') mount('[data-chart="lifeExpectancy-line"]', lineChart(SERIES.lifeExpectancy.values, { ySuffix: '' }));
  if (route === '#/kerja') {
    mount('[data-chart="unemployment-line"]', lineChart(SERIES.unemployment.values, { ySuffix: '%' }));
    mount('[data-chart="poverty-line"]', lineChart(SERIES.poverty.values, { ySuffix: '%' }));
  }
}

// Year picker: highlights the chosen point on the series chart and rewrites the readout.
function wireYearPicker(seriesKey, chartName) {
  const select = document.getElementById('year-select');
  if (!select) return;
  const readout = document.getElementById('year-readout');
  const host = document.querySelector(`[data-chart="${chartName}"]`);
  const series = SERIES[seriesKey];
  const redraw = () => {
    const year = Number(select.value);
    const point = series.values.find((v) => v.year === year);
    if (host) { host.innerHTML = lineChart(series.values, { highlightYear: year, ySuffix: seriesKey === 'population' ? '' : '%' }); }
    if (readout && point) readout.innerHTML = `${series.label} in ${year}: <strong>${point.value} ${series.unit}</strong>`;
  };
  select.addEventListener('change', redraw);
  redraw();
}

// Click a sortable table heading to sort that column; click again to reverse.
function wireSortable() {
  for (const table of document.querySelectorAll('table[data-sortable]')) {
    const body = table.querySelector('tbody');
    let key = null; let dir = 1;
    table.querySelectorAll('th[data-key]').forEach((th) => {
      th.addEventListener('click', () => {
        const k = th.dataset.key;
        dir = k === key ? -dir : 1;
        key = k;
        const type = th.dataset.type || 'text';
        const rows = [...body.querySelectorAll('tr')];
        const cellText = (row) => row.children[[...th.parentNode.children].indexOf(th)].textContent.trim();
        rows.sort((a, b) => {
          const va = cellText(a); const vb = cellText(b);
          const cmp = type === 'number'
            ? (parseFloat(va.replace(/[^0-9.\-]/g, '')) || 0) - (parseFloat(vb.replace(/[^0-9.\-]/g, '')) || 0)
            : va.localeCompare(vb);
          return cmp * dir;
        });
        body.append(...rows);
        table.querySelectorAll('th').forEach((h) => h.removeAttribute('aria-sort'));
        th.setAttribute('aria-sort', dir === 1 ? 'ascending' : 'descending');
      });
    });
  }
}

// Indicator explorer: live search + category filter + count.
function wireExplorer() {
  const search = document.getElementById('exp-search');
  const category = document.getElementById('exp-category');
  const body = document.getElementById('exp-body');
  const count = document.getElementById('exp-count');
  if (!search || !body) return;
  const render = () => {
    const q = search.value.trim().toLowerCase();
    const cat = category.value;
    const rows = INDICATORS.filter((r) =>
      (cat === 'All' || r.category === cat) &&
      (q === '' || `${r.name} ${r.value} ${r.source}`.toLowerCase().includes(q)));
    body.innerHTML = rows.map((r) =>
      `<tr><td>${r.name}</td><td>${r.category}</td><td>${r.value}</td><td>${r.year}</td><td>${r.source}</td></tr>`).join('')
      || '<tr><td colspan="5">No indicator matches that search. Try another word.</td></tr>';
    count.textContent = `Showing ${rows.length} of ${INDICATORS.length} indicators.`;
  };
  search.addEventListener('input', render);
  category.addEventListener('change', render);
  render();
}

// Province comparison: two provinces + one indicator, side by side + full ranking chart.
function wireCompare() {
  const a = document.getElementById('cmp-a');
  const b = document.getElementById('cmp-b');
  const ind = document.getElementById('cmp-indicator');
  const result = document.getElementById('cmp-result');
  const host = document.querySelector('[data-chart="compare-bar"]');
  if (!a || !b || !ind) return;
  a.value = 'West Java'; b.value = 'Jakarta';
  const valueOf = (p, key) => (key === 'population' ? p.population : key === 'density' ? density(p) : p.area);
  const displayOf = (p, key) => (key === 'population' ? `${p.population} million people`
    : key === 'density' ? `${fmt(Math.round(density(p)))} per km²` : `${fmt(p.area)} km²`);
  const render = () => {
    const pa = PROVINCES.find((p) => p.name === a.value);
    const pb = PROVINCES.find((p) => p.name === b.value);
    const key = ind.value;
    const label = ind.options[ind.selectedIndex].textContent;
    result.innerHTML = `
      <div class="compare-card"><p class="compare-name">${pa.name}</p><p class="compare-value">${displayOf(pa, key)}</p></div>
      <div class="compare-vs">vs</div>
      <div class="compare-card"><p class="compare-name">${pb.name}</p><p class="compare-value">${displayOf(pb, key)}</p></div>`;
    if (host) {
      host.innerHTML = barChart(
        [...PROVINCES].sort((x, y) => valueOf(y, key) - valueOf(x, key))
          .map((p) => ({ label: p.name, value: valueOf(p, key), display: displayOf(p, key) })),
        { highlight: null });
    }
    result.setAttribute('aria-label', `${label}: ${pa.name} ${displayOf(pa, key)}, ${pb.name} ${displayOf(pb, key)}`);
  };
  a.addEventListener('change', render);
  b.addEventListener('change', render);
  ind.addEventListener('change', render);
  render();
}

const ROUTES = {
  '#/': () => views.overview(),
  '#/populasi': () => views.population(),
  '#/ekonomi': () => views.economy(),
  '#/kesehatan': () => views.health(),
  '#/pendidikan': () => views.education(),
  '#/kerja': () => views.employment(),
  '#/bandingkan': () => views.compare(),
  '#/jelajahi': () => views.explore(),
};

const TITLES = {
  '#/': 'NusaStat — Indonesia in numbers',
  '#/populasi': 'Population | NusaStat',
  '#/ekonomi': 'Economy | NusaStat',
  '#/kesehatan': 'Health | NusaStat',
  '#/pendidikan': 'Education | NusaStat',
  '#/kerja': 'Employment | NusaStat',
  '#/bandingkan': 'Compare provinces | NusaStat',
  '#/jelajahi': 'Explore data | NusaStat',
};

function render() {
  window.__shotReady = false;
  const route = location.hash.split('?')[0] || '#/';
  const view = ROUTES[route] || views.missing;
  document.title = TITLES[route] || 'Not found | NusaStat';
  headerNav.innerHTML = views.nav(route);
  app.innerHTML = view();
  mountCharts(route);
  if (route === '#/populasi') wireYearPicker('population', 'population-line');
  if (route === '#/ekonomi') wireYearPicker('gdpGrowth', 'gdpGrowth-line');
  if (route === '#/kesehatan') wireYearPicker('lifeExpectancy', 'lifeExpectancy-line');
  if (route === '#/kerja') wireYearPicker('unemployment', 'unemployment-line');
  wireSortable();
  wireExplorer();
  wireCompare();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
