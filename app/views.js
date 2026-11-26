// Views for NusaStat: HTML for each hash route, built from data.js.
// Charts are mounted by main.js into the <div class="chart" data-chart="…">
// placeholders, so this file stays plain strings and the charts stay real SVG.

import { SERIES, PROVINCES, INDICATORS, CATEGORIES } from './data.js';

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function nav(active) {
  const links = [
    ['#/', 'Overview'], ['#/populasi', 'Population'], ['#/ekonomi', 'Economy'],
    ['#/kesehatan', 'Health'], ['#/pendidikan', 'Education'], ['#/kerja', 'Employment'],
    ['#/bandingkan', 'Compare'], ['#/jelajahi', 'Explore data'],
  ];
  return `<nav aria-label="Sections">${links.map(([href, label]) =>
    `<a href="${href}"${href === active ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav>`;
}

function kpi(value, label, source) {
  return `<div class="kpi"><p class="kpi-value">${value}</p><p class="kpi-label">${label}</p><p class="kpi-source">${source}</p></div>`;
}

function sourceNote(text) {
  return `<p class="source-note">${text}</p>`;
}

function yearSelect(id, years, selected) {
  return `<label class="year-pick">Show year
    <select id="${id}">${years.map((y) => `<option value="${y}"${y === selected ? ' selected' : ''}>${y}</option>`).join('')}</select>
  </label>`;
}

export function overview() {
  const pop = SERIES.population.values;
  const gdp = SERIES.gdpGrowth.values;
  const top5 = [...PROVINCES].sort((a, b) => b.population - a.population).slice(0, 5);
  return `
  <section class="hero">
    <p class="hero-kicker">National statistics · Indonesia</p>
    <h1>Indonesia in numbers</h1>
    <p class="lede">One country, 281.6 million people, 38 provinces — every figure below comes
    from an official source, with the source and the year printed next to it.</p>
  </section>
  <section class="kpi-row" aria-label="Headline figures">
    ${kpi('281.6<span class="kpi-unit"> million</span>', 'Population', 'BPS, 2024')}
    ${kpi('Rp 22,139<span class="kpi-unit"> trillion</span>', 'Gross domestic product', 'BPS, 2024')}
    ${kpi('75.02', 'Human Development Index', 'BPS, 2024')}
    ${kpi('8.57<span class="kpi-unit">%</span>', 'Poverty rate', 'BPS, September 2024')}
  </section>
  <section class="grid-2">
    <article class="panel">
      <h2>Population, 2015–2024</h2>
      <div class="chart" data-chart="population-line"></div>
      ${sourceNote('Source: BPS — Statistics Indonesia, 2024. Mid-year estimates.')}
      <p><a href="#/populasi">Population in detail &rarr;</a></p>
    </article>
    <article class="panel">
      <h2>Real GDP growth, 2015–2024</h2>
      <div class="chart" data-chart="growth-bar"></div>
      ${sourceNote('Source: BPS — Statistics Indonesia, 2024. The 2020 fall is the COVID-19 recession.')}
      <p><a href="#/ekonomi">Economy in detail &rarr;</a></p>
    </article>
  </section>
  <section class="panel">
    <h2>Largest provinces by population, 2024</h2>
    <div class="chart" data-chart="provinces-bar"></div>
    ${sourceNote('Source: BPS — Statistics Indonesia, 2024. West Java alone holds almost one in five Indonesians.')}
    <p><a href="#/bandingkan">Compare provinces &rarr;</a> · <a href="#/jelajahi">Explore all ${INDICATORS.length} indicators &rarr;</a></p>
  </section>`;
}

function seriesSection(key, title, intro, detailHref) {
  const s = SERIES[key];
  const years = s.values.map((v) => v.year);
  const latest = s.values[s.values.length - 1];
  return `
  <section class="hero">
    <p class="hero-kicker">${escape(title)}</p>
    <h1>${escape(title)}</h1>
    <p class="lede">${intro}</p>
  </section>
  <section class="kpi-row" aria-label="Headline figures">
    ${kpi(`${latest.value}<span class="kpi-unit"> ${escape(s.unit)}</span>`, s.label, `${escape(s.source)}`)}
    ${kpi(String(s.values.length), 'Years in the series', `${years[0]}–${years[years.length - 1]}`)}
  </section>
  <section class="panel">
    <div class="panel-head"><h2>${escape(s.label)}, ${years[0]}–${years[years.length - 1]}</h2>
    ${yearSelect('year-select', years, latest.year)}</div>
    <div class="chart" data-chart="${key}-line"></div>
    <p class="readout" id="year-readout">${escape(s.label)} in ${latest.year}: <strong>${latest.value} ${escape(s.unit)}</strong></p>
    ${sourceNote(`Source: ${escape(s.source)}. Pick a year to highlight that point on the chart.`)}
    <p><a href="#/${detailHref}">&larr; Back to overview</a></p>
  </section>`;
}

export function population() {
  const table = [...PROVINCES].sort((a, b) => b.population - a.population);
  return seriesSection('population', 'Population',
    '281.6 million people across 17,000 islands — growing by about one percent a year, and more than half of them on Java.', 'populasi') + `
  <section class="panel">
    <h2>Provinces by population, 2024</h2>
    <p>Click a column heading to sort. Density is computed from the published population and land area.</p>
    <div class="table-wrap"><table data-sortable="provinces">
      <thead><tr>
        <th data-key="name" scope="col">Province</th>
        <th data-key="population" data-type="number" scope="col">Population (million)</th>
        <th data-key="area" data-type="number" scope="col">Land area (km²)</th>
        <th data-key="density" data-type="number" scope="col">Density (per km²)</th>
      </tr></thead>
      <tbody>${table.map((p) => `<tr><td>${escape(p.name)}</td><td>${p.population.toFixed(2)}</td><td>${p.area.toLocaleString('en-US')}</td><td>${Math.round((p.population * 1e6) / p.area).toLocaleString('en-US')}</td></tr>`).join('')}</tbody>
    </table></div>
    ${sourceNote('Source: BPS — Statistics Indonesia, 2024.')}
  </section>`;
}

export function economy() {
  return seriesSection('gdpGrowth', 'Economy',
    'Southeast Asia’s largest economy: Rp 22,139 trillion of output in 2024, growing 5.03%, with inflation at 1.57% — the lowest in years.', 'ekonomi') + `
  <section class="grid-2">
    <article class="panel">
      <h2>Inflation, 2015–2024</h2>
      <div class="chart" data-chart="inflation-line"></div>
      ${sourceNote('Source: BPS — Statistics Indonesia, 2024.')}
    </article>
    <article class="panel">
      <h2>Trade, 2024</h2>
      <dl class="facts">
        <div><dt>Exports</dt><dd>US$ 264.7 billion</dd></div>
        <div><dt>Imports</dt><dd>US$ 233.7 billion</dd></div>
        <div><dt>Trade surplus</dt><dd>US$ 31.0 billion</dd></div>
        <div><dt>Foreign reserves</dt><dd>US$ 155.7 billion</dd></div>
        <div><dt>Rupiah (end of year)</dt><dd>Rp 16,157 per US$</dd></div>
        <div><dt>Policy rate</dt><dd>6.00%</dd></div>
      </dl>
      ${sourceNote('Sources: BPS and Bank Indonesia, 2024.')}
    </article>
  </section>`;
}

export function health() {
  return seriesSection('lifeExpectancy', 'Health',
    'Life expectancy reached 73.9 years in 2024 — but one in five children under five was still stunted in 2023.', 'kesehatan') + `
  <section class="panel">
    <h2>Health indicators</h2>
    <div class="table-wrap"><table>
      <thead><tr><th scope="col">Indicator</th><th scope="col">Value</th><th scope="col">Year</th><th scope="col">Source</th></tr></thead>
      <tbody>
        <tr><td>Life expectancy at birth</td><td>73.9 years</td><td>2024</td><td>BPS</td></tr>
        <tr><td>Infant mortality rate</td><td>17.5 per 1,000 live births</td><td>2023</td><td>World Bank</td></tr>
        <tr><td>Maternal mortality ratio</td><td>173 per 100,000 live births</td><td>2020</td><td>WHO</td></tr>
        <tr><td>Stunting in children under 5</td><td>21.5%</td><td>2023</td><td>Ministry of Health (SSGI)</td></tr>
        <tr><td>Households with electricity</td><td>99.76%</td><td>2024</td><td>Ministry of Energy &amp; Mineral Resources</td></tr>
      </tbody>
    </table></div>
    ${sourceNote('Each figure is the publisher’s latest release at the time of writing; years differ because sources publish on different cycles.')}
  </section>`;
}

export function education() {
  return `
  <section class="hero">
    <p class="hero-kicker">Education</p>
    <h1>Education</h1>
    <p class="lede">Adults are nearly all literate — 96.5% in 2023 — but the average Indonesian has only 9.0 years of schooling behind them.</p>
  </section>
  <section class="kpi-row" aria-label="Headline figures">
    ${kpi('96.5<span class="kpi-unit">%</span>', 'Adult literacy rate', 'BPS, 2023')}
    ${kpi('9.0<span class="kpi-unit"> years</span>', 'Mean years of schooling', 'BPS, 2024')}
    ${kpi('13.4<span class="kpi-unit"> years</span>', 'Expected years of schooling', 'BPS, 2024')}
    ${kpi('0.379', 'Gini ratio', 'BPS, March 2024')}
  </section>
  <section class="panel">
    <h2>Schooling and human development</h2>
    <dl class="facts">
      <div><dt>Human Development Index</dt><dd>75.02 — “high” human development (BPS, 2024)</dd></div>
      <div><dt>Mean years of schooling</dt><dd>9.0 years — just past junior high (BPS, 2024)</dd></div>
      <div><dt>Expected years of schooling</dt><dd>13.4 years — a child starting school today can expect that much (BPS, 2024)</dd></div>
      <div><dt>Gini ratio</dt><dd>0.379 — income inequality, March 2024 (BPS)</dd></div>
    </dl>
    ${sourceNote('Source: BPS — Statistics Indonesia. The HDI combines health, education and income.')}
    <p><a href="#/">&larr; Back to overview</a></p>
  </section>`;
}

export function employment() {
  return seriesSection('unemployment', 'Employment',
    'Unemployment fell to 4.76% in February 2025 — the lowest in the series — but 58.8% of workers are still informal.', 'kerja') + `
  <section class="grid-2">
    <article class="panel">
      <h2>Work in February 2025</h2>
      <dl class="facts">
        <div><dt>Labour force</dt><dd>153.1 million people</dd></div>
        <div><dt>People in work</dt><dd>145.8 million people</dd></div>
        <div><dt>Informal workers</dt><dd>58.8% of all workers</dd></div>
        <div><dt>Jakarta minimum wage</dt><dd>Rp 5,396,761 per month</dd></div>
      </dl>
      ${sourceNote('Source: BPS — Statistics Indonesia, February 2025; DKI Jakarta Government, 2025.')}
    </article>
    <article class="panel">
      <h2>Poverty, 2015–2024</h2>
      <div class="chart" data-chart="poverty-line"></div>
      ${sourceNote('Source: BPS — Statistics Indonesia, September 2024. 8.57% is the lowest poverty rate on record.')}
    </article>
  </section>`;
}

export function compare() {
  const opts = PROVINCES.map((p) => `<option value="${escape(p.name)}">${escape(p.name)}</option>`).join('');
  return `
  <section class="hero">
    <p class="hero-kicker">Compare</p>
    <h1>Compare provinces</h1>
    <p class="lede">Pick two provinces and an indicator. Jakarta packs 10.56 million people into 664 km²; Riau spreads 7.04 million across 87,024 km².</p>
  </section>
  <section class="panel">
    <div class="compare-controls">
      <label>Province A <select id="cmp-a">${opts}</select></label>
      <label>Province B <select id="cmp-b">${opts}</select></label>
      <label>Indicator
        <select id="cmp-indicator">
          <option value="population">Population (million)</option>
          <option value="density">Density (people per km²)</option>
          <option value="area">Land area (km²)</option>
        </select>
      </label>
    </div>
    <div class="compare-result" id="cmp-result"></div>
    <div class="chart" data-chart="compare-bar"></div>
    ${sourceNote('Source: BPS — Statistics Indonesia, 2024. Density is computed from population and land area.')}
  </section>`;
}

export function explore() {
  return `
  <section class="hero">
    <p class="hero-kicker">Explore data</p>
    <h1>All ${INDICATORS.length} indicators</h1>
    <p class="lede">Every headline figure on this site, in one searchable table. Type to filter, pick a category, click a heading to sort.</p>
  </section>
  <section class="panel">
    <div class="explore-controls">
      <label>Search <input id="exp-search" type="search" placeholder="Try “inflation” or “schooling”" aria-label="Search indicators"></label>
      <label>Category
        <select id="exp-category">${CATEGORIES.map((c) => `<option value="${escape(c)}">${escape(c)}</option>`).join('')}</select>
      </label>
    </div>
    <p class="readout" id="exp-count"></p>
    <div class="table-wrap"><table data-sortable="indicators">
      <thead><tr>
        <th data-key="name" scope="col">Indicator</th>
        <th data-key="category" scope="col">Category</th>
        <th data-key="value" scope="col">Value</th>
        <th data-key="year" data-type="number" scope="col">Year</th>
        <th data-key="source" scope="col">Source</th>
      </tr></thead>
      <tbody id="exp-body"></tbody>
    </table></div>
    ${sourceNote('Sources: BPS — Statistics Indonesia, Bank Indonesia, World Bank, WHO, Ministry of Health (SSGI), Ministry of Energy & Mineral Resources, DKI Jakarta Government.')}
  </section>`;
}

export function missing() {
  return `<section class="hero"><h1>Not found</h1><p class="lede">There is no page at this address. <a href="#/">Back to the overview</a>.</p></section>`;
}
