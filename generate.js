#!/usr/bin/env node
'use strict';

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

// ── Load CV_DATA via vm (data.js uses window.CV_DATA) ─────────────────────────
const dataSource = fs.readFileSync(path.join(__dirname, 'data.js'), 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(dataSource, sandbox);
const CV_DATA = sandbox.window.CV_DATA;

// ── Config ───────────────────────────────────────────────────────────────────
const SITE_URL = 'https://comp-verdict.netlify.app';

const SALARY_ROLES = [
  'Software Engineer',
  'Product Manager',
  'Data Scientist',
  'Engineering Manager',
  'Frontend Engineer',
  'Backend Engineer',
  'Full Stack Engineer',
  'DevOps Engineer',
  'Machine Learning Engineer',
  'UX Designer',
];

const SALARY_CITIES = [
  'Barcelona', 'Madrid', 'London', 'Amsterdam', 'Berlin', 'Munich', 'Paris',
  'Dublin', 'Lisbon', 'Frankfurt', 'San Francisco', 'New York', 'Austin',
  'Toronto', 'Singapore', 'Remote (Spain)', 'Remote (UK)', 'Remote (Germany)', 'Remote (US)',
];

const NEGOTIATE_CITIES = [
  'Barcelona', 'Madrid', 'London', 'Amsterdam', 'Berlin', 'Munich',
  'San Francisco', 'New York',
];

const BAND_LABELS = {
  junior: 'Junior (0–2 yrs)',
  mid:    'Mid-level (3–5 yrs)',
  senior: 'Senior (6–10 yrs)',
  staff:  'Staff / Lead (11+ yrs)',
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function slug(str) {
  return str.toLowerCase()
    .replace(/[()]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/-$/, '');
}

function fmt(n, symbol) {
  if (!n) return symbol + '0';
  if (n >= 1000000) return symbol + (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return symbol + Math.round(n / 1000) + 'k';
  return symbol + n.toLocaleString();
}

function getRange(role, city) {
  const cityMeta = CV_DATA.cities[city];
  if (!cityMeta) return null;

  let benchmarks = CV_DATA.benchmarks[city];
  if (!benchmarks) {
    const defaultCity = CV_DATA.markets[cityMeta.market]?.defaultCity;
    if (defaultCity && CV_DATA.benchmarks[defaultCity]) {
      benchmarks = CV_DATA.benchmarks[defaultCity];
    }
  }
  if (!benchmarks) return null;

  const roleConfig = CV_DATA.roles[role] || { mul: 1.0 };
  const mul = roleConfig.override?.[cityMeta.market] ?? roleConfig.mul;
  const { symbol } = cityMeta;

  const bands = {};
  for (const band of ['junior', 'mid', 'senior', 'staff']) {
    const b = benchmarks[band];
    if (!b) continue;
    bands[band] = {
      p25: Math.round(b.p25 * mul),
      p50: Math.round(b.p50 * mul),
      p75: Math.round(b.p75 * mul),
    };
  }
  return { bands, symbol };
}

// ── Content: city context ─────────────────────────────────────────────────────
const CITY_DESC = {
  'Barcelona':        "Barcelona's tech scene is anchored by large consumer internet companies, mobile gaming studios, and a growing fintech sector. The city benefits from EU talent mobility but competes with higher-paying northern European hubs.",
  'Madrid':           "Madrid is Spain's financial capital with a stronger concentration of enterprise software and consulting firms. Salaries typically run 5–10% ahead of Barcelona across most tech roles.",
  'London':           "London remains Europe's highest-paying major tech hub, with deep demand from financial services, e-commerce, and enterprise software. Initial offers almost always have negotiation headroom.",
  'Amsterdam':        "Amsterdam punches above its size, with a concentration of international tech company EMEA headquarters and a fully English-speaking professional environment. Dutch employers are generally transparent about pay bands.",
  'Berlin':           "Berlin is Germany's startup capital, attracting international talent through relatively low living costs and strong visa support. Salaries lag Munich by 10–15% but the startup equity ecosystem is strong.",
  'Munich':           "Munich is Germany's highest-paying tech market, driven by automotive tech, enterprise software, and a cluster of large multinationals. Annual bonus structures create room to negotiate beyond base salary.",
  'Paris':            "Paris is France's dominant tech hub, with a growing startup ecosystem backed by significant government investment. Salaries are strong but French employment norms create structured compensation frameworks.",
  'Dublin':           "Dublin hosts European headquarters for most major US tech companies, creating strong demand and some of the highest tech salaries in Europe outside Switzerland.",
  'Lisbon':           "Lisbon has grown rapidly as a cost-effective EU tech hub. Salaries remain below western European averages but cost of living is significantly lower, and the market is increasingly competitive for experienced hires.",
  'Frankfurt':        "Frankfurt is Germany's financial center with strong demand for technology roles from banking and fintech. Salaries are competitive with Munich for finance-adjacent positions.",
  'San Francisco':    "San Francisco and the Bay Area remain the global benchmark for software compensation. Total compensation including equity frequently exceeds base salary — always negotiate the full package.",
  'New York':         "New York is the US's second-largest tech hub, with particular strength in finance, media, and e-commerce. Finance sector competition pushes tech salaries upward across the board.",
  'Austin':           "Austin has grown into a major US tech hub following coastal company relocations. Salaries are competitive, state income tax is zero, and employer density creates real negotiating leverage.",
  'Toronto':          "Toronto is Canada's largest tech market with a strong financial services sector and immigration-friendly policies. Salaries are strong but trail US peers due to exchange rates.",
  'Singapore':        "Singapore is Southeast Asia's dominant tech hub with favorable tax treatment and strong regional HQ presence. Packages are internationally competitive and fully negotiable.",
  'Remote (Spain)':   "Remote roles in Spain typically benchmark against Madrid or Barcelona rates. Many employers issue Spanish employment contracts regardless of employee location within the country.",
  'Remote (UK)':      "UK remote roles vary — many employers pay regional rather than London rates. London pay is achievable for hard-to-fill positions or when you hold a London-based competing offer.",
  'Remote (Germany)': "German remote positions typically use national employment contracts referencing Munich or Berlin benchmarks. Cost-of-living adjustments by employee location are less common than in the US.",
  'Remote (US)':      "US remote salaries vary widely — some companies pay to the local market, others pay San Francisco or New York rates. These figures represent national median remote benchmarks.",
};

// ── Content: role descriptions ────────────────────────────────────────────────
const ROLE_DESC = {
  'Software Engineer':         "Software Engineers design, build, and maintain software systems. Compensation reflects the consistent demand from virtually every tech-hiring company and the breadth of technical depth the role requires.",
  'Product Manager':           "Product Managers own product strategy and roadmap execution, working across engineering, design, and business stakeholders. Strong PM demand at growth-stage companies pushes compensation above the median tech role.",
  'Data Scientist':            "Data Scientists build models and statistical analyses to drive business decisions. Demand is highest in consumer internet, finance, and large enterprise, where data-driven decisions translate directly to revenue.",
  'Engineering Manager':       "Engineering Managers lead teams of engineers, combining technical oversight with people management. The management premium — typically 20–40% above senior IC rates — reflects the genuine scarcity of effective technical leaders.",
  'Frontend Engineer':         "Frontend Engineers build the user-facing layer of web applications, working primarily in JavaScript and TypeScript frameworks. Compensation typically runs slightly below backend due to a higher supply of candidates in most markets.",
  'Backend Engineer':          "Backend Engineers build and maintain server-side systems, APIs, and data pipelines. Consistent demand across virtually all tech companies makes this one of the most reliably hired roles.",
  'Full Stack Engineer':       "Full Stack Engineers work across both frontend and backend, a generalist profile in high demand at startups and smaller companies. Compensation tracks slightly below specialized roles at larger firms.",
  'DevOps Engineer':           "DevOps Engineers own infrastructure, CI/CD pipelines, and deployment automation. As cloud infrastructure becomes mission-critical, DevOps compensation has risen sharply over the past five years.",
  'Machine Learning Engineer': "Machine Learning Engineers build and deploy ML systems at scale, sitting at the intersection of software engineering and data science. Demand from AI-native companies and enterprises drives a consistent compensation premium.",
  'UX Designer':               "UX Designers own the end-to-end user experience design process, from research through interface design. Compensation runs below engineering roles, but senior UX talent at product-led companies commands strong packages.",
};

// ── Content: negotiation leverage ────────────────────────────────────────────
const CITY_LEVERAGE = {
  'Barcelona': [
    "Senior tech talent is in short supply — companies actively compete for experienced hires",
    "Spain's tech market is maturing rapidly, pushing compensation upward year-on-year",
    "Moderate cost of living means employers can't use city premium as a lever against you",
    "Relocation and international candidates consistently command premiums in this market",
  ],
  'Madrid': [
    "Madrid companies compete with Barcelona and international remote roles for the same talent pool",
    "Enterprise and consulting firms pay above average for senior tech — reference both sectors",
    "Multiple competing offers are increasingly common at senior and staff levels",
    "Financial services presence creates strong cross-sector competition for technical talent",
  ],
  'London': [
    "London employers expect negotiation — initial offers routinely leave 10–20% on the table",
    "Financial services firms pay 30–50% premiums for specific technical skills: use that as leverage",
    "A competing offer is the single strongest negotiating lever in the London market",
    "Cost of living is a two-way argument — use it, but be prepared for employers who are experienced with this approach",
  ],
  'Amsterdam': [
    "Dutch employers are generally transparent about pay bands — ask directly before starting any negotiation",
    "The 30% ruling for expat candidates is a real and negotiable component of total compensation",
    "International talent pool means employers routinely benchmark against London and German rates",
    "Strong startup and scaleup ecosystem creates real competing-offer tension for senior hires",
  ],
  'Berlin': [
    "Startup culture makes equity a genuine and negotiable lever beyond base salary",
    "Remote work prevalence means Berlin employers compete with Munich and London for the same candidates",
    "Visa sponsorship costs are real — use this as leverage if you're an international candidate",
    "Reference Munich benchmarks in negotiation — Berlin lags by 10–15% and employers know it",
  ],
  'Munich': [
    "Munich is Germany's highest-paying market — employers here expect and respect negotiation",
    "Automotive and enterprise tech firms have structured pay bands with genuine flex at the edges",
    "Annual bonus structures mean base salary isn't the only lever — negotiate the full package",
    "Relocation packages are negotiable for candidates moving into Munich from other cities",
  ],
  'San Francisco': [
    "Always negotiate total compensation as a single number: base, RSUs, signing bonus, and vesting cliff",
    "A competing offer is the strongest lever in SF tech — companies will routinely match or beat",
    "RSU vesting schedules and cliff periods are negotiable at many mid-size companies",
    "Sign-on bonuses are routinely used to bridge gaps in unvested equity from a prior role",
  ],
  'New York': [
    "Finance sector creates strong cross-industry salary pressure — reference finance benchmarks explicitly",
    "Competing offers from both finance and tech significantly strengthen your position",
    "Annual bonuses in finance-adjacent tech roles are a meaningful and negotiable component",
    "New York cost of living is well understood by employers — use it without apology",
  ],
};

// ── Shared CSS ────────────────────────────────────────────────────────────────
const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #fff; color: #111827; line-height: 1.6; font-size: 16px; }
a { color: #2563eb; text-decoration: none; }
a:hover { text-decoration: underline; }
.wrap { max-width: 740px; margin: 0 auto; padding: 0 20px; }
header { border-bottom: 1px solid #e5e7eb; padding: 16px 0; }
.brand { font-size: 15px; font-weight: 600; }
.brand span { color: #2563eb; }
.breadcrumb { font-size: 13px; color: #6b7280; margin-top: 4px; }
h1 { font-size: clamp(22px, 4vw, 34px); font-weight: 700; line-height: 1.2; margin: 32px 0 16px; letter-spacing: -0.02em; }
.lead { font-size: 17px; color: #374151; line-height: 1.7; margin-bottom: 32px; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 32px 0; }
.stat-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 18px 16px; text-align: center; }
.stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
.stat-val { font-size: 22px; font-weight: 700; color: #111827; }
.stat-sub { font-size: 12px; color: #9ca3af; margin-top: 2px; }
h2 { font-size: 20px; font-weight: 700; margin: 40px 0 14px; letter-spacing: -0.01em; }
h3 { font-size: 16px; font-weight: 600; margin: 24px 0 8px; }
p { margin-bottom: 16px; }
table { width: 100%; border-collapse: collapse; font-size: 15px; margin: 0 0 32px; }
th { background: #f9fafb; text-align: left; padding: 10px 14px; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 1px solid #e5e7eb; }
td { padding: 12px 14px; border-bottom: 1px solid #f3f4f6; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: #f9fafb; }
.td-band { font-weight: 500; }
.cta-box { background: #0a0a0f; color: #f9fafb; border-radius: 14px; padding: 32px; margin: 40px 0; }
.cta-box h2 { color: #f9fafb; margin-top: 0; }
.cta-box p { color: #9ca3af; margin-bottom: 24px; font-size: 15px; }
.cta-btn { display: inline-block; background: #2563eb; color: #fff; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 15px; }
.cta-btn:hover { background: #1d4ed8; text-decoration: none; }
.context-box { background: #f9fafb; border-left: 3px solid #2563eb; padding: 20px 24px; border-radius: 0 8px 8px 0; margin: 0 0 32px; }
.context-box p { font-size: 15px; color: #374151; line-height: 1.7; margin: 0; }
.tag-list { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; margin: 8px 0 32px; }
.tag-list li a { display: inline-block; background: #f3f4f6; color: #374151; padding: 6px 12px; border-radius: 6px; font-size: 14px; }
.tag-list li a:hover { background: #e5e7eb; text-decoration: none; }
ol.steps { padding-left: 0; counter-reset: step; list-style: none; margin: 0 0 32px; }
ol.steps li { counter-increment: step; display: flex; gap: 16px; margin-bottom: 20px; }
ol.steps li::before { content: counter(step); flex-shrink: 0; width: 28px; height: 28px; background: #2563eb; color: #fff; border-radius: 50%; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; margin-top: 3px; }
.step-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.step-body { font-size: 14px; color: #6b7280; line-height: 1.6; margin: 0; }
.leverage-list { list-style: none; padding: 0; margin: 0 0 32px; }
.leverage-list li { display: flex; gap: 10px; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-size: 15px; color: #374151; }
.leverage-list li:last-child { border-bottom: none; }
.check { color: #2563eb; font-weight: 700; flex-shrink: 0; margin-top: 1px; }
footer { border-top: 1px solid #e5e7eb; padding: 32px 0; margin-top: 64px; }
.footer-note { font-size: 13px; color: #9ca3af; margin-bottom: 8px; }
.footer-links { display: flex; gap: 16px; flex-wrap: wrap; }
.footer-links a { font-size: 13px; color: #6b7280; }
@media (max-width: 600px) {
  .stats-grid { grid-template-columns: 1fr 1fr; }
  table { font-size: 13px; }
  th, td { padding: 8px 10px; }
}
`.trim();

// ── Page shell ────────────────────────────────────────────────────────────────
function shell(title, description, canonicalPath, jsonLd, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${SITE_URL}${canonicalPath}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>${CSS}</style>
<script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
</script>
</head>
<body>
<header>
  <div class="wrap">
    <div class="brand"><a href="/" style="color:inherit;text-decoration:none">Comp<span>Verdict</span></a></div>
  </div>
</header>
${bodyHtml}
<footer>
  <div class="wrap">
    <p class="footer-note">Data based on 2025-Q1 aggregated salary surveys. All figures are annual gross (pre-tax) in local currency.</p>
    <div class="footer-links">
      <a href="/">CompVerdict Tool</a>
      <a href="/salary/">Salary Benchmarks</a>
      <a href="/negotiate/">Negotiation Guides</a>
    </div>
  </div>
</footer>
</body>
</html>`;
}

// ── Salary benchmark page ─────────────────────────────────────────────────────
function salaryPage(role, city) {
  const data = getRange(role, city);
  if (!data) return null;

  const { bands, symbol } = data;
  const mid    = bands.mid;
  const senior = bands.senior;
  if (!mid) return null;

  const roleSlug = slug(role);
  const citySlug = slug(city);
  const canonPath = `/salary/${roleSlug}-salary-${citySlug}/`;

  const title       = `${role} Salary in ${city} (2025) — Benchmarks by Experience`;
  const description = `${role} salary in ${city}: p25 ${fmt(mid.p25, symbol)}, median ${fmt(mid.p50, symbol)}, p75 ${fmt(mid.p75, symbol)} for mid-level (3–5 yrs). Full breakdown across all experience bands.`;

  const seniorJump = senior
    ? Math.round(((senior.p50 - mid.p50) / mid.p50) * 100)
    : null;

  const faqs = [
    {
      q: `What is the average ${role} salary in ${city}?`,
      a: `The median ${role} salary in ${city} is ${fmt(mid.p50, symbol)} per year for mid-level experience (3–5 years). Junior salaries start from around ${fmt(bands.junior?.p25 || 0, symbol)}, while senior engineers typically earn ${fmt(bands.senior?.p50 || 0, symbol)} or more.`,
    },
    {
      q: `What is a good ${role} salary in ${city}?`,
      a: `A salary above the 75th percentile is considered strong. For a mid-level ${role} in ${city}, that means earning more than ${fmt(mid.p75, symbol)} per year. Senior-level candidates targeting ${fmt(bands.senior?.p50 || 0, symbol)}+ are in the top half of the market.`,
    },
    {
      q: `How much does ${role} salary increase with experience in ${city}?`,
      a: seniorJump
        ? `Moving from mid-level to senior as a ${role} in ${city} corresponds to a ${seniorJump}% increase at the median. The jump from junior to mid-level is typically ${Math.round(((mid.p50 - (bands.junior?.p50 || mid.p50)) / (bands.junior?.p50 || mid.p50)) * 100)}%.`
        : `Experience level is the strongest driver of ${role} compensation in ${city}. Each band shift typically represents a 30–50% increase at the median.`,
    },
    {
      q: `Is ${city} a good market for ${role} jobs?`,
      a: `${CITY_DESC[city] ? CITY_DESC[city].split('.')[0] + '.' : `${city} has an active tech hiring market.`} For ${role}s, the median compensation of ${fmt(mid.p50, symbol)} is ${mid.p50 > 60000 ? 'competitive relative to cost of living' : 'reflective of the local market level'}.`,
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const relatedRoles  = SALARY_ROLES.filter(r => r !== role).slice(0, 6);
  const relatedCities = SALARY_CITIES.filter(c => c !== city).slice(0, 8);
  const negPath       = NEGOTIATE_CITIES.includes(city)
    ? `/negotiate/${roleSlug}-negotiation-${citySlug}/`
    : null;

  const tableRows = Object.entries(BAND_LABELS).map(([band, label]) => {
    const b = bands[band];
    if (!b) return '';
    return `        <tr>
          <td class="td-band">${label}</td>
          <td>${fmt(b.p25, symbol)}</td>
          <td><strong>${fmt(b.p50, symbol)}</strong></td>
          <td>${fmt(b.p75, symbol)}</td>
        </tr>`;
  }).filter(Boolean).join('\n');

  const bodyHtml = `
<main>
  <div class="wrap">
    <p class="breadcrumb"><a href="/salary/">Salary Benchmarks</a> &rsaquo; ${city} &rsaquo; ${role}</p>
    <h1>${role} Salary in ${city} (2025)</h1>
    <p class="lead">${ROLE_DESC[role] || `Current ${role} compensation data for ${city}.`} The figures below are based on Q1 2025 survey data and cover all experience levels.</p>

    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-label">25th Percentile</div>
        <div class="stat-val">${fmt(mid.p25, symbol)}</div>
        <div class="stat-sub">Mid-level</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Median</div>
        <div class="stat-val">${fmt(mid.p50, symbol)}</div>
        <div class="stat-sub">Mid-level</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">75th Percentile</div>
        <div class="stat-val">${fmt(mid.p75, symbol)}</div>
        <div class="stat-sub">Mid-level</div>
      </div>
    </div>

    <h2>Salary by Experience Band — ${city}</h2>
    <table>
      <thead>
        <tr>
          <th>Experience</th>
          <th>25th Pct</th>
          <th>Median</th>
          <th>75th Pct</th>
        </tr>
      </thead>
      <tbody>
${tableRows}
      </tbody>
    </table>

    <h2>Market Context: ${city}</h2>
    <div class="context-box">
      <p>${CITY_DESC[city] || `${city} has an active tech hiring market for ${role}s.`}</p>
    </div>

    <div class="cta-box">
      <h2>Is your ${role} offer competitive?</h2>
      <p>Paste your offer into CompVerdict and get an instant verdict — fair, strong, or below market — based on your exact role, city, and years of experience.</p>
      <a href="/" class="cta-btn">Check your offer &rarr;</a>
    </div>

    ${negPath ? `
    <h2>Negotiating Your ${role} Offer in ${city}</h2>
    <p>Before you accept, make sure you're negotiating from a position of knowledge. Our guide covers the market-specific leverage points you should use.</p>
    <p><a href="${negPath}">How to negotiate ${role} salary in ${city} &rarr;</a></p>
    ` : ''}

    <h2>Frequently Asked Questions</h2>
    ${faqs.map(f => `
    <h3>${f.q}</h3>
    <p style="color:#374151;font-size:15px">${f.a}</p>`).join('')}

    <h2>${role} Salaries in Other Cities</h2>
    <ul class="tag-list">
      ${relatedCities.map(c => `<li><a href="/salary/${roleSlug}-salary-${slug(c)}/">${role} — ${c}</a></li>`).join('\n      ')}
    </ul>

    <h2>Other Tech Salaries in ${city}</h2>
    <ul class="tag-list">
      ${relatedRoles.map(r => `<li><a href="/salary/${slug(r)}-salary-${citySlug}/">${r} — ${city}</a></li>`).join('\n      ')}
    </ul>
  </div>
</main>`;

  return { html: shell(title, description, canonPath, jsonLd, bodyHtml), path: canonPath };
}

// ── Negotiation guide page ────────────────────────────────────────────────────
function negotiatePage(role, city) {
  const data = getRange(role, city);
  if (!data) return null;

  const { bands, symbol } = data;
  const mid    = bands.mid;
  const senior = bands.senior;
  if (!mid) return null;

  const roleSlug = slug(role);
  const citySlug = slug(city);
  const canonPath = `/negotiate/${roleSlug}-negotiation-${citySlug}/`;

  const title       = `How to Negotiate ${role} Salary in ${city} (2025)`;
  const description = `Step-by-step ${role} salary negotiation guide for ${city}. Market range: ${fmt(mid.p25, symbol)}–${fmt(mid.p75, symbol)} mid-level. Know your number, then negotiate.`;

  const leverage = CITY_LEVERAGE[city] || [
    "Research the full market range before any negotiation conversation",
    "Use market data or competing offers as anchors — not personal financial needs",
    "Negotiate the full package: base, bonus, equity, and benefits as separate levers",
    "Always follow up verbal agreements in writing before making a decision",
  ];

  const steps = [
    {
      title: 'Know your market range',
      body:  `The median ${role} in ${city} earns ${fmt(mid.p50, symbol)} at mid-level and ${fmt(senior?.p50 || 0, symbol)} at senior level. Establish which experience band applies to you before any salary conversation begins.`,
    },
    {
      title: 'Anchor above your real target',
      body:  `Open 10–15% above your actual target. This creates room to concede and still land where you want. Use the 75th percentile of your band — ${fmt(mid.p75, symbol)} for mid-level — as your anchor point.`,
    },
    {
      title: 'Lead with market data, not personal need',
      body:  `Say: "Based on market benchmarks for ${role}s in ${city} with my experience, the range is ${fmt(mid.p25, symbol)}–${fmt(mid.p75, symbol)}. I'm targeting the upper half." Never justify your ask with rent or living costs.`,
    },
    {
      title: 'Negotiate the full compensation package',
      body:  `Base salary is one component. Ask about annual bonus structure, equity grants, signing bonus, remote flexibility, and learning budget. Each is a separate negotiation with its own room to move.`,
    },
    {
      title: 'Get it in writing before you accept',
      body:  `Verbal offers are worthless. Request the written offer letter before giving your decision. Review start date, equity vesting schedule, notice requirements, and any non-compete clauses before signing.`,
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description,
    step: steps.map(s => ({
      '@type': 'HowToStep',
      name: s.title,
      text: s.body,
    })),
  };

  const salaryPath    = `/salary/${roleSlug}-salary-${citySlug}/`;
  const relatedRoles  = SALARY_ROLES.filter(r => r !== role).slice(0, 5);
  const relatedCities = NEGOTIATE_CITIES.filter(c => c !== city);

  const tableRows = Object.entries(BAND_LABELS).map(([band, label]) => {
    const b = bands[band];
    if (!b) return '';
    return `        <tr>
          <td class="td-band">${label}</td>
          <td>${fmt(b.p25, symbol)}</td>
          <td><strong>${fmt(b.p50, symbol)}</strong></td>
          <td>${fmt(b.p75, symbol)}</td>
        </tr>`;
  }).filter(Boolean).join('\n');

  const bodyHtml = `
<main>
  <div class="wrap">
    <p class="breadcrumb"><a href="/negotiate/">Negotiation Guides</a> &rsaquo; ${city} &rsaquo; ${role}</p>
    <h1>How to Negotiate ${role} Salary in ${city}</h1>
    <p class="lead">Most candidates in ${city} leave money on the table — not because employers won't pay more, but because they don't know the market or don't ask. This guide gives you both the data and the script.</p>

    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-label">Market Floor</div>
        <div class="stat-val">${fmt(mid.p25, symbol)}</div>
        <div class="stat-sub">Mid-level p25</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Market Median</div>
        <div class="stat-val">${fmt(mid.p50, symbol)}</div>
        <div class="stat-sub">Mid-level p50</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Strong Offer</div>
        <div class="stat-val">${fmt(mid.p75, symbol)}</div>
        <div class="stat-sub">Mid-level p75</div>
      </div>
    </div>

    <h2>Your Leverage Points in ${city}</h2>
    <ul class="leverage-list">
      ${leverage.map(l => `<li><span class="check">&#10003;</span>${l}</li>`).join('\n      ')}
    </ul>

    <h2>${role} Salary Ranges — ${city}</h2>
    <table>
      <thead>
        <tr>
          <th>Experience</th>
          <th>Floor (p25)</th>
          <th>Median (p50)</th>
          <th>Strong (p75)</th>
        </tr>
      </thead>
      <tbody>
${tableRows}
      </tbody>
    </table>

    <h2>The Negotiation Playbook</h2>
    <ol class="steps">
      ${steps.map(s => `
      <li>
        <div>
          <p class="step-title">${s.title}</p>
          <p class="step-body">${s.body}</p>
        </div>
      </li>`).join('')}
    </ol>

    <h2>Market Context: ${city}</h2>
    <div class="context-box">
      <p>${CITY_DESC[city] || `${city} has an active market for ${role} roles.`}</p>
    </div>

    <div class="cta-box">
      <h2>Check the offer before you negotiate</h2>
      <p>Enter the offer details into CompVerdict to see exactly where it sits in the market — then decide whether to push back.</p>
      <a href="/" class="cta-btn">Verdict my offer &rarr;</a>
    </div>

    <p><a href="${salaryPath}">See full ${role} salary benchmarks for ${city} &rarr;</a></p>

    <h2>More Negotiation Guides — ${city}</h2>
    <ul class="tag-list">
      ${relatedRoles.map(r => `<li><a href="/negotiate/${slug(r)}-negotiation-${citySlug}/">Negotiate ${r} in ${city}</a></li>`).join('\n      ')}
    </ul>

    <h2>Negotiate ${role} in Other Cities</h2>
    <ul class="tag-list">
      ${relatedCities.map(c => `<li><a href="/negotiate/${roleSlug}-negotiation-${slug(c)}/">Negotiate in ${c}</a></li>`).join('\n      ')}
    </ul>
  </div>
</main>`;

  return { html: shell(title, description, canonPath, jsonLd, bodyHtml), path: canonPath };
}

// ── Hub: /salary/ ─────────────────────────────────────────────────────────────
function salaryHubPage() {
  const title       = 'Tech Salary Benchmarks by Role and City (2025)';
  const description = 'Current tech salary benchmarks for Software Engineers, Product Managers, Data Scientists, and more. Covers 19 cities across Europe, North America, and APAC.';
  const canonPath   = '/salary/';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${SITE_URL}${canonPath}`,
  };

  const sections = SALARY_ROLES.map(role => {
    const rSlug = slug(role);
    const links = SALARY_CITIES
      .map(c => `<li><a href="/salary/${rSlug}-salary-${slug(c)}/">${role} salary — ${c}</a></li>`)
      .join('\n        ');
    return `
    <h2>${role}</h2>
    <ul class="tag-list">
      ${links}
    </ul>`;
  }).join('');

  const bodyHtml = `
<main>
  <div class="wrap">
    <h1>Tech Salary Benchmarks (2025)</h1>
    <p class="lead">Current compensation data for tech roles across Europe, North America, and APAC. All figures are annual gross salary in local currency, based on Q1 2025 survey data.</p>
    ${sections}
    <div class="cta-box" style="margin-top:48px">
      <h2>Got an offer? Check it now.</h2>
      <p>CompVerdict gives you an instant verdict on any salary offer based on your role, city, and years of experience.</p>
      <a href="/" class="cta-btn">Check your offer &rarr;</a>
    </div>
  </div>
</main>`;

  return { html: shell(title, description, canonPath, jsonLd, bodyHtml), path: canonPath };
}

// ── Hub: /negotiate/ ──────────────────────────────────────────────────────────
function negotiateHubPage() {
  const title       = 'Tech Salary Negotiation Guides by Role and City (2025)';
  const description = 'Salary negotiation guides for Software Engineers, Product Managers, and more in Barcelona, London, Berlin, San Francisco, and beyond. Know your market, then negotiate.';
  const canonPath   = '/negotiate/';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${SITE_URL}${canonPath}`,
  };

  const sections = NEGOTIATE_CITIES.map(city => {
    const cSlug = slug(city);
    const links = SALARY_ROLES
      .map(r => `<li><a href="/negotiate/${slug(r)}-negotiation-${cSlug}/">Negotiate ${r} in ${city}</a></li>`)
      .join('\n        ');
    return `
    <h2>${city}</h2>
    <ul class="tag-list">
      ${links}
    </ul>`;
  }).join('');

  const bodyHtml = `
<main>
  <div class="wrap">
    <h1>Tech Salary Negotiation Guides (2025)</h1>
    <p class="lead">Market-specific negotiation guides for tech roles. Knowing the market range is the foundation of any successful negotiation — these guides give you the data and the playbook.</p>
    ${sections}
    <div class="cta-box" style="margin-top:48px">
      <h2>Check the offer first, negotiate second.</h2>
      <p>Use CompVerdict to see exactly where your offer sits before you decide whether to push back.</p>
      <a href="/" class="cta-btn">Check your offer &rarr;</a>
    </div>
  </div>
</main>`;

  return { html: shell(title, description, canonPath, jsonLd, bodyHtml), path: canonPath };
}

// ── Write helper ──────────────────────────────────────────────────────────────
function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

// ── Main ──────────────────────────────────────────────────────────────────────
function main() {
  const outDir = __dirname;
  let count = 0;
  const skipped = [];

  console.log('Generating salary benchmark pages...');
  for (const role of SALARY_ROLES) {
    for (const city of SALARY_CITIES) {
      const page = salaryPage(role, city);
      if (!page) { skipped.push(`salary: ${role} / ${city}`); continue; }
      writeFile(path.join(outDir, ...page.path.split('/').filter(Boolean), 'index.html'), page.html);
      count++;
    }
  }

  console.log('Generating negotiation guide pages...');
  for (const role of SALARY_ROLES) {
    for (const city of NEGOTIATE_CITIES) {
      const page = negotiatePage(role, city);
      if (!page) { skipped.push(`negotiate: ${role} / ${city}`); continue; }
      writeFile(path.join(outDir, ...page.path.split('/').filter(Boolean), 'index.html'), page.html);
      count++;
    }
  }

  console.log('Generating hub pages...');
  const salaryHub = salaryHubPage();
  writeFile(path.join(outDir, 'salary', 'index.html'), salaryHub.html);
  count++;

  const negHub = negotiateHubPage();
  writeFile(path.join(outDir, 'negotiate', 'index.html'), negHub.html);
  count++;

  console.log(`\nDone — ${count} pages generated`);
  if (skipped.length) console.log(`Skipped (no data): ${skipped.join(', ')}`);

  console.log('\nSample paths:');
  console.log('  /salary/software-engineer-salary-barcelona/');
  console.log('  /salary/product-manager-salary-london/');
  console.log('  /negotiate/software-engineer-negotiation-san-francisco/');
  console.log('  /salary/');
  console.log('  /negotiate/');
}

main();
