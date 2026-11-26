// NusaStat data — Indonesia, every figure with its source and year.
// Figures are the published values of BPS (Statistics Indonesia), Bank Indonesia,
// the World Bank and the Ministry of Health. No figure is invented: where a series
// value was not published for a year, the year is left out of that series.

export const COUNTRY = {
  name: 'Indonesia',
  tagline: 'Indonesia in numbers — population, economy, health, education and work, from official sources.',
  updated: 'Data as published to November 2026. All figures carry their source and year.',
};

// Year series. Each entry: { year, value }. Sources named once per series.
export const SERIES = {
  population: {
    label: 'Total population',
    unit: 'million people',
    source: 'BPS — Statistics Indonesia, 2024',
    values: [
      { year: 2015, value: 255.5 }, { year: 2016, value: 258.7 }, { year: 2017, value: 261.9 },
      { year: 2018, value: 265.0 }, { year: 2019, value: 268.1 }, { year: 2020, value: 270.2 },
      { year: 2021, value: 272.7 }, { year: 2022, value: 275.8 }, { year: 2023, value: 278.7 },
      { year: 2024, value: 281.6 },
    ],
  },
  gdpGrowth: {
    label: 'Real GDP growth',
    unit: '% per year',
    source: 'BPS — Statistics Indonesia, 2024',
    values: [
      { year: 2015, value: 4.88 }, { year: 2016, value: 5.03 }, { year: 2017, value: 5.07 },
      { year: 2018, value: 5.17 }, { year: 2019, value: 5.02 }, { year: 2020, value: -2.07 },
      { year: 2021, value: 3.7 }, { year: 2022, value: 5.31 }, { year: 2023, value: 5.05 },
      { year: 2024, value: 5.03 },
    ],
  },
  inflation: {
    label: 'Consumer price inflation',
    unit: '% per year',
    source: 'BPS — Statistics Indonesia, 2024',
    values: [
      { year: 2015, value: 3.35 }, { year: 2016, value: 3.02 }, { year: 2017, value: 3.61 },
      { year: 2018, value: 3.13 }, { year: 2019, value: 2.72 }, { year: 2020, value: 1.68 },
      { year: 2021, value: 1.87 }, { year: 2022, value: 5.51 }, { year: 2023, value: 2.61 },
      { year: 2024, value: 1.57 },
    ],
  },
  poverty: {
    label: 'Poverty rate',
    unit: '% of population',
    source: 'BPS — Statistics Indonesia, September 2024',
    values: [
      { year: 2015, value: 11.13 }, { year: 2016, value: 10.7 }, { year: 2017, value: 10.12 },
      { year: 2018, value: 9.66 }, { year: 2019, value: 9.22 }, { year: 2020, value: 10.19 },
      { year: 2021, value: 9.71 }, { year: 2022, value: 9.57 }, { year: 2023, value: 9.36 },
      { year: 2024, value: 8.57 },
    ],
  },
  unemployment: {
    label: 'Open unemployment rate',
    unit: '% of labour force',
    source: 'BPS — Statistics Indonesia, February 2025',
    values: [
      { year: 2015, value: 5.81 }, { year: 2016, value: 5.5 }, { year: 2017, value: 5.33 },
      { year: 2018, value: 5.13 }, { year: 2019, value: 5.01 }, { year: 2020, value: 4.99 },
      { year: 2021, value: 6.26 }, { year: 2022, value: 5.83 }, { year: 2023, value: 5.45 },
      { year: 2024, value: 4.82 }, { year: 2025, value: 4.76 },
    ],
  },
  lifeExpectancy: {
    label: 'Life expectancy at birth',
    unit: 'years',
    source: 'BPS — Statistics Indonesia, 2024',
    values: [
      { year: 2020, value: 71.93 }, { year: 2021, value: 71.8 }, { year: 2022, value: 73.54 },
      { year: 2023, value: 73.72 }, { year: 2024, value: 73.93 },
    ],
  },
};

// Ten most populous provinces, 2024 (population in millions, land area in km²).
// Density is computed from these two published figures, never typed by hand.
export const PROVINCES = [
  { name: 'West Java', population: 50.35, area: 37040 },
  { name: 'East Java', population: 41.81, area: 47800 },
  { name: 'Central Java', population: 37.89, area: 32800 },
  { name: 'North Sumatra', population: 15.59, area: 72981 },
  { name: 'Banten', population: 12.44, area: 9662 },
  { name: 'Jakarta', population: 10.56, area: 664 },
  { name: 'Lampung', population: 9.44, area: 34624 },
  { name: 'South Sulawesi', population: 9.42, area: 46717 },
  { name: 'South Sumatra', population: 8.95, area: 91592 },
  { name: 'Riau', population: 7.04, area: 87024 },
];

// The indicator explorer: every headline figure on the site, each with source + year.
export const INDICATORS = [
  { id: 'pop-total', category: 'Population', name: 'Total population', value: '281.6 million', year: 2024, source: 'BPS' },
  { id: 'pop-density', category: 'Population', name: 'Population density', value: '147 people per km²', year: 2024, source: 'BPS' },
  { id: 'pop-growth', category: 'Population', name: 'Annual population growth', value: '1.04%', year: 2024, source: 'BPS' },
  { id: 'pop-fertility', category: 'Population', name: 'Total fertility rate', value: '2.14 children per woman', year: 2023, source: 'BPS' },
  { id: 'pop-urban', category: 'Population', name: 'Urban population share', value: '58.6%', year: 2023, source: 'World Bank' },
  { id: 'pop-java', category: 'Population', name: 'Population living on Java', value: '56.1%', year: 2020, source: 'BPS Census' },
  { id: 'pop-provinces', category: 'Population', name: 'Provinces', value: '38', year: 2024, source: 'BPS' },
  { id: 'pop-regencies', category: 'Population', name: 'Regencies and cities', value: '514', year: 2024, source: 'BPS' },
  { id: 'eco-gdp', category: 'Economy', name: 'Gross domestic product', value: 'Rp 22,139 trillion', year: 2024, source: 'BPS' },
  { id: 'eco-gdp-usd', category: 'Economy', name: 'GDP in US dollars', value: 'US$ 1,396 billion', year: 2024, source: 'World Bank' },
  { id: 'eco-gdp-capita', category: 'Economy', name: 'GDP per capita', value: 'US$ 4,925', year: 2024, source: 'World Bank' },
  { id: 'eco-growth', category: 'Economy', name: 'Real GDP growth', value: '5.03%', year: 2024, source: 'BPS' },
  { id: 'eco-inflation', category: 'Economy', name: 'Consumer price inflation', value: '1.57%', year: 2024, source: 'BPS' },
  { id: 'eco-exports', category: 'Economy', name: 'Exports of goods', value: 'US$ 264.7 billion', year: 2024, source: 'BPS' },
  { id: 'eco-imports', category: 'Economy', name: 'Imports of goods', value: 'US$ 233.7 billion', year: 2024, source: 'BPS' },
  { id: 'eco-trade', category: 'Economy', name: 'Trade balance surplus', value: 'US$ 31.0 billion', year: 2024, source: 'BPS' },
  { id: 'eco-reserves', category: 'Economy', name: 'Foreign exchange reserves', value: 'US$ 155.7 billion', year: 2024, source: 'Bank Indonesia' },
  { id: 'eco-rupiah', category: 'Economy', name: 'Rupiah per US dollar (end of year)', value: 'Rp 16,157', year: 2024, source: 'Bank Indonesia' },
  { id: 'eco-rate', category: 'Economy', name: 'Policy rate (BI-Rate)', value: '6.00%', year: 2024, source: 'Bank Indonesia' },
  { id: 'eco-manufacturing', category: 'Economy', name: 'Manufacturing share of GDP', value: '18.7%', year: 2024, source: 'BPS' },
  { id: 'eco-agriculture', category: 'Economy', name: 'Agriculture, forestry & fishing share of GDP', value: '12.5%', year: 2024, source: 'BPS' },
  { id: 'health-life', category: 'Health', name: 'Life expectancy at birth', value: '73.9 years', year: 2024, source: 'BPS' },
  { id: 'health-imr', category: 'Health', name: 'Infant mortality rate', value: '17.5 per 1,000 live births', year: 2023, source: 'World Bank' },
  { id: 'health-mmr', category: 'Health', name: 'Maternal mortality ratio', value: '173 per 100,000 live births', year: 2020, source: 'WHO' },
  { id: 'health-stunting', category: 'Health', name: 'Stunting prevalence in children under 5', value: '21.5%', year: 2023, source: 'Ministry of Health (SSGI)' },
  { id: 'health-electricity', category: 'Health', name: 'Households with access to electricity', value: '99.76%', year: 2024, source: 'Ministry of Energy & Mineral Resources' },
  { id: 'edu-literacy', category: 'Education', name: 'Adult literacy rate', value: '96.5%', year: 2023, source: 'BPS' },
  { id: 'edu-mean-years', category: 'Education', name: 'Mean years of schooling', value: '9.0 years', year: 2024, source: 'BPS' },
  { id: 'edu-expected-years', category: 'Education', name: 'Expected years of schooling', value: '13.4 years', year: 2024, source: 'BPS' },
  { id: 'edu-hdi', category: 'Education', name: 'Human Development Index', value: '75.02', year: 2024, source: 'BPS' },
  { id: 'edu-gini', category: 'Education', name: 'Gini ratio (inequality)', value: '0.379', year: 2024, source: 'BPS' },
  { id: 'work-unemployment', category: 'Employment', name: 'Open unemployment rate', value: '4.76%', year: 2025, source: 'BPS (Feb 2025)' },
  { id: 'work-labour', category: 'Employment', name: 'Labour force', value: '153.1 million people', year: 2025, source: 'BPS (Feb 2025)' },
  { id: 'work-employed', category: 'Employment', name: 'People in work', value: '145.8 million people', year: 2025, source: 'BPS (Feb 2025)' },
  { id: 'work-informal', category: 'Employment', name: 'Informal employment share', value: '58.8%', year: 2025, source: 'BPS (Feb 2025)' },
  { id: 'work-wage', category: 'Employment', name: 'Jakarta minimum wage', value: 'Rp 5,396,761 per month', year: 2025, source: 'DKI Jakarta Government' },
  { id: 'work-poverty', category: 'Employment', name: 'Poverty rate', value: '8.57%', year: 2024, source: 'BPS (Sep 2024)' },
];

export const CATEGORIES = ['All', 'Population', 'Economy', 'Health', 'Education', 'Employment'];
