/**
 * CompVerdict — Benchmark Dataset
 * Version: 2026-Q1-r2
 *
 * METHODOLOGY
 * -----------
 * Baseline role: Software Engineer
 * Baseline band: Mid (3–5 YoE)
 * Sources: BLS OEWS (US), ONS ASHE (UK), INE EES + Eurostat SES (Spain/Europe),
 *          Destatis VSE (Germany), Stack Overflow Developer Survey (global),
 *          ECB exchange rates
 * Calibration: weighted median across sources (official govt 3×, survey 1×)
 * Cross-validated against SalaryVerdict benchmark engine outputs (2026-Q1)
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

  version: "2026-Q1",

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
    // Recalibrated 2026-Q1 against INE EES + Eurostat SES (weighted median).
    // Scale factor 0.80 applied vs previous version which over-weighted survey data.
    "Barcelona": {
      junior: { p25: 18500,  p50: 22500,  p75: 27500  },
      mid:    { p25: 31500,  p50: 40000,  p75: 50000  },
      senior: { p25: 48500,  p50: 58500,  p75: 71000  },
      staff:  { p25: 65000,  p50: 79000,  p75: 96000  },
    },
    "Madrid": {
      junior: { p25: 19000,  p50: 23000,  p75: 29000  },
      mid:    { p25: 33000,  p50: 42500,  p75: 52500  },
      senior: { p25: 51000,  p50: 61500,  p75: 74000  },
      staff:  { p25: 68500,  p50: 83000,  p75: 100000 },
    },
    "Valencia": {
      junior: { p25: 15000,  p50: 18500,  p75: 23000  },
      mid:    { p25: 27000,  p50: 34000,  p75: 42500  },
      senior: { p25: 41000,  p50: 49000,  p75: 60000  },
      staff:  { p25: 55000,  p50: 67000,  p75: 81500  },
    },
    "Seville": {
      junior: { p25: 14000,  p50: 17500,  p75: 21500  },
      mid:    { p25: 24000,  p50: 31500,  p75: 39000  },
      senior: { p25: 37000,  p50: 45000,  p75: 55000  },
      staff:  { p25: 50000,  p50: 61000,  p75: 74000  },
    },
    "Bilbao": {
      junior: { p25: 16000,  p50: 20000,  p75: 25000  },
      mid:    { p25: 28500,  p50: 35500,  p75: 45000  },
      senior: { p25: 43000,  p50: 52500,  p75: 64000  },
      staff:  { p25: 58500,  p50: 71000,  p75: 85500  },
    },
    "Remote (Spain)": {
      junior: { p25: 18500,  p50: 22500,  p75: 28500  },
      mid:    { p25: 31500,  p50: 41000,  p75: 51500  },
      senior: { p25: 50000,  p50: 60000,  p75: 73000  },
      staff:  { p25: 66500,  p50: 81500,  p75: 98500  },
    },

    // ── UK ─────────────────────────────────────────────────────────────────
    "London": {
      junior: { p25: 35500,  p50: 42500,  p75: 52000  },
      mid:    { p25: 58000,  p50: 73000,  p75: 91500  },
      senior: { p25: 85500,  p50: 104000, p75: 131000 },
      staff:  { p25: 116000, p50: 146000, p75: 182000 },
    },
    "Manchester": {
      junior: { p25: 27000,  p50: 32000,  p75: 39500  },
      mid:    { p25: 41500,  p50: 54000,  p75: 67500  },
      senior: { p25: 60500,  p50: 76000,  p75: 95500  },
      staff:  { p25: 81000,  p50: 104000, p75: 131000 },
    },
    "Edinburgh": {
      junior: { p25: 28000,  p50: 33500,  p75: 41500  },
      mid:    { p25: 43500,  p50: 56000,  p75: 69500  },
      senior: { p25: 62500,  p50: 79000,  p75: 99000  },
      staff:  { p25: 85500,  p50: 108000, p75: 135000 },
    },
    "Bristol": {
      junior: { p25: 26000,  p50: 32000,  p75: 39500  },
      mid:    { p25: 41500,  p50: 53000,  p75: 65500  },
      senior: { p25: 59500,  p50: 75000,  p75: 93500  },
      staff:  { p25: 79000,  p50: 102000, p75: 127000 },
    },
    "Remote (UK)": {
      junior: { p25: 31000,  p50: 38500,  p75: 47000  },
      mid:    { p25: 50000,  p50: 64500,  p75: 81000  },
      senior: { p25: 75000,  p50: 93500,  p75: 118000 },
      staff:  { p25: 100000, p50: 129000, p75: 161000 },
    },

    // ── GERMANY ────────────────────────────────────────────────────────────
    // Recalibrated 2026-Q1 against Destatis VSE + Eurostat SES (weighted median).
    // Scale factor ~0.817 applied vs previous version which over-weighted levels.fyi data.
    "Berlin": {
      junior: { p25: 32000,  p50: 39000,  p75: 47000  },
      mid:    { p25: 48000,  p50: 58000,  p75: 70000  },
      senior: { p25: 66000,  p50: 80000,  p75: 95500  },
      staff:  { p25: 84000,  p50: 103500, p75: 126000 },
    },
    "Munich": {
      junior: { p25: 37000,  p50: 44500,  p75: 54000  },
      mid:    { p25: 54500,  p50: 66500,  p75: 80000  },
      senior: { p25: 75500,  p50: 91500,  p75: 109500 },
      staff:  { p25: 96500,  p50: 118500, p75: 144500 },
    },
    "Hamburg": {
      junior: { p25: 34500,  p50: 42000,  p75: 51500  },
      mid:    { p25: 51500,  p50: 63000,  p75: 75500  },
      senior: { p25: 70500,  p50: 86500,  p75: 103500 },
      staff:  { p25: 90500,  p50: 111000, p75: 135500 },
    },
    "Frankfurt": {
      junior: { p25: 36500,  p50: 43500,  p75: 53000  },
      mid:    { p25: 54000,  p50: 66000,  p75: 79000  },
      senior: { p25: 74000,  p50: 90000,  p75: 108000 },
      staff:  { p25: 95000,  p50: 116000, p75: 140500 },
    },
    "Cologne": {
      junior: { p25: 33500,  p50: 40500,  p75: 48500  },
      mid:    { p25: 50000,  p50: 60500,  p75: 73000  },
      senior: { p25: 69000,  p50: 83500,  p75: 100500 },
      staff:  { p25: 88000,  p50: 108000, p75: 131500 },
    },
    "Stuttgart": {
      junior: { p25: 35500,  p50: 43000,  p75: 52500  },
      mid:    { p25: 53000,  p50: 64000,  p75: 77500  },
      senior: { p25: 72500,  p50: 87500,  p75: 105500 },
      staff:  { p25: 92500,  p50: 113500, p75: 138000 },
    },
    "Remote (Germany)": {
      junior: { p25: 32500,  p50: 40500,  p75: 48500  },
      mid:    { p25: 48500,  p50: 59500,  p75: 72500  },
      senior: { p25: 67500,  p50: 82500,  p75: 99500  },
      staff:  { p25: 87500,  p50: 108000, p75: 130500 },
    },

    // ── REST OF EUROPE ─────────────────────────────────────────────────────
    // Derived from mid-level surveys. Bands scaled proportionally.
    "Amsterdam": {
      junior: { p25: 35000,  p50: 44500,  p75: 55500  },
      mid:    { p25: 62000,  p50: 78500,  p75: 100000 },
      senior: { p25: 97000,  p50: 122000, p75: 147000 },
      staff:  { p25: 130000, p50: 160000, p75: 193000 },
    },
    "Paris": {
      junior: { p25: 29000,  p50: 37000,  p75: 46500  },
      mid:    { p25: 51500,  p50: 65000,  p75: 83500  },
      senior: { p25: 81500,  p50: 102000, p75: 124000 },
      staff:  { p25: 108000, p50: 134000, p75: 161000 },
    },
    "Dublin": {
      junior: { p25: 33500,  p50: 44000,  p75: 55500  },
      mid:    { p25: 61000,  p50: 77500,  p75: 100000 },
      senior: { p25: 96500,  p50: 122000, p75: 148000 },
      staff:  { p25: 130000, p50: 160000, p75: 192000 },
    },
    "Lisbon": {
      junior: { p25: 16000,  p50: 20000,  p75: 27500  },
      mid:    { p25: 27500,  p50: 38000,  p75: 53000  },
      senior: { p25: 52000,  p50: 64500,  p75: 78500  },
      staff:  { p25: 69000,  p50: 85000,  p75: 103000 },
    },
    "Milan": {
      junior: { p25: 22500,  p50: 30000,  p75: 39000  },
      mid:    { p25: 41000,  p50: 54500,  p75: 72000  },
      senior: { p25: 70000,  p50: 87500,  p75: 107000 },
      staff:  { p25: 93500,  p50: 115000, p75: 139000 },
    },
    "Stockholm": {
      junior: { p25: 308000, p50: 397000, p75: 484000  },
      mid:    { p25: 551000, p50: 673000, p75: 836000  },
      senior: { p25: 811000, p50: 1020000,p75: 1238000 },
      staff:  { p25: 1087000,p50: 1338000,p75: 1615000 },
    },
    "Copenhagen": {
      junior: { p25: 279000, p50: 360000, p75: 441000  },
      mid:    { p25: 500000, p50: 612000, p75: 760000  },
      senior: { p25: 737000, p50: 927000, p75: 1125000 },
      staff:  { p25: 988000, p50: 1216000,p75: 1467000 },
    },
    "Zurich": {
      junior: { p25: 64500,  p50: 82500,  p75: 99000  },
      mid:    { p25: 114000, p50: 137000, p75: 163000 },
      senior: { p25: 158000, p50: 199000, p75: 242000 },
      staff:  { p25: 212000, p50: 261000, p75: 315000 },
    },
    "Geneva": {
      junior: { p25: 66500,  p50: 85500,  p75: 102000 },
      mid:    { p25: 118000, p50: 141000, p75: 169000 },
      senior: { p25: 164000, p50: 206000, p75: 251000 },
      staff:  { p25: 220000, p50: 271000, p75: 326000 },
    },
    "Warsaw": {
      junior: { p25: 63000,  p50: 81500,  p75: 108000  },
      mid:    { p25: 113000, p50: 150000, p75: 195000  },
      senior: { p25: 189000, p50: 238000, p75: 288000  },
      staff:  { p25: 254000, p50: 311000, p75: 376000  },
    },
    "Prague": {
      junior: { p25: 605000, p50: 778000, p75: 1007000  },
      mid:    { p25: 1081000,p50: 1399000,p75: 1781000  },
      senior: { p25: 1728000,p50: 2169000,p75: 2635000  },
      staff:  { p25: 2315000,p50: 2849000,p75: 3437000  },
    },
    "Bucharest": {
      junior: { p25: 47500,  p50: 60500,  p75: 82000  },
      mid:    { p25: 84000,  p50: 114000, p75: 151000 },
      senior: { p25: 147000, p50: 185000, p75: 224000 },
      staff:  { p25: 197000, p50: 242000, p75: 292000 },
    },
    "Remote (Europe)": {
      junior: { p25: 28000,  p50: 36000,  p75: 48000  },
      mid:    { p25: 50000,  p50: 66000,  p75: 86000  },
      senior: { p25: 83000,  p50: 105000, p75: 127000 },
      staff:  { p25: 112000, p50: 138000, p75: 166000 },
    },

    // ── AMERICAS ───────────────────────────────────────────────────────────
    "San Francisco": {
      junior: { p25: 85500,  p50: 110000, p75: 141000 },
      mid:    { p25: 153000, p50: 196000, p75: 255000 },
      senior: { p25: 248000, p50: 311000, p75: 377000 },
      staff:  { p25: 332000, p50: 408000, p75: 493000 },
    },
    "New York": {
      junior: { p25: 78500,  p50: 101000, p75: 131000 },
      mid:    { p25: 141000, p50: 182000, p75: 235000 },
      senior: { p25: 227000, p50: 286000, p75: 347000 },
      staff:  { p25: 305000, p50: 376000, p75: 453000 },
    },
    "Seattle": {
      junior: { p25: 82500,  p50: 106000, p75: 136000 },
      mid:    { p25: 147000, p50: 188000, p75: 245000 },
      senior: { p25: 238000, p50: 299000, p75: 362000 },
      staff:  { p25: 318000, p50: 392000, p75: 472000 },
    },
    "Austin": {
      junior: { p25: 64500,  p50: 82500,  p75: 107000 },
      mid:    { p25: 114000, p50: 149000, p75: 196000 },
      senior: { p25: 190000, p50: 239000, p75: 290000 },
      staff:  { p25: 255000, p50: 313000, p75: 377000 },
    },
    "Boston": {
      junior: { p25: 67500,  p50: 86500,  p75: 113000 },
      mid:    { p25: 120000, p50: 157000, p75: 204000 },
      senior: { p25: 198000, p50: 249000, p75: 302000 },
      staff:  { p25: 265000, p50: 326000, p75: 394000 },
    },
    "Chicago": {
      junior: { p25: 64500,  p50: 82500,  p75: 106000 },
      mid:    { p25: 114000, p50: 147000, p75: 192000 },
      senior: { p25: 186000, p50: 234000, p75: 284000 },
      staff:  { p25: 249000, p50: 307000, p75: 370000 },
    },
    "Los Angeles": {
      junior: { p25: 72500,  p50: 93000,  p75: 120000 },
      mid:    { p25: 129000, p50: 167000, p75: 218000 },
      senior: { p25: 212000, p50: 266000, p75: 323000 },
      staff:  { p25: 284000, p50: 349000, p75: 421000 },
    },
    "Miami": {
      junior: { p25: 58000,  p50: 75500,  p75: 99000  },
      mid:    { p25: 104000, p50: 137000, p75: 180000 },
      senior: { p25: 174000, p50: 219000, p75: 266000 },
      staff:  { p25: 234000, p50: 288000, p75: 347000 },
    },
    "Remote (US)": {
      junior: { p25: 75500,  p50: 97000,  p75: 123000 },
      mid:    { p25: 135000, p50: 171000, p75: 222000 },
      senior: { p25: 215000, p50: 270000, p75: 329000 },
      staff:  { p25: 289000, p50: 356000, p75: 429000 },
    },
    "Toronto": {
      junior: { p25: 56500,  p50: 73000,  p75: 93500  },
      mid:    { p25: 101000, p50: 132000, p75: 169000 },
      senior: { p25: 164000, p50: 206000, p75: 250000 },
      staff:  { p25: 219000, p50: 270000, p75: 327000 },
    },

    // ── APAC / MENA ────────────────────────────────────────────────────────
    "Sydney": {
      junior: { p25: 65000,  p50: 83500,  p75: 107000 },
      mid:    { p25: 115000, p50: 149000, p75: 190000 },
      senior: { p25: 183000, p50: 231000, p75: 280000 },
      staff:  { p25: 246000, p50: 303000, p75: 366000 },
    },
    "Singapore": {
      junior: { p25: 50000,  p50: 64500,  p75: 83000  },
      mid:    { p25: 89500,  p50: 114000, p75: 146000 },
      senior: { p25: 141000, p50: 178000, p75: 215000 },
      staff:  { p25: 189000, p50: 233000, p75: 281000 },
    },
    "Dubai": {
      junior: { p25: 110000, p50: 142000, p75: 187000 },
      mid:    { p25: 198000, p50: 260000, p75: 335000 },
      senior: { p25: 324000, p50: 409000, p75: 496000 },
      staff:  { p25: 436000, p50: 536000, p75: 646000 },
    },
  },

}; // end CV_DATA
