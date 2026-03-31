// English locale — extracted from generate.js
const en = {
  code:     'en',
  htmlLang: 'en',

  // URL path segments
  salarySection:    'salary',
  negotiateSection: 'negotiate',
  salarySlugWord:   'salary',
  negSlugWord:      'negotiation',

  // Hub labels
  salaryHubTitle: 'Tech Salary Benchmarks by Role and City (2025)',
  salaryHubDesc:  'Current tech salary benchmarks for Software Engineers, Product Managers, Data Scientists, and more. Covers 19 cities across Europe, North America, and APAC.',
  salaryHubLead:  'Current compensation data for tech roles across Europe, North America, and APAC. All figures are annual gross salary in local currency, based on Q1 2025 survey data.',
  negHubTitle:    'Tech Salary Negotiation Guides by Role and City (2025)',
  negHubDesc:     'Salary negotiation guides for Software Engineers, Product Managers, and more in Barcelona, London, Berlin, San Francisco, and beyond. Know your market, then negotiate.',
  negHubLead:     'Market-specific negotiation guides for tech roles. Knowing the market range is the foundation of any successful negotiation — these guides give you the data and the playbook.',

  // Salary page template strings
  salaryTitleTpl:       (role, city) => `${role} Salary in ${city} (2025) — Benchmarks by Experience`,
  salaryDescTpl:        (role, city, p25, p50, p75, sym) => `${role} salary in ${city}: p25 ${sym}${Math.round(p25/1000)}k, median ${sym}${Math.round(p50/1000)}k, p75 ${sym}${Math.round(p75/1000)}k for mid-level (3–5 yrs). Full breakdown across all experience bands.`,
  salaryH1Tpl:          (role, city) => `${role} Salary in ${city} (2025)`,
  salaryLeadTpl:        (role, city) => null, // falls through to ROLE_DESC
  salaryBreadcrumb1:    'Salary Benchmarks',
  salaryTableTitle:     (role, city) => `Salary by Experience Band — ${city}`,
  salaryContextTitle:   (city) => `Market Context: ${city}`,
  salaryCTATitle:       (role) => `Is your ${role} offer competitive?`,
  salaryCTABody:        (role) => `Paste your offer into CompVerdict and get an instant verdict — fair, strong, or below market — based on your exact role, city, and years of experience.`,
  salaryCTABtn:         'Check your offer →',
  salaryNegTitle:       (role, city) => `Negotiating Your ${role} Offer in ${city}`,
  salaryNegBody:        (role, city) => `Before you accept, make sure you're negotiating from a position of knowledge. Our guide covers the market-specific leverage points you should use.`,
  salaryNegLink:        (role, city) => `How to negotiate ${role} salary in ${city} →`,
  salaryFaqTitle:       'Frequently Asked Questions',
  salaryRelCitiesTitle: (role) => `${role} Salaries in Other Cities`,
  salaryRelRolesTitle:  (city) => `Other Tech Salaries in ${city}`,
  salaryTableHeaders:   ['Experience', '25th Pct', 'Median', '75th Pct'],
  salaryRangeLabel:     (band, role, city) => `Typical range for ${band} ${role} in ${city}`,
  footerNote:           'Data based on 2025-Q1 aggregated salary surveys. All figures are annual gross (pre-tax) in local currency.',
  footerLinkTool:       'CompVerdict Tool',
  footerLinkSalary:     'Salary Benchmarks',
  footerLinkNeg:        'Negotiation Guides',

  // Negotiate page template strings
  negTitleTpl:        (role, city) => `How to Negotiate ${role} Salary in ${city} (2025)`,
  negDescTpl:         (role, city, p25, p50, p75, sym) => `Step-by-step ${role} salary negotiation guide for ${city}. Market range: ${sym}${Math.round(p25/1000)}k–${sym}${Math.round(p75/1000)}k mid-level. Know your number, then negotiate.`,
  negH1Tpl:           (role, city) => `How to Negotiate ${role} Salary in ${city}`,
  negBreadcrumb1:     'Negotiation Guides',
  negLead:            (city) => `Most candidates in ${city} leave money on the table — not because employers won't pay more, but because they don't know the market or don't ask. This guide gives you both the data and the script.`,
  negLeverageTitle:   (city) => `Your Leverage Points in ${city}`,
  negTableTitle:      (role, city) => `${role} Salary Ranges — ${city}`,
  negTableHeaders:    ['Experience', 'Floor (p25)', 'Median (p50)', 'Strong (p75)'],
  negPlaybookTitle:   'The Negotiation Playbook',
  negContextTitle:    (city) => `Market Context: ${city}`,
  negCTATitle:        'Check the offer before you negotiate',
  negCTABody:         'Enter the offer details into CompVerdict to see exactly where it sits in the market — then decide whether to push back.',
  negCTABtn:          'Verdict my offer →',
  negSalaryLink:      (role, city) => `See full ${role} salary benchmarks for ${city} →`,
  negRelRolesTitle:   (city) => `More Negotiation Guides — ${city}`,
  negRelRoleLink:     (role, city) => `Negotiate ${role} in ${city}`,
  negRelCitiesTitle:  (role) => `Negotiate ${role} in Other Cities`,
  negRelCityLink:     (role, city) => `Negotiate in ${city}`,
  negStatFloor:       'Market Floor',
  negStatMedian:      'Market Median',
  negStatStrong:      'Strong Offer',
  negStatFloorSub:    'Mid-level p25',
  negStatMedianSub:   'Mid-level p50',
  negStatStrongSub:   'Mid-level p75',

  // FAQ templates
  faqQ1: (role, city) => `What is the average ${role} salary in ${city}?`,
  faqA1: (role, city, junP25, midP50, senP50, sym) =>
    `The median ${role} salary in ${city} is ${sym}${Math.round(midP50/1000)}k per year for mid-level experience (3–5 years). Junior salaries start from around ${sym}${Math.round(junP25/1000)}k, while senior engineers typically earn ${sym}${Math.round(senP50/1000)}k or more.`,
  faqQ2: (role, city) => `What is a good ${role} salary in ${city}?`,
  faqA2: (role, city, midP50, midP75, senP50, sym) =>
    `A salary above the 75th percentile is considered strong. For a mid-level ${role} in ${city}, that means earning more than ${sym}${Math.round(midP75/1000)}k per year. Senior-level candidates targeting ${sym}${Math.round(senP50/1000)}k+ are in the top half of the market.`,
  faqQ3: (role, city) => `How much does ${role} salary increase with experience in ${city}?`,
  faqA3: (role, city, jump, juniorJump) =>
    jump
      ? `Moving from mid-level to senior as a ${role} in ${city} corresponds to a ${jump}% increase at the median. The jump from junior to mid-level is typically similar.`
      : `Experience level is the strongest driver of ${role} compensation in ${city}. Each band shift typically represents a 30–50% increase at the median.`,
  faqQ4: (role, city) => `Is ${city} a good market for ${role} jobs?`,
  faqA4: (role, city, midP50, sym, cityDescFirstSentence) =>
    `${cityDescFirstSentence} For ${role}s, the median compensation of ${sym}${Math.round(midP50/1000)}k is ${midP50 > 60000 ? 'competitive relative to cost of living' : 'reflective of the local market level'}.`,

  // Negotiation steps
  negSteps: (role, city, midP50, midP25, midP75, senP50, sym) => [
    {
      title: 'Know your market range',
      body:  `The median ${role} in ${city} earns ${sym}${Math.round(midP50/1000)}k at mid-level and ${sym}${Math.round((senP50||0)/1000)}k at senior level. Establish which experience band applies to you before any salary conversation begins.`,
    },
    {
      title: 'Anchor above your real target',
      body:  `Open 10–15% above your actual target. This creates room to concede and still land where you want. Use the 75th percentile of your band — ${sym}${Math.round(midP75/1000)}k for mid-level — as your anchor point.`,
    },
    {
      title: 'Lead with market data, not personal need',
      body:  `Say: "Based on market benchmarks for ${role}s in ${city} with my experience, the range is ${sym}${Math.round(midP25/1000)}k–${sym}${Math.round(midP75/1000)}k. I'm targeting the upper half." Never justify your ask with rent or living costs.`,
    },
    {
      title: 'Negotiate the full compensation package',
      body:  'Base salary is one component. Ask about annual bonus structure, equity grants, signing bonus, remote flexibility, and learning budget. Each is a separate negotiation with its own room to move.',
    },
    {
      title: 'Get it in writing before you accept',
      body:  'Verbal offers are worthless. Request the written offer letter before giving your decision. Review start date, equity vesting schedule, notice requirements, and any non-compete clauses before signing.',
    },
  ],

  // Hub page salary link label
  salaryLinkLabel: (role, city) => `${role} salary — ${city}`,
  negLinkLabel:    (role, city) => `Negotiate ${role} salary in ${city}`,

  // "See salary benchmarks" box on negotiate page
  negSalaryBoxTitle: (role, city) => `Negotiate ${role} in other roles`,

  // Target cities per locale
  SALARY_CITIES: [
    'Barcelona', 'Madrid', 'London', 'Amsterdam', 'Berlin', 'Munich', 'Paris',
    'Dublin', 'Lisbon', 'Frankfurt', 'San Francisco', 'New York', 'Austin',
    'Toronto', 'Singapore', 'Remote (Spain)', 'Remote (UK)', 'Remote (Germany)', 'Remote (US)',
  ],
  NEGOTIATE_CITIES: [
    'Barcelona', 'Madrid', 'London', 'Amsterdam', 'Berlin', 'Munich',
    'San Francisco', 'New York',
  ],

  // Content
  BAND_LABELS: {
    junior: 'Junior (0–2 yrs)',
    mid:    'Mid-level (3–5 yrs)',
    senior: 'Senior (6–10 yrs)',
    staff:  'Staff / Lead (11+ yrs)',
  },

  CITY_DESC: {
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
  },

  ROLE_DESC: {
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
  },

  CITY_LEVERAGE: {
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
  },
};
export default en;
