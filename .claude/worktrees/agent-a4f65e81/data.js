/**
 * CompVerdict — Benchmark Dataset
 * Version: 2025-Q1
 *
 * METHODOLOGY
 * -----------
 * Baseline role: Software Engineer
 * Baseline band: Mid (3–5 YoE)
 * Source: aggregated from public salary surveys (Levels.fyi, Glassdoor,
 *         LinkedIn Salary, Stack Overflow Developer Survey, local market reports)
 * Currency: local, annual gross (pre-tax)
 *
 * All other roles are derived via role multipliers applied to the SE baseline.
 * Initial markets (ES, UK, DE) carry explicit per-band data.
 * Secondary markets carry derived per-band data from mid-level benchmarks.
 *
 * STRUCTURE
 * ---------
 * CV_DATA.benchmarks[city][band] → { p25, p50, p75 }  (SE baseline)
 * CV_DATA.roles[role]            → { mul, override? }
 * CV_DATA.cities[city]           → { market, symbol }
 * CV_DATA.markets[code]          → { name, defaultCity }
 * CV_DATA.bands[]                → ordered band config
 */

window.CV_DATA = {

  version: "2025-Q1",

  // ── Experience Bands ──────────────────────────────────────────────────────
  bands: [
    { id: "junior", label: "Junior",      yoeMin: 0,  yoeMax: 2  },
    { id: "mid",    label: "Mid-level",   yoeMin: 3,  yoeMax: 5  },
    { id: "senior", label: "Senior",      yoeMin: 6,  yoeMax: 10 },
    { id: "staff",  label: "Staff / Lead",yoeMin: 11, yoeMax: 99 },
  ],

  // ── Markets ───────────────────────────────────────────────────────────────
  markets: {
    ES: { name: "Spain",       defaultCity: "Barcelona" },
    UK: { name: "UK",          defaultCity: "London"    },
    DE: { name: "Germany",     defaultCity: "Berlin"    },
    NL: { name: "Netherlands", defaultCity: "Amsterdam" },
    FR: { name: "France",      defaultCity: "Paris"     },
    IE: { name: "Ireland",     defaultCity: "Dublin"    },
    PT: { name: "Portugal",    defaultCity: "Lisbon"    },
    IT: { name: "Italy",       defaultCity: "Milan"     },
    SE: { name: "Sweden",      defaultCity: "Stockholm" },
    DK: { name: "Denmark",     defaultCity: "Copenhagen"},
    CH: { name: "Switzerland", defaultCity: "Zurich"    },
    PL: { name: "Poland",      defaultCity: "Warsaw"    },
    CZ: { name: "Czechia",     defaultCity: "Prague"    },
    RO: { name: "Romania",     defaultCity: "Bucharest" },
    US: { name: "USA",         defaultCity: "New York"  },
    CA: { name: "Canada",      defaultCity: "Toronto"   },
    AU: { name: "Australia",   defaultCity: "Sydney"    },
    SG: { name: "Singapore",   defaultCity: "Singapore" },
    AE: { name: "UAE",         defaultCity: "Dubai"     },
  },

  // ── City Metadata ─────────────────────────────────────────────────────────
  cities: {
    // Spain
    "Barcelona":       { market: "ES", symbol: "€"    },
    "Madrid":          { market: "ES", symbol: "€"    },
    "Valencia":        { market: "ES", symbol: "€"    },
    "Seville":         { market: "ES", symbol: "€"    },
    "Bilbao":          { market: "ES", symbol: "€"    },
    "Remote (Spain)":  { market: "ES", symbol: "€"    },
    // UK
    "London":          { market: "UK", symbol: "£"    },
    "Manchester":      { market: "UK", symbol: "£"    },
    "Edinburgh":       { market: "UK", symbol: "£"    },
    "Bristol":         { market: "UK", symbol: "£"    },
    "Remote (UK)":     { market: "UK", symbol: "£"    },
    // Germany
    "Berlin":          { market: "DE", symbol: "€"    },
    "Munich":          { market: "DE", symbol: "€"    },
    "Hamburg":         { market: "DE", symbol: "€"    },
    "Frankfurt":       { market: "DE", symbol: "€"    },
    "Cologne":         { market: "DE", symbol: "€"    },
    "Stuttgart":       { market: "DE", symbol: "€"    },
    "Remote (Germany)":{ market: "DE", symbol: "€"    },
    // Rest of Europe
    "Amsterdam":       { market: "NL", symbol: "€"    },
    "Paris":           { market: "FR", symbol: "€"    },
    "Dublin":          { market: "IE", symbol: "€"    },
    "Lisbon":          { market: "PT", symbol: "€"    },
    "Milan":           { market: "IT", symbol: "€"    },
    "Stockholm":       { market: "SE", symbol: "kr "  },
    "Copenhagen":      { market: "DK", symbol: "kr "  },
    "Zurich":          { market: "CH", symbol: "CHF " },
    "Geneva":          { market: "CH", symbol: "CHF " },
    "Warsaw":          { market: "PL", symbol: "zł "  },
    "Prague":          { market: "CZ", symbol: "Kč "  },
    "Bucharest":       { market: "RO", symbol: "lei " },
    "Remote (Europe)": { market: "EU", symbol: "€"    },
    // Americas
    "San Francisco":   { market: "US", symbol: "$"    },
    "New York":        { market: "US", symbol: "$"    },
    "Seattle":         { market: "US", symbol: "$"    },
    "Austin":          { market: "US", symbol: "$"    },
    "Boston":          { market: "US", symbol: "$"    },
    "Chicago":         { market: "US", symbol: "$"    },
    "Los Angeles":     { market: "US", symbol: "$"    },
    "Miami":           { market: "US", symbol: "$"    },
    "Remote (US)":     { market: "US", symbol: "$"    },
    "Toronto":         { market: "CA", symbol: "CA$"  },
    // APAC / MENA
    "Sydney":          { market: "AU", symbol: "A$"   },
    "Singapore":       { market: "SG", symbol: "S$"   },
    "Dubai":           { market: "AE", symbol: "AED " },
  },

  // ── Role Configuration ────────────────────────────────────────────────────
  // mul: global multiplier vs Software Engineer baseline
  // override: market-specific multiplier (takes precedence over mul)
  roles: {
    "Software Engineer":         { mul: 1.00 },
    "Backend Engineer":          { mul: 1.00 },
    "Full Stack Engineer":       { mul: 0.95 },
    "Frontend Engineer":         { mul: 0.92 },
    "Mobile Engineer":           { mul: 0.97 },
    "iOS Engineer":              { mul: 0.97 },
    "Android Engineer":          { mul: 0.95 },
    "Data Scientist":            { mul: 1.02 },
    "Data Engineer":             { mul: 1.00 },
    "Machine Learning Engineer": { mul: 1.12 },
    "DevOps Engineer":           { mul: 1.00 },
    "Site Reliability Engineer": { mul: 1.05 },
    "Platform Engineer":         { mul: 1.05 },
    "Security Engineer":         { mul: 1.07 },
    "QA Engineer":               { mul: 0.80 },
    "Product Manager":           { mul: 1.08, override: { ES: 1.03, UK: 1.14, DE: 1.06 } },
    "Engineering Manager":       { mul: 1.30, override: { ES: 1.22, UK: 1.40, DE: 1.28 } },
    "UX Designer":               { mul: 0.82 },
    "UI Designer":               { mul: 0.80 },
    "Product Designer":          { mul: 0.85 },
    "Marketing Manager":         { mul: 0.80 },
    "Growth Manager":            { mul: 0.86 },
    "Finance Analyst":           { mul: 0.78 },
    "Operations Manager":        { mul: 0.82 },
  },

  // ── Benchmarks ────────────────────────────────────────────────────────────
  // Software Engineer baseline, annual gross in local currency.
  // Initial markets (ES, UK, DE): manually researched per band.
  // Secondary markets: derived from mid-level surveys with band ratios.
  // p25 / p50 / p75 — no false precision beyond that.
  benchmarks: {

    // ── SPAIN ──────────────────────────────────────────────────────────────
    "Barcelona": {
      junior: { p25: 22000,  p50: 27000,  p75: 33000  },
      mid:    { p25: 38000,  p50: 48000,  p75: 60000  },
      senior: { p25: 58000,  p50: 70000,  p75: 85000  },
      staff:  { p25: 78000,  p50: 95000,  p75: 115000 },
    },
    "Madrid": {
      junior: { p25: 23000,  p50: 28000,  p75: 35000  },
      mid:    { p25: 40000,  p50: 51000,  p75: 63000  },
      senior: { p25: 61000,  p50: 74000,  p75: 89000  },
      staff:  { p25: 82000,  p50: 100000, p75: 120000 },
    },
    "Valencia": {
      junior: { p25: 18000,  p50: 22000,  p75: 28000  },
      mid:    { p25: 32000,  p50: 41000,  p75: 51000  },
      senior: { p25: 49000,  p50: 59000,  p75: 72000  },
      staff:  { p25: 66000,  p50: 81000,  p75: 98000  },
    },
    "Seville": {
      junior: { p25: 17000,  p50: 21000,  p75: 26000  },
      mid:    { p25: 29000,  p50: 38000,  p75: 47000  },
      senior: { p25: 44000,  p50: 54000,  p75: 66000  },
      staff:  { p25: 60000,  p50: 73000,  p75: 89000  },
    },
    "Bilbao": {
      junior: { p25: 19000,  p50: 24000,  p75: 30000  },
      mid:    { p25: 34000,  p50: 43000,  p75: 54000  },
      senior: { p25: 52000,  p50: 63000,  p75: 77000  },
      staff:  { p25: 70000,  p50: 85000,  p75: 103000 },
    },
    "Remote (Spain)": {
      junior: { p25: 22000,  p50: 27000,  p75: 34000  },
      mid:    { p25: 38000,  p50: 49000,  p75: 62000  },
      senior: { p25: 60000,  p50: 72000,  p75: 88000  },
      staff:  { p25: 80000,  p50: 98000,  p75: 118000 },
    },

    // ── UK ─────────────────────────────────────────────────────────────────
    "London": {
      junior: { p25: 34000,  p50: 41000,  p75: 50000  },
      mid:    { p25: 56000,  p50: 70000,  p75: 88000  },
      senior: { p25: 82000,  p50: 100000, p75: 126000 },
      staff:  { p25: 112000, p50: 140000, p75: 175000 },
    },
    "Manchester": {
      junior: { p25: 26000,  p50: 31000,  p75: 38000  },
      mid:    { p25: 40000,  p50: 52000,  p75: 65000  },
      senior: { p25: 58000,  p50: 73000,  p75: 92000  },
      staff:  { p25: 78000,  p50: 100000, p75: 126000 },
    },
    "Edinburgh": {
      junior: { p25: 27000,  p50: 32000,  p75: 40000  },
      mid:    { p25: 42000,  p50: 54000,  p75: 67000  },
      senior: { p25: 60000,  p50: 76000,  p75: 95000  },
      staff:  { p25: 82000,  p50: 104000, p75: 130000 },
    },
    "Bristol": {
      junior: { p25: 25000,  p50: 31000,  p75: 38000  },
      mid:    { p25: 40000,  p50: 51000,  p75: 63000  },
      senior: { p25: 57000,  p50: 72000,  p75: 90000  },
      staff:  { p25: 76000,  p50: 98000,  p75: 122000 },
    },
    "Remote (UK)": {
      junior: { p25: 30000,  p50: 37000,  p75: 45000  },
      mid:    { p25: 48000,  p50: 62000,  p75: 78000  },
      senior: { p25: 72000,  p50: 90000,  p75: 113000 },
      staff:  { p25: 96000,  p50: 124000, p75: 155000 },
    },

    // ── GERMANY ────────────────────────────────────────────────────────────
    "Berlin": {
      junior: { p25: 38000,  p50: 46000,  p75: 56000  },
      mid:    { p25: 57000,  p50: 69000,  p75: 83000  },
      senior: { p25: 78000,  p50: 95000,  p75: 114000 },
      staff:  { p25: 100000, p50: 123000, p75: 150000 },
    },
    "Munich": {
      junior: { p25: 44000,  p50: 53000,  p75: 64000  },
      mid:    { p25: 65000,  p50: 79000,  p75: 95000  },
      senior: { p25: 90000,  p50: 109000, p75: 130000 },
      staff:  { p25: 115000, p50: 141000, p75: 172000 },
    },
    "Hamburg": {
      junior: { p25: 41000,  p50: 50000,  p75: 61000  },
      mid:    { p25: 61000,  p50: 75000,  p75: 90000  },
      senior: { p25: 84000,  p50: 103000, p75: 123000 },
      staff:  { p25: 108000, p50: 132000, p75: 161000 },
    },
    "Frankfurt": {
      junior: { p25: 43000,  p50: 52000,  p75: 63000  },
      mid:    { p25: 64000,  p50: 78000,  p75: 94000  },
      senior: { p25: 88000,  p50: 107000, p75: 128000 },
      staff:  { p25: 113000, p50: 138000, p75: 167000 },
    },
    "Cologne": {
      junior: { p25: 40000,  p50: 48000,  p75: 58000  },
      mid:    { p25: 59000,  p50: 72000,  p75: 87000  },
      senior: { p25: 82000,  p50: 99000,  p75: 119000 },
      staff:  { p25: 105000, p50: 128000, p75: 156000 },
    },
    "Stuttgart": {
      junior: { p25: 42000,  p50: 51000,  p75: 62000  },
      mid:    { p25: 63000,  p50: 76000,  p75: 92000  },
      senior: { p25: 86000,  p50: 104000, p75: 125000 },
      staff:  { p25: 110000, p50: 135000, p75: 164000 },
    },
    "Remote (Germany)": {
      junior: { p25: 39000,  p50: 48000,  p75: 58000  },
      mid:    { p25: 58000,  p50: 71000,  p75: 86000  },
      senior: { p25: 80000,  p50: 98000,  p75: 118000 },
      staff:  { p25: 104000, p50: 128000, p75: 155000 },
    },

    // ── REST OF EUROPE ─────────────────────────────────────────────────────
    // Derived from mid-level surveys. Bands scaled proportionally.
    "Amsterdam": {
      junior: { p25: 34000,  p50: 43000,  p75: 54000  },
      mid:    { p25: 60000,  p50: 76000,  p75: 97000  },
      senior: { p25: 94000,  p50: 118000, p75: 143000 },
      staff:  { p25: 126000, p50: 155000, p75: 187000 },
    },
    "Paris": {
      junior: { p25: 28000,  p50: 36000,  p75: 45000  },
      mid:    { p25: 50000,  p50: 63000,  p75: 81000  },
      senior: { p25: 79000,  p50: 99000,  p75: 120000 },
      staff:  { p25: 105000, p50: 130000, p75: 156000 },
    },
    "Dublin": {
      junior: { p25: 32000,  p50: 42000,  p75: 53000  },
      mid:    { p25: 58000,  p50: 74000,  p75: 95000  },
      senior: { p25: 92000,  p50: 116000, p75: 141000 },
      staff:  { p25: 124000, p50: 152000, p75: 183000 },
    },
    "Lisbon": {
      junior: { p25: 15000,  p50: 19000,  p75: 26000  },
      mid:    { p25: 26000,  p50: 36000,  p75: 50000  },
      senior: { p25: 49000,  p50: 61000,  p75: 74000  },
      staff:  { p25: 65000,  p50: 80000,  p75: 97000  },
    },
    "Milan": {
      junior: { p25: 22000,  p50: 29000,  p75: 38000  },
      mid:    { p25: 40000,  p50: 53000,  p75: 70000  },
      senior: { p25: 68000,  p50: 85000,  p75: 104000 },
      staff:  { p25: 91000,  p50: 112000, p75: 135000 },
    },
    "Stockholm": {
      junior: { p25: 302000, p50: 389000, p75: 475000  },
      mid:    { p25: 540000, p50: 660000, p75: 820000  },
      senior: { p25: 795000, p50: 1000000,p75: 1214000 },
      staff:  { p25: 1066000,p50: 1312000,p75: 1583000 },
    },
    "Copenhagen": {
      junior: { p25: 274000, p50: 353000, p75: 432000  },
      mid:    { p25: 490000, p50: 600000, p75: 745000  },
      senior: { p25: 723000, p50: 909000, p75: 1103000 },
      staff:  { p25: 969000, p50: 1192000,p75: 1438000 },
    },
    "Zurich": {
      junior: { p25: 63000,  p50: 81000,  p75: 97000  },
      mid:    { p25: 112000, p50: 134000, p75: 160000 },
      senior: { p25: 155000, p50: 195000, p75: 237000 },
      staff:  { p25: 208000, p50: 256000, p75: 309000 },
    },
    "Geneva": {
      junior: { p25: 65000,  p50: 84000,  p75: 100000 },
      mid:    { p25: 116000, p50: 138000, p75: 166000 },
      senior: { p25: 161000, p50: 202000, p75: 246000 },
      staff:  { p25: 216000, p50: 266000, p75: 320000 },
    },
    "Warsaw": {
      junior: { p25: 59000,  p50: 76000,  p75: 101000 },
      mid:    { p25: 106000, p50: 140000, p75: 182000 },
      senior: { p25: 177000, p50: 222000, p75: 269000 },
      staff:  { p25: 237000, p50: 291000, p75: 351000 },
    },
    "Prague": {
      junior: { p25: 571000, p50: 734000, p75: 950000  },
      mid:    { p25: 1020000,p50: 1320000,p75: 1680000 },
      senior: { p25: 1630000,p50: 2046000,p75: 2486000 },
      staff:  { p25: 2184000,p50: 2688000,p75: 3242000 },
    },
    "Bucharest": {
      junior: { p25: 44000,  p50: 56000,  p75: 76000  },
      mid:    { p25: 78000,  p50: 106000, p75: 140000 },
      senior: { p25: 136000, p50: 171000, p75: 207000 },
      staff:  { p25: 182000, p50: 224000, p75: 270000 },
    },
    "Remote (Europe)": {
      junior: { p25: 28000,  p50: 36000,  p75: 48000  },
      mid:    { p25: 50000,  p50: 66000,  p75: 86000  },
      senior: { p25: 83000,  p50: 105000, p75: 127000 },
      staff:  { p25: 112000, p50: 138000, p75: 166000 },
    },

    // ── AMERICAS ───────────────────────────────────────────────────────────
    "San Francisco": {
      junior: { p25: 84000,  p50: 108000, p75: 138000 },
      mid:    { p25: 150000, p50: 192000, p75: 250000 },
      senior: { p25: 243000, p50: 305000, p75: 370000 },
      staff:  { p25: 325000, p50: 400000, p75: 483000 },
    },
    "New York": {
      junior: { p25: 77000,  p50: 99000,  p75: 128000 },
      mid:    { p25: 138000, p50: 178000, p75: 230000 },
      senior: { p25: 223000, p50: 280000, p75: 340000 },
      staff:  { p25: 299000, p50: 369000, p75: 444000 },
    },
    "Seattle": {
      junior: { p25: 81000,  p50: 104000, p75: 133000 },
      mid:    { p25: 144000, p50: 184000, p75: 240000 },
      senior: { p25: 233000, p50: 293000, p75: 355000 },
      staff:  { p25: 312000, p50: 384000, p75: 463000 },
    },
    "Austin": {
      junior: { p25: 63000,  p50: 81000,  p75: 105000 },
      mid:    { p25: 112000, p50: 146000, p75: 192000 },
      senior: { p25: 186000, p50: 234000, p75: 284000 },
      staff:  { p25: 250000, p50: 307000, p75: 370000 },
    },
    "Boston": {
      junior: { p25: 66000,  p50: 85000,  p75: 111000 },
      mid:    { p25: 118000, p50: 154000, p75: 200000 },
      senior: { p25: 194000, p50: 244000, p75: 296000 },
      staff:  { p25: 260000, p50: 320000, p75: 386000 },
    },
    "Chicago": {
      junior: { p25: 63000,  p50: 81000,  p75: 104000 },
      mid:    { p25: 112000, p50: 144000, p75: 188000 },
      senior: { p25: 182000, p50: 229000, p75: 278000 },
      staff:  { p25: 244000, p50: 301000, p75: 363000 },
    },
    "Los Angeles": {
      junior: { p25: 71000,  p50: 91000,  p75: 118000 },
      mid:    { p25: 126000, p50: 164000, p75: 214000 },
      senior: { p25: 208000, p50: 261000, p75: 317000 },
      staff:  { p25: 278000, p50: 342000, p75: 413000 },
    },
    "Miami": {
      junior: { p25: 57000,  p50: 74000,  p75: 97000  },
      mid:    { p25: 102000, p50: 134000, p75: 176000 },
      senior: { p25: 171000, p50: 215000, p75: 261000 },
      staff:  { p25: 229000, p50: 282000, p75: 340000 },
    },
    "Remote (US)": {
      junior: { p25: 74000,  p50: 95000,  p75: 121000 },
      mid:    { p25: 132000, p50: 168000, p75: 218000 },
      senior: { p25: 211000, p50: 265000, p75: 323000 },
      staff:  { p25: 283000, p50: 349000, p75: 421000 },
    },
    "Toronto": {
      junior: { p25: 55000,  p50: 71000,  p75: 91000  },
      mid:    { p25: 98000,  p50: 128000, p75: 164000 },
      senior: { p25: 159000, p50: 200000, p75: 243000 },
      staff:  { p25: 213000, p50: 262000, p75: 317000 },
    },

    // ── APAC / MENA ────────────────────────────────────────────────────────
    "Sydney": {
      junior: { p25: 63000,  p50: 81000,  p75: 104000 },
      mid:    { p25: 112000, p50: 145000, p75: 184000 },
      senior: { p25: 178000, p50: 224000, p75: 272000 },
      staff:  { p25: 239000, p50: 294000, p75: 355000 },
    },
    "Singapore": {
      junior: { p25: 48000,  p50: 62000,  p75: 80000  },
      mid:    { p25: 86000,  p50: 110000, p75: 140000 },
      senior: { p25: 136000, p50: 171000, p75: 207000 },
      staff:  { p25: 182000, p50: 224000, p75: 270000 },
    },
    "Dubai": {
      junior: { p25: 106000, p50: 137000, p75: 180000 },
      mid:    { p25: 190000, p50: 250000, p75: 322000 },
      senior: { p25: 312000, p50: 393000, p75: 477000 },
      staff:  { p25: 419000, p50: 515000, p75: 621000 },
    },
  },

}; // end CV_DATA
