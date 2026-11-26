// Charts for NusaStat: small, dependency-free SVG line and bar charts drawn from
// the local data in data.js. No library, no network, no canvas — each chart is an
// SVG string dropped into the page, so it prints, scales and screenshots exactly
// as it renders. The SVG namespace is never written out: inline SVG in HTML gets
// it from the parser, so the source carries no URL at all.

const INK = '#0c4a38';
const RED = '#c8102e';
const AMBER = '#d98e04';
const GRID = '#ddd9cc';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function niceTicks(min, max, count = 4) {
  const span = max - min || 1;
  const step = span / count;
  const mag = 10 ** Math.floor(Math.log10(step));
  const norm = step / mag;
  const nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
  const s = nice * mag;
  const start = Math.ceil(min / s) * s;
  const ticks = [];
  for (let v = start; v <= max + 1e-9; v += s) ticks.push(Math.round(v * 100) / 100);
  return ticks;
}

// Line chart. `points` is [{year, value}]; `highlightYear` draws a marker dot.
export function lineChart(points, { width = 640, height = 260, highlightYear = null, color = INK, ySuffix = '' } = {}) {
  const padL = 46, padR = 12, padT = 14, padB = 28;
  const values = points.map((p) => p.value);
  let min = Math.min(...values), max = Math.max(...values);
  const pad = (max - min) * 0.15 || 1;
  min -= pad; max += pad;
  const x = (i) => padL + (i * (width - padL - padR)) / (points.length - 1);
  const y = (v) => padT + ((max - v) * (height - padT - padB)) / (max - min);

  let out = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Line chart">`;
  for (const t of niceTicks(min, max)) {
    out += `<line x1="${padL}" x2="${width - padR}" y1="${y(t).toFixed(1)}" y2="${y(t).toFixed(1)}" stroke="${GRID}" stroke-width="1"/>`;
    out += `<text x="${padL - 8}" y="${(y(t) + 4).toFixed(1)}" text-anchor="end" class="chart-tick">${t}${ySuffix}</text>`;
  }
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  out += `<path d="${path}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  points.forEach((p, i) => {
    out += `<circle cx="${x(i).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="3" fill="#fff" stroke="${color}" stroke-width="2"/>`;
    out += `<text x="${x(i).toFixed(1)}" y="${height - 8}" text-anchor="middle" class="chart-tick">${p.year}</text>`;
  });
  if (highlightYear !== null) {
    const i = points.findIndex((p) => p.year === highlightYear);
    if (i >= 0) {
      out += `<circle cx="${x(i).toFixed(1)}" cy="${y(points[i].value).toFixed(1)}" r="6" fill="${RED}" stroke="#fff" stroke-width="2"/>`;
      // Keep the value label inside the viewBox at both edges.
      const labelX = Math.max(padL + 22, Math.min(x(i), width - padR - 22));
      out += `<text x="${labelX.toFixed(1)}" y="${(y(points[i].value) - 12).toFixed(1)}" text-anchor="middle" class="chart-value">${points[i].value}</text>`;
    }
  }
  return `${out}</svg>`;
}

// Horizontal bar chart. `rows` is [{label, value, display}].
export function barChart(rows, { width = 640, barH = 26, gap = 10, color = INK, highlight = null } = {}) {
  const padL = 130, padR = 64, padT = 8;
  const height = padT + rows.length * (barH + gap) + 6;
  const max = Math.max(...rows.map((r) => r.value));
  let out = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Bar chart">`;
  rows.forEach((row, i) => {
    const top = padT + i * (barH + gap);
    const w = Math.max(2, ((width - padL - padR) * row.value) / max);
    const isHi = highlight !== null && row.label === highlight;
    out += `<text x="${padL - 8}" y="${top + barH / 2 + 4}" text-anchor="end" class="chart-label">${esc(row.label)}</text>`;
    out += `<rect x="${padL}" y="${top}" width="${w.toFixed(1)}" height="${barH}" rx="3" fill="${isHi ? RED : color}" opacity="${isHi ? 1 : 0.88}"/>`;
    // Value label goes after the bar; if it would run past the edge, put it
    // inside the bar instead, in white (estimated width: ~7px per character).
    const estW = row.display.length * 7;
    if (padL + w + 8 + estW > width - 4 && w > estW + 16) {
      out += `<text x="${(padL + w - 8).toFixed(1)}" y="${top + barH / 2 + 4}" text-anchor="end" class="chart-value" style="fill:#fff">${esc(row.display)}</text>`;
    } else {
      out += `<text x="${(padL + w + 8).toFixed(1)}" y="${top + barH / 2 + 4}" class="chart-value">${esc(row.display)}</text>`;
    }
  });
  return `${out}</svg>`;
}

export const CHART_COLORS = { ink: INK, red: RED, amber: AMBER };
