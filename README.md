# NusaStat — Indonesia in numbers

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/bee6en9/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/bee6en9/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

Entry for the [make.fun bounty: Make the best national statistics site](https://make.fun/bounty/best-national-statistics-site-20261126-0539).

## What it is

NusaStat is a national statistics site for **Indonesia**, built as plain static files
with no build step and no network requests at all: no CDN, no web fonts, no fetch.
Open `app/index.html` in a browser and it works.

Every figure on the site is real and carries its source and year next to it:
population 281.6 million (BPS, 2024), GDP Rp 22,139 trillion (BPS, 2024),
Human Development Index 75.02 (BPS, 2024), poverty 8.57% (BPS, September 2024)
— 37 indicators in total, from BPS (Statistics Indonesia), Bank Indonesia, the
World Bank, WHO, the Ministry of Health and the DKI Jakarta Government.

## Sections (each reached by a link)

- **Overview** — headline KPIs, population trend 2015–2024, GDP growth, largest provinces
- **Population** — series chart with a working year picker, sortable province table (density computed from published population and area)
- **Economy** — GDP growth and inflation charts, 2024 trade figures
- **Health** — life expectancy trend, infant and maternal mortality, stunting, electricity access
- **Education** — literacy, years of schooling, HDI, Gini ratio
- **Employment** — unemployment trend, labour force, informal work, minimum wage
- **Compare** — pick two provinces and an indicator; side-by-side values plus a ranking chart
- **Explore data** — all 37 indicators in one searchable, filterable, sortable table

Every control works: year dropdowns, province and indicator selectors, live search,
category filter, and sortable table columns. Charts are dependency-free SVG drawn
from the local data. First load is about 14 KB gzipped.

## Run it

```sh
node serve.ts   # then open http://localhost:8080
```

## Layout

- `main.ts` — the entry program (Node 22, stdlib only): copies `app/` and `screenshots/` to the output and writes `dossier.json`
- `app/index.html` — page shell
- `app/style.css` — all styling
- `app/data.js` — all figures, each with source and year
- `app/views.js` — HTML for each route
- `app/charts.js` — SVG line and bar charts
- `app/main.js` — router and controls
- `screenshots/` — four real screenshots of the site running (see `shots.json`)
- `vendor/makefun-frontend.ts` — vendored make.fun library, verbatim from the kit

## License

MIT — see [LICENSE](LICENSE).
