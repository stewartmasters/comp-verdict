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

// ── Locale modules ────────────────────────────────────────────────────────────
const LOCALES = [
  require('./i18n/en'),
  require('./i18n/es'),
  require('./i18n/de'),
];
const EN = LOCALES[0];

// ── Config ────────────────────────────────────────────────────────────────────
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

// ── Helpers ───────────────────────────────────────────────────────────────────
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

// ── URL helpers ───────────────────────────────────────────────────────────────
function localePrefix(locale) {
  return locale.code === 'en' ? '' : `/${locale.code}`;
}

function getSalaryPath(locale, role, city) {
  const pre = localePrefix(locale);
  return `${pre}/${locale.salarySection}/${slug(role)}-${locale.salarySlugWord}-${slug(city)}/`;
}

function getNegPath(locale, role, city) {
  const pre = localePrefix(locale);
  return `${pre}/${locale.negotiateSection}/${slug(role)}-${locale.negSlugWord}-${slug(city)}/`;
}

function getHubPath(locale, type) {
  const pre = localePrefix(locale);
  const section = type === 'salary' ? locale.salarySection : locale.negotiateSection;
  return `${pre}/${section}/`;
}

function getHomePath(locale) {
  return locale.code === 'en' ? '/' : `/${locale.code}/`;
}

// ── Build hreflang links for a page ──────────────────────────────────────────
function buildSalaryHreflangs(role, city) {
  const links = [];
  for (const loc of LOCALES) {
    if (!loc.SALARY_CITIES.includes(city)) continue;
    links.push({ hreflang: loc.htmlLang, href: SITE_URL + getSalaryPath(loc, role, city) });
  }
  if (EN.SALARY_CITIES.includes(city)) {
    links.push({ hreflang: 'x-default', href: SITE_URL + getSalaryPath(EN, role, city) });
  }
  return links;
}

function buildNegHreflangs(role, city) {
  const links = [];
  for (const loc of LOCALES) {
    if (!loc.NEGOTIATE_CITIES.includes(city)) continue;
    links.push({ hreflang: loc.htmlLang, href: SITE_URL + getNegPath(loc, role, city) });
  }
  if (EN.NEGOTIATE_CITIES.includes(city)) {
    links.push({ hreflang: 'x-default', href: SITE_URL + getNegPath(EN, role, city) });
  }
  return links;
}

function buildHubHreflangs(type) {
  return [
    ...LOCALES.map(loc => ({ hreflang: loc.htmlLang, href: SITE_URL + getHubPath(loc, type) })),
    { hreflang: 'x-default', href: SITE_URL + getHubPath(EN, type) },
  ];
}

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
function shell(locale, title, description, canonicalPath, jsonLd, bodyHtml, hreflangs) {
  const homePath       = getHomePath(locale);
  const salaryHubPath  = getHubPath(locale, 'salary');
  const negHubPath     = getHubPath(locale, 'negotiate');

  const hreflangTags = (hreflangs || [])
    .map(h => `<link rel="alternate" hreflang="${h.hreflang}" href="${h.href}">`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="${locale.htmlLang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${SITE_URL}${canonicalPath}">
${hreflangTags}
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
    <div class="brand"><a href="${homePath}" style="color:inherit;text-decoration:none">Comp<span>Verdict</span></a></div>
  </div>
</header>
${bodyHtml}
<footer>
  <div class="wrap">
    <p class="footer-note">${locale.footerNote}</p>
    <div class="footer-links">
      <a href="${homePath}">${locale.footerLinkTool}</a>
      <a href="${salaryHubPath}">${locale.footerLinkSalary}</a>
      <a href="${negHubPath}">${locale.footerLinkNeg}</a>
    </div>
  </div>
</footer>
</body>
</html>`;
}

// ── Salary benchmark page ─────────────────────────────────────────────────────
function salaryPage(locale, role, city) {
  const data = getRange(role, city);
  if (!data) return null;

  const { bands, symbol } = data;
  const mid    = bands.mid;
  const senior = bands.senior;
  if (!mid) return null;

  const canonPath = getSalaryPath(locale, role, city);

  const title       = locale.salaryTitleTpl(role, city);
  const description = locale.salaryDescTpl(role, city, mid.p25, mid.p50, mid.p75, symbol);

  const seniorJump = senior
    ? Math.round(((senior.p50 - mid.p50) / mid.p50) * 100)
    : null;
  const juniorJump = bands.junior
    ? Math.round(((mid.p50 - bands.junior.p50) / bands.junior.p50) * 100)
    : null;

  const cityDescFull = locale.CITY_DESC[city] || '';
  const cityDescFirst = cityDescFull ? cityDescFull.split('.')[0] + '.' : `${city} has an active tech hiring market.`;

  const faqs = [
    {
      q: locale.faqQ1(role, city),
      a: locale.faqA1(role, city, bands.junior?.p25 || 0, mid.p50, senior?.p50 || 0, symbol),
    },
    {
      q: locale.faqQ2(role, city),
      a: locale.faqA2(role, city, mid.p50, mid.p75, senior?.p50 || 0, symbol),
    },
    {
      q: locale.faqQ3(role, city),
      a: locale.faqA3(role, city, seniorJump, juniorJump),
    },
    {
      q: locale.faqQ4(role, city),
      a: locale.faqA4(role, city, mid.p50, symbol, cityDescFirst),
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

  const hreflangs   = buildSalaryHreflangs(role, city);
  const salaryHubPath = getHubPath(locale, 'salary');
  const relatedRoles  = SALARY_ROLES.filter(r => r !== role).slice(0, 6);
  const relatedCities = locale.SALARY_CITIES.filter(c => c !== city).slice(0, 8);
  const negPath       = locale.NEGOTIATE_CITIES.includes(city)
    ? getNegPath(locale, role, city)
    : null;

  const tableRows = Object.entries(locale.BAND_LABELS).map(([band, label]) => {
    const b = bands[band];
    if (!b) return '';
    return `        <tr>
          <td class="td-band">${label}</td>
          <td>${fmt(b.p25, symbol)}</td>
          <td><strong>${fmt(b.p50, symbol)}</strong></td>
          <td>${fmt(b.p75, symbol)}</td>
        </tr>`;
  }).filter(Boolean).join('\n');

  const [th0, th1, th2, th3] = locale.salaryTableHeaders;

  const bodyHtml = `
<main>
  <div class="wrap">
    <p class="breadcrumb"><a href="${salaryHubPath}">${locale.salaryBreadcrumb1}</a> &rsaquo; ${city} &rsaquo; ${role}</p>
    <h1>${locale.salaryH1Tpl(role, city)}</h1>
    <p class="lead">${locale.ROLE_DESC[role] || `${role} — ${city}.`} ${locale.salaryLeadTpl ? (locale.salaryLeadTpl(role, city) || '') : ''}</p>

    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-label">25th Percentile</div>
        <div class="stat-val">${fmt(mid.p25, symbol)}</div>
        <div class="stat-sub">${locale.negStatFloorSub || 'Mid-level p25'}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">${locale.negStatMedian || 'Median'}</div>
        <div class="stat-val">${fmt(mid.p50, symbol)}</div>
        <div class="stat-sub">${locale.negStatMedianSub || 'Mid-level p50'}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">75th Percentile</div>
        <div class="stat-val">${fmt(mid.p75, symbol)}</div>
        <div class="stat-sub">${locale.negStatStrongSub || 'Mid-level p75'}</div>
      </div>
    </div>

    <h2>${locale.salaryTableTitle(role, city)}</h2>
    <table>
      <thead>
        <tr>
          <th>${th0}</th>
          <th>${th1}</th>
          <th>${th2}</th>
          <th>${th3}</th>
        </tr>
      </thead>
      <tbody>
${tableRows}
      </tbody>
    </table>

    <h2>${locale.salaryContextTitle(city)}</h2>
    <div class="context-box">
      <p>${cityDescFull || `${city} — ${role}.`}</p>
    </div>

    <div class="cta-box">
      <h2>${locale.salaryCTATitle(role)}</h2>
      <p>${locale.salaryCTABody(role)}</p>
      <a href="${getHomePath(locale)}" class="cta-btn">${locale.salaryCTABtn}</a>
    </div>

    ${negPath ? `
    <h2>${locale.salaryNegTitle(role, city)}</h2>
    <p>${locale.salaryNegBody(role, city)}</p>
    <p><a href="${negPath}">${locale.salaryNegLink(role, city)}</a></p>
    ` : ''}

    <h2>${locale.salaryFaqTitle}</h2>
    ${faqs.map(f => `
    <h3>${f.q}</h3>
    <p style="color:#374151;font-size:15px">${f.a}</p>`).join('')}

    <h2>${locale.salaryRelCitiesTitle(role)}</h2>
    <ul class="tag-list">
      ${relatedCities.map(c => `<li><a href="${getSalaryPath(locale, role, c)}">${locale.salaryLinkLabel(role, c)}</a></li>`).join('\n      ')}
    </ul>

    <h2>${locale.salaryRelRolesTitle(city)}</h2>
    <ul class="tag-list">
      ${relatedRoles.map(r => `<li><a href="${getSalaryPath(locale, r, city)}">${locale.salaryLinkLabel(r, city)}</a></li>`).join('\n      ')}
    </ul>
  </div>
</main>`;

  return { html: shell(locale, title, description, canonPath, jsonLd, bodyHtml, hreflangs), path: canonPath };
}

// ── Negotiation guide page ────────────────────────────────────────────────────
function negotiatePage(locale, role, city) {
  const data = getRange(role, city);
  if (!data) return null;

  const { bands, symbol } = data;
  const mid    = bands.mid;
  const senior = bands.senior;
  if (!mid) return null;

  const canonPath = getNegPath(locale, role, city);

  const title       = locale.negTitleTpl(role, city);
  const description = locale.negDescTpl(role, city, mid.p25, mid.p50, mid.p75, symbol);

  const leverage = locale.CITY_LEVERAGE[city] || [
    locale.negFallbackLeverage1 || "Research the full market range before any negotiation conversation",
    locale.negFallbackLeverage2 || "Use market data or competing offers as anchors — not personal financial needs",
    locale.negFallbackLeverage3 || "Negotiate the full package: base, bonus, equity, and benefits as separate levers",
    locale.negFallbackLeverage4 || "Always follow up verbal agreements in writing before making a decision",
  ];

  const steps = locale.negSteps(role, city, mid.p50, mid.p25, mid.p75, senior?.p50 || 0, symbol);

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

  const hreflangs    = buildNegHreflangs(role, city);
  const negHubPath   = getHubPath(locale, 'negotiate');
  const salaryPath   = locale.SALARY_CITIES.includes(city) ? getSalaryPath(locale, role, city) : null;
  const relatedRoles = SALARY_ROLES.filter(r => r !== role).slice(0, 5);
  const relatedCities = locale.NEGOTIATE_CITIES.filter(c => c !== city);

  const tableRows = Object.entries(locale.BAND_LABELS).map(([band, label]) => {
    const b = bands[band];
    if (!b) return '';
    return `        <tr>
          <td class="td-band">${label}</td>
          <td>${fmt(b.p25, symbol)}</td>
          <td><strong>${fmt(b.p50, symbol)}</strong></td>
          <td>${fmt(b.p75, symbol)}</td>
        </tr>`;
  }).filter(Boolean).join('\n');

  const [nth0, nth1, nth2, nth3] = locale.negTableHeaders;
  const cityDescFull = locale.CITY_DESC[city] || '';

  const bodyHtml = `
<main>
  <div class="wrap">
    <p class="breadcrumb"><a href="${negHubPath}">${locale.negBreadcrumb1}</a> &rsaquo; ${city} &rsaquo; ${role}</p>
    <h1>${locale.negH1Tpl(role, city)}</h1>
    <p class="lead">${locale.negLead(city)}</p>

    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-label">${locale.negStatFloor}</div>
        <div class="stat-val">${fmt(mid.p25, symbol)}</div>
        <div class="stat-sub">${locale.negStatFloorSub}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">${locale.negStatMedian}</div>
        <div class="stat-val">${fmt(mid.p50, symbol)}</div>
        <div class="stat-sub">${locale.negStatMedianSub}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">${locale.negStatStrong}</div>
        <div class="stat-val">${fmt(mid.p75, symbol)}</div>
        <div class="stat-sub">${locale.negStatStrongSub}</div>
      </div>
    </div>

    <h2>${locale.negLeverageTitle(city)}</h2>
    <ul class="leverage-list">
      ${leverage.map(l => `<li><span class="check">&#10003;</span>${l}</li>`).join('\n      ')}
    </ul>

    <h2>${locale.negTableTitle(role, city)}</h2>
    <table>
      <thead>
        <tr>
          <th>${nth0}</th>
          <th>${nth1}</th>
          <th>${nth2}</th>
          <th>${nth3}</th>
        </tr>
      </thead>
      <tbody>
${tableRows}
      </tbody>
    </table>

    <h2>${locale.negPlaybookTitle}</h2>
    <ol class="steps">
      ${steps.map(s => `
      <li>
        <div>
          <p class="step-title">${s.title}</p>
          <p class="step-body">${s.body}</p>
        </div>
      </li>`).join('')}
    </ol>

    <h2>${locale.negContextTitle(city)}</h2>
    <div class="context-box">
      <p>${cityDescFull || `${city} — ${role}.`}</p>
    </div>

    <div class="cta-box">
      <h2>${locale.negCTATitle}</h2>
      <p>${locale.negCTABody}</p>
      <a href="${getHomePath(locale)}" class="cta-btn">${locale.negCTABtn}</a>
    </div>

    ${salaryPath ? `<p><a href="${salaryPath}">${locale.negSalaryLink(role, city)}</a></p>` : ''}

    <h2>${locale.negRelRolesTitle(city)}</h2>
    <ul class="tag-list">
      ${relatedRoles.map(r => `<li><a href="${getNegPath(locale, r, city)}">${locale.negRelRoleLink(r, city)}</a></li>`).join('\n      ')}
    </ul>

    <h2>${locale.negRelCitiesTitle(role)}</h2>
    <ul class="tag-list">
      ${relatedCities.map(c => `<li><a href="${getNegPath(locale, role, c)}">${locale.negRelCityLink(role, c)}</a></li>`).join('\n      ')}
    </ul>
  </div>
</main>`;

  return { html: shell(locale, title, description, canonPath, jsonLd, bodyHtml, hreflangs), path: canonPath };
}

// ── Hub: salary hub ───────────────────────────────────────────────────────────
function salaryHubPage(locale) {
  const title       = locale.salaryHubTitle;
  const description = locale.salaryHubDesc;
  const canonPath   = getHubPath(locale, 'salary');
  const hreflangs   = buildHubHreflangs('salary');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${SITE_URL}${canonPath}`,
  };

  const sections = SALARY_ROLES.map(role => {
    const links = locale.SALARY_CITIES
      .map(c => `<li><a href="${getSalaryPath(locale, role, c)}">${locale.salaryLinkLabel(role, c)}</a></li>`)
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
    <h1>${title}</h1>
    <p class="lead">${locale.salaryHubLead}</p>
    ${sections}
    <div class="cta-box" style="margin-top:48px">
      <h2>${locale.salaryCTATitle('Software Engineer')}</h2>
      <p>${locale.salaryCTABody('Software Engineer')}</p>
      <a href="${getHomePath(locale)}" class="cta-btn">${locale.salaryCTABtn}</a>
    </div>
  </div>
</main>`;

  return { html: shell(locale, title, description, canonPath, jsonLd, bodyHtml, hreflangs), path: canonPath };
}

// ── Hub: negotiate hub ────────────────────────────────────────────────────────
function negotiateHubPage(locale) {
  const title       = locale.negHubTitle;
  const description = locale.negHubDesc;
  const canonPath   = getHubPath(locale, 'negotiate');
  const hreflangs   = buildHubHreflangs('negotiate');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${SITE_URL}${canonPath}`,
  };

  const sections = locale.NEGOTIATE_CITIES.map(city => {
    const links = SALARY_ROLES
      .map(r => `<li><a href="${getNegPath(locale, r, city)}">${locale.negLinkLabel(r, city)}</a></li>`)
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
    <h1>${title}</h1>
    <p class="lead">${locale.negHubLead}</p>
    ${sections}
    <div class="cta-box" style="margin-top:48px">
      <h2>${locale.negCTATitle}</h2>
      <p>${locale.negCTABody}</p>
      <a href="${getHomePath(locale)}" class="cta-btn">${locale.negCTABtn}</a>
    </div>
  </div>
</main>`;

  return { html: shell(locale, title, description, canonPath, jsonLd, bodyHtml, hreflangs), path: canonPath };
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

  for (const locale of LOCALES) {
    console.log(`\n[${locale.code.toUpperCase()}] Generating salary pages...`);
    for (const role of SALARY_ROLES) {
      for (const city of locale.SALARY_CITIES) {
        const page = salaryPage(locale, role, city);
        if (!page) { skipped.push(`[${locale.code}] salary: ${role} / ${city}`); continue; }
        writeFile(path.join(outDir, ...page.path.split('/').filter(Boolean), 'index.html'), page.html);
        count++;
      }
    }

    console.log(`[${locale.code.toUpperCase()}] Generating negotiation pages...`);
    for (const role of SALARY_ROLES) {
      for (const city of locale.NEGOTIATE_CITIES) {
        const page = negotiatePage(locale, role, city);
        if (!page) { skipped.push(`[${locale.code}] negotiate: ${role} / ${city}`); continue; }
        writeFile(path.join(outDir, ...page.path.split('/').filter(Boolean), 'index.html'), page.html);
        count++;
      }
    }

    console.log(`[${locale.code.toUpperCase()}] Generating hub pages...`);
    const salaryHub = salaryHubPage(locale);
    writeFile(path.join(outDir, ...salaryHub.path.split('/').filter(Boolean), 'index.html'), salaryHub.html);
    count++;

    const negHub = negotiateHubPage(locale);
    writeFile(path.join(outDir, ...negHub.path.split('/').filter(Boolean), 'index.html'), negHub.html);
    count++;
  }

  console.log(`\nDone — ${count} pages generated across ${LOCALES.length} locales`);
  if (skipped.length) console.log(`Skipped (no data): ${skipped.join(', ')}`);

  console.log('\nSample paths:');
  console.log('  /salary/software-engineer-salary-barcelona/');
  console.log('  /es/salarios/software-engineer-salario-barcelona/');
  console.log('  /de/gehalt/software-engineer-gehalt-berlin/');
  console.log('  /negotiate/software-engineer-negotiation-san-francisco/');
  console.log('  /es/negociacion/software-engineer-negociacion-barcelona/');
  console.log('  /de/verhandlung/software-engineer-verhandlung-berlin/');
}

main();
