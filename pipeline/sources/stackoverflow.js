'use strict';

/**
 * Stack Overflow Developer Survey source
 *
 * DATA: Stack Overflow Annual Developer Survey — public CSV dataset.
 * Released annually under ODbL (Open Database Licence).
 * Download: https://survey.stackoverflow.co/{year}/
 *
 * HOW TO USE:
 *   1. Go to https://survey.stackoverflow.co/ and download the latest results CSV
 *   2. Place the file at: pipeline/data/so_survey/so_survey_<year>.csv
 *      e.g., pipeline/data/so_survey/so_survey_2024.csv
 *   3. Run: npm run sources:so  (from pipeline/ directory)
 *
 * COLUMNS WE USE:
 *   DevType           — e.g. "Developer, back-end;Developer, full-stack"
 *   ConvertedCompYearly — annual comp in USD (Stack Overflow converts all)
 *   Country           — e.g. "United Kingdom"
 *   YearsCodePro      — professional coding years (string, "1 to 2 years", "10 to 14 years" etc.)
 *   Employment        — "Employed, full-time"
 *   OrgSize           — company size (for filtering)
 *   EdLevel           — education level
 *   WorkExp           — (newer surveys) years of professional work experience
 *
 * After filtering for full-time employed with valid USD comp, we group by
 * country + DevType and compute p25/p50/p75 from the distribution.
 *
 * Note: SO survey has self-selection bias toward developers active on the platform.
 * It skews slightly toward senior engineers and western markets.
 * Weight it alongside BLS/ONS data, not as a standalone source.
 */

const fs   = require('fs');
const path = require('path');
const db   = require('../db');

const DATA_DIR = path.join(__dirname, '..', 'data', 'so_survey');

// SO DevType values → CompVerdict roles
const DEVTYPE_TO_ROLE = {
  'Developer, back-end':              ['Backend Engineer', 'Software Engineer'],
  'Developer, front-end':             ['Frontend Engineer'],
  'Developer, full-stack':            ['Full Stack Engineer', 'Software Engineer'],
  'Developer, mobile':                ['Mobile Engineer'],
  'Data scientist or machine learning specialist': ['Data Scientist', 'Machine Learning Engineer'],
  'Data or business analyst':         ['Data Scientist'],
  'DevOps specialist':                ['DevOps Engineer', 'Site Reliability Engineer'],
  'Engineer, site reliability':       ['Site Reliability Engineer', 'DevOps Engineer'],
  'Developer, desktop or enterprise applications': ['Backend Engineer'],
  'Engineer, data':                   ['Data Engineer'],
  'Developer, embedded applications or devices': ['Backend Engineer'],
  'Security professional':            ['Security Engineer'],
  'Product manager':                  ['Product Manager'],
  'Engineer, platform':               ['Platform Engineer'],
  'Designer':                         ['UX Designer', 'UI Designer'],
  'Engineering manager':              ['Engineering Manager'],
};

// Country → CompVerdict cities (primary mapping)
// SO data is at country level, so we map to the primary city or "Remote (X)" marker
const COUNTRY_TO_CITIES = {
  'United States of America': ['San Francisco', 'New York', 'Austin', 'Remote (US)'],
  'United Kingdom':            ['London', 'Remote (UK)'],
  'Germany':                   ['Berlin', 'Munich', 'Remote (Germany)'],
  'Spain':                     ['Barcelona', 'Madrid', 'Remote (Spain)'],
  'France':                    ['Paris'],
  'Netherlands':               ['Amsterdam'],
  'Ireland':                   ['Dublin'],
  'Canada':                    ['Toronto'],
  'Singapore':                 ['Singapore'],
  'Australia':                 ['Sydney'],
  'Portugal':                  ['Lisbon'],
  'Switzerland':               ['Zurich'],
  'Sweden':                    ['Stockholm'],
  'Denmark':                   ['Copenhagen'],
  'Poland':                    ['Warsaw'],
};

// YearsCodePro string → approximate band
function yearsToExperienceBand(yearsStr) {
  if (!yearsStr) return null;
  const s = String(yearsStr).toLowerCase();
  if (s === 'less than 1 year' || s === '0')  return 'junior';
  if (s === '1 to 2 years' || s === '1')       return 'junior';
  if (s === '2 to 3 years' || s === '2')       return 'junior';
  if (s === '3 to 4 years' || s === '3')       return 'mid';
  if (s === '4 to 5 years' || s === '4')       return 'mid';
  if (s === '5 to 6 years' || s === '5')       return 'mid';
  if (s === '6 to 7 years' || s === '6')       return 'senior';
  if (s === '7 to 8 years' || s === '7')       return 'senior';
  if (s === '8 to 9 years' || s === '8')       return 'senior';
  if (s === '9 to 10 years' || s === '9')      return 'senior';
  if (s.includes('10 to')) return 'senior';
  if (s.includes('11 to') || s.includes('12 to') || s.includes('13 to') || s.includes('14 to')) return 'staff';
  if (s.includes('15 to') || s.includes('16 to') || s.includes('17 to') || s.includes('18 to') || s.includes('19 to')) return 'staff';
  if (s === 'more than 50 years') return 'staff';
  // Try numeric
  const n = parseInt(s, 10);
  if (!isNaN(n)) {
    if (n <= 2)  return 'junior';
    if (n <= 5)  return 'mid';
    if (n <= 10) return 'senior';
    return 'staff';
  }
  return null;
}

function percentile(sorted, p) {
  if (!sorted.length) return null;
  const idx = (p / 100) * (sorted.length - 1);
  const lo  = Math.floor(idx);
  const hi  = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

async function fetchStackOverflow() {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  // Find available survey files
  const files = fs.existsSync(DATA_DIR)
    ? fs.readdirSync(DATA_DIR).filter(f => f.match(/so_survey_\d{4}\.csv$/i))
    : [];

  if (files.length === 0) {
    console.warn('  [so] no survey CSV found');
    console.warn(`  [so] download from https://survey.stackoverflow.co/ and place at:`);
    console.warn(`       ${DATA_DIR}/so_survey_<year>.csv`);
    return [];
  }

  // Use the most recent file
  files.sort().reverse();
  const surveyFile = path.join(DATA_DIR, files[0]);
  const surveyYear = files[0].match(/(\d{4})/)?.[1] ?? 'unknown';
  console.log(`  [so] parsing ${files[0]} (year ${surveyYear})`);

  const { parse } = require('csv-parse/sync');
  const raw = fs.readFileSync(surveyFile, 'utf8');

  let rows;
  try {
    rows = parse(raw, {
      columns: true,
      skip_empty_lines: true,
      relax_quotes: true,
      relax_column_count: true,
      trim: true,
    });
  } catch (e) {
    console.error(`  [so] CSV parse error: ${e.message}`);
    return [];
  }

  console.log(`  [so] loaded ${rows.length} survey responses`);

  // Filter: full-time employed, valid salary
  const filtered = rows.filter(row => {
    const emp  = (row.Employment ?? '').toLowerCase();
    const comp = parseFloat(row.ConvertedCompYearly ?? row.ConvertedComp ?? '');
    return emp.includes('full-time') && !isNaN(comp) && comp > 5000 && comp < 2_000_000;
  });

  console.log(`  [so] ${filtered.length} full-time responses with valid comp`);

  // Group: country × devtype × band → array of salary values
  const groups = new Map();

  for (const row of filtered) {
    const country  = row.Country?.trim();
    const devTypes = (row.DevType ?? '').split(';').map(s => s.trim()).filter(Boolean);
    const yearsStr = row.YearsCodePro ?? row.WorkExp ?? '';
    const band     = yearsToExperienceBand(yearsStr);
    const comp     = parseFloat(row.ConvertedCompYearly ?? row.ConvertedComp ?? '');

    if (!country || !devTypes.length || !band || isNaN(comp)) continue;
    if (!COUNTRY_TO_CITIES[country]) continue;

    for (const devType of devTypes) {
      if (!DEVTYPE_TO_ROLE[devType]) continue;
      const key = `${country}||${devType}||${band}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(comp);
    }
  }

  console.log(`  [so] ${groups.size} country×devtype×band groups`);

  const now = new Date().toISOString();
  const observations = [];
  const MIN_SAMPLE = 15; // minimum sample size for statistical validity

  for (const [key, values] of groups.entries()) {
    if (values.length < MIN_SAMPLE) continue;

    const [country, devType, band] = key.split('||');
    const sorted = values.slice().sort((a, b) => a - b);
    const p25Val = Math.round(percentile(sorted, 25));
    const p50Val = Math.round(percentile(sorted, 50));
    const p75Val = Math.round(percentile(sorted, 75));

    // Map devtype to role names
    const roles = DEVTYPE_TO_ROLE[devType] ?? [];

    for (const role of roles) {
      for (const [metric, value] of [['p25', p25Val], ['p50', p50Val], ['p75', p75Val]]) {
        observations.push({
          source:           'stackoverflow',
          source_version:   surveyYear,
          occupation_code:  devType.replace(/[^a-zA-Z0-9_]/g, '_').substring(0, 50),
          occupation_label: `${devType} (${band})`,
          geography_code:   `SO_${country.replace(/[^a-zA-Z]/g, '_').substring(0, 30)}`,
          geography_label:  country,
          metric,
          value,
          currency:         'USD', // SO normalises all to USD
          sample_n:         values.length,
          period:           surveyYear,
          fetched_at:       now,
        });
      }
    }
  }

  console.log(`  [so] generated ${observations.length} observations`);
  if (observations.length > 0) {
    db.saveObservations(observations);
  }
  return observations;
}

// Standalone run
if (require.main === module) {
  fetchStackOverflow()
    .then(obs => console.log(`\nGot ${obs.length} observations`))
    .catch(err => { console.error(err); process.exit(1); });
}

module.exports = { fetchStackOverflow, DEVTYPE_TO_ROLE, COUNTRY_TO_CITIES };
