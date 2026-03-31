/**
 * CompVerdict article generator
 * Usage:
 *   npx tsx scripts/generateArticle.ts
 *   npx tsx scripts/generateArticle.ts --dry-run
 *   npx tsx scripts/generateArticle.ts --keyword "job offer red flags"
 *
 * Requires env: ANTHROPIC_API_KEY
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const ROOT = path.join(__dirname, "..");

// ── Inline keyword queue helpers ─────────────────────────────────────────────

interface QueuedKeyword {
  id:              string;
  keyword:         string;
  slug:            string;
  cluster:         string;
  wordCountTarget: number;
  priority:        number;
  used:            boolean;
  roleSlug?:       string;
  citySlug?:       string;
  notes?:          string;
}

function loadKeywordQueue(): QueuedKeyword[] {
  delete require.cache[require.resolve(path.join(ROOT, "data", "blog-queue-cv.ts"))];
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require(path.join(ROOT, "data", "blog-queue-cv.ts")) as {
    KEYWORD_QUEUE: QueuedKeyword[];
  };
  return mod.KEYWORD_QUEUE;
}

function getNextKeyword(queue: QueuedKeyword[]): QueuedKeyword | null {
  return queue
    .filter((k) => !k.used)
    .sort((a, b) => b.priority - a.priority)[0] ?? null;
}

function markKeywordUsed(id: string): void {
  const filePath = path.join(ROOT, "data", "blog-queue-cv.ts");
  let src = fs.readFileSync(filePath, "utf-8");
  src = src.replace(
    new RegExp(`(id:\\s*"${id}"[\\s\\S]*?used:\\s*)false`, "m"),
    "$1true"
  );
  fs.writeFileSync(filePath, src, "utf-8");
}

function getUsedSlugs(): string[] {
  const queue = loadKeywordQueue();
  return queue.filter((k) => k.used).map((k) => k.slug);
}

// ── Internal links ───────────────────────────────────────────────────────────

interface InternalLink {
  url:   string;
  label: string;
}

const CLUSTER_LINKS: Record<string, InternalLink[]> = {
  "offer-evaluation": [
    { url: "/",                                           label: "CompVerdict — instant job offer checker" },
    { url: "/methodology/",                              label: "How CompVerdict benchmarks offers" },
    { url: "/negotiate/",                                label: "How to negotiate your offer" },
    { url: "/blog/how-to-evaluate-a-job-offer/",         label: "How to evaluate a job offer" },
    { url: "/blog/job-offer-red-flags/",                 label: "Job offer red flags to watch for" },
    { url: "/salary/software-engineer-salary-london/",   label: "Software engineer salary benchmarks London" },
  ],
  "salary-benchmarks": [
    { url: "/",                                           label: "CompVerdict — check if your offer is fair" },
    { url: "/salary/",                                   label: "Salary benchmarks by role and city" },
    { url: "/methodology/",                              label: "How CompVerdict salary benchmarks work" },
    { url: "/blog/how-to-evaluate-a-job-offer/",         label: "How to evaluate a job offer" },
    { url: "/blog/software-engineer-salary-europe-2026/", label: "Software engineer salaries across Europe" },
    { url: "/negotiate/",                                label: "Negotiate your offer" },
  ],
  "negotiation": [
    { url: "/",                                                   label: "CompVerdict — benchmark your offer before negotiating" },
    { url: "/negotiate/",                                         label: "CompVerdict negotiation guide" },
    { url: "/blog/how-to-negotiate-salary-after-job-offer/",      label: "How to negotiate salary after an offer" },
    { url: "/blog/how-to-evaluate-a-job-offer/",                  label: "How to evaluate a job offer" },
    { url: "/blog/salary-counter-offer-email-template/",          label: "Salary counter offer email templates" },
    { url: "/methodology/",                                       label: "How CompVerdict calculates market rates" },
  ],
  "total-comp": [
    { url: "/",                                               label: "CompVerdict — total compensation checker" },
    { url: "/blog/how-to-evaluate-a-job-offer/",             label: "Full guide to evaluating a job offer" },
    { url: "/blog/how-to-evaluate-stock-options-job-offer/", label: "How to evaluate stock options" },
    { url: "/blog/rsu-vs-stock-options-which-is-better/",    label: "RSU vs stock options" },
    { url: "/blog/what-is-total-compensation/",              label: "What is total compensation?" },
    { url: "/negotiate/",                                    label: "Negotiating total comp" },
  ],
  "relocation": [
    { url: "/",                                                       label: "CompVerdict — compare offers across cities" },
    { url: "/salary/",                                               label: "Salary benchmarks by city" },
    { url: "/blog/software-engineer-salary-europe-2026/",            label: "Software engineer salaries in Europe 2026" },
    { url: "/blog/london-vs-berlin-salary-comparison-tech/",         label: "London vs Berlin salary comparison" },
    { url: "/blog/cost-of-living-adjusted-salary-europe/",           label: "Cost of living adjusted salaries in Europe" },
    { url: "/methodology/",                                          label: "How CompVerdict benchmarks across countries" },
  ],
  "career-moves": [
    { url: "/",                                                         label: "CompVerdict — evaluate your next offer" },
    { url: "/blog/how-to-evaluate-a-job-offer/",                       label: "How to evaluate any job offer" },
    { url: "/blog/how-much-salary-increase-to-change-jobs/",           label: "How much salary increase to change jobs" },
    { url: "/blog/average-salary-increase-when-switching-jobs/",       label: "Average salary increase when switching jobs" },
    { url: "/negotiate/",                                              label: "How to negotiate your next offer" },
    { url: "/salary/",                                                 label: "Market salary benchmarks" },
  ],
};

const DEFAULT_LINKS: InternalLink[] = [
  { url: "/",              label: "CompVerdict — instant job offer checker" },
  { url: "/salary/",       label: "Salary benchmarks by role and city" },
  { url: "/negotiate/",    label: "How to negotiate a job offer" },
  { url: "/methodology/",  label: "How CompVerdict calculates benchmarks" },
  { url: "/blog/how-to-evaluate-a-job-offer/", label: "How to evaluate a job offer" },
];

function getInternalLinks(cluster?: string, roleSlug?: string, citySlug?: string): InternalLink[] {
  const base = CLUSTER_LINKS[cluster ?? ""] ?? DEFAULT_LINKS;
  const extras: InternalLink[] = [];
  if (roleSlug && citySlug) {
    extras.push({
      url:   `/salary/${roleSlug}-salary-${citySlug}/`,
      label: `${roleSlug.replace(/-/g, " ")} salary guide for ${citySlug.replace(/-/g, " ")}`,
    });
  }
  return [...extras, ...base].slice(0, 6);
}

function formatLinksForPrompt(links: InternalLink[]): string {
  return links.map((l) => `- [${l.label}](https://www.compverdict.com${l.url})`).join("\n");
}

// ── Salary context ───────────────────────────────────────────────────────────
// Approximate official data ranges for prompt enrichment

const SALARY_CONTEXT: Record<string, Record<string, string>> = {
  london: {
    "software-engineer":        "p25: £52k, median: £72k, p75: £95k, p90: £125k+ (ONS ASHE 2025)",
    "product-manager":          "p25: £58k, median: £80k, p75: £105k, p90: £135k+ (ONS ASHE 2025)",
    "data-scientist":           "p25: £48k, median: £65k, p75: £88k (ONS ASHE 2025)",
    "engineering-manager":      "p25: £85k, median: £110k, p75: £145k (ONS ASHE 2025)",
    "frontend-developer":       "p25: £45k, median: £62k, p75: £82k (ONS ASHE 2025)",
    "devops-engineer":          "p25: £55k, median: £74k, p75: £98k (ONS ASHE 2025)",
    "machine-learning-engineer": "p25: £58k, median: £80k, p75: £108k (ONS ASHE 2025)",
    "finance-analyst":          "p25: £38k, median: £52k, p75: £72k (ONS ASHE 2025)",
    "ux-designer":              "p25: £38k, median: £52k, p75: £68k (ONS ASHE 2025)",
    "data-engineer":            "p25: £52k, median: £68k, p75: £90k (ONS ASHE 2025)",
    "product-designer":         "p25: £40k, median: £54k, p75: £70k (ONS ASHE 2025)",
  },
  berlin: {
    "software-engineer":   "p25: €52k, median: €72k, p75: €95k gross (Destatis 2024)",
    "product-manager":     "p25: €56k, median: €76k, p75: €98k gross (Destatis 2024)",
    "data-scientist":      "p25: €50k, median: €68k, p75: €88k gross (Destatis 2024)",
    "backend-developer":   "p25: €50k, median: €68k, p75: €90k gross (Destatis 2024)",
    "product-manager":     "p25: €55k, median: €74k, p75: €95k gross (Destatis 2024)",
  },
  amsterdam: {
    "software-engineer": "p25: €55k, median: €78k, p75: €100k (CBS 2024)",
    "data-scientist":    "p25: €52k, median: €72k, p75: €92k (CBS 2024)",
    "ux-designer":       "p25: €42k, median: €57k, p75: €72k (CBS 2024)",
  },
  barcelona: {
    "software-engineer": "p25: €28k, median: €40k, p75: €55k (INE EES 2024)",
  },
  paris: {
    "software-engineer": "p25: €42k, median: €58k, p75: €76k (INSEE 2024)",
  },
  "san-francisco": {
    "software-engineer": "p25: $135k, median: $172k, p75: $220k base (BLS OEWS 2025)",
  },
};

function getSalaryContext(roleSlug?: string, citySlug?: string): string {
  if (!roleSlug || !citySlug) return "";
  const cityData = SALARY_CONTEXT[citySlug];
  if (!cityData) return "";
  const data = cityData[roleSlug];
  if (!data) return "";
  return `\nSalary benchmark data for ${roleSlug.replace(/-/g, " ")} in ${citySlug.replace(/-/g, " ")}: ${data}\n`;
}

// ── Content directory ────────────────────────────────────────────────────────

const CONTENT_DIR = path.join(ROOT, "content", "blog");

function ensureContentDir(): void {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
}

function slugExists(slug: string): boolean {
  return fs.existsSync(path.join(CONTENT_DIR, `${slug}.md`));
}

// ── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(kw: QueuedKeyword): string {
  const links = getInternalLinks(kw.cluster, kw.roleSlug, kw.citySlug);
  const linksSection = formatLinksForPrompt(links);
  const salaryCtx = getSalaryContext(kw.roleSlug, kw.citySlug);
  const today = new Date().toISOString().split("T")[0];

  return `You are writing a blog post for CompVerdict.com — a free job offer checker tool.

## About CompVerdict
- CompVerdict lets users enter a job offer (base salary, bonus, equity, location, role, experience)
- It benchmarks the offer against official government salary data and returns an instant verdict
- Verdicts: "Strong offer", "Fair offer", "Slightly below market", "Below market", "Significantly below market"
- Data sources: ONS Annual Survey of Hours and Earnings ASHE (UK), BLS Occupational Employment and Wage Statistics (US), Destatis earnings structure survey (Germany), INE Encuesta de Estructura Salarial (Spain), INSEE earnings statistics (France), CBS labour accounts (Netherlands), ABS Australian Bureau of Statistics, Eurostat SES, Statistics Canada LFS, OECD international income data
- Covers 12+ countries and 30+ cities
- Free, no sign-up required, results in under 30 seconds

## Article brief
- **Primary keyword**: ${kw.keyword}
- **Target slug**: ${kw.slug}
- **Word count target**: ${kw.wordCountTarget} words (body content, excluding frontmatter)
- **Cluster**: ${kw.cluster}
${kw.roleSlug ? `- **Role focus**: ${kw.roleSlug.replace(/-/g, " ")}` : ""}
${kw.citySlug ? `- **City focus**: ${kw.citySlug.replace(/-/g, " ")}` : ""}
${kw.notes ? `- **Notes**: ${kw.notes}` : ""}
${salaryCtx}
## Tone and style
- Direct, data-driven, practical — not preachy or motivational
- Use specific numbers from official sources (e.g. "ONS data shows median software engineers in London earn £72,000")
- Percentile framing where relevant: p25/median/p75/p90
- No filler phrases like "it's important to remember" or "as you can see"
- State facts; avoid hedging unless genuinely uncertain
- Optimised for people who have received a job offer and want to understand if it's fair

## Required structure
1. **YAML frontmatter** at the top (see format below)
2. **H1**: Must contain the primary keyword verbatim or near-verbatim
3. **Introductory paragraph**: Lead with a specific data point or counterintuitive fact — hook the reader immediately
4. **3–5 H2 sections**: Each covering a distinct, useful angle on the topic
5. **FAQ section** (H2: "Frequently asked questions"): 3–4 Q&A pairs using H3 for questions
6. **Closing paragraph**: Natural call to action pointing to compverdict.com

## Internal links
Include at least 3 of the following as natural in-text markdown links:
${linksSection}

## YAML frontmatter format
\`\`\`yaml
---
slug: "${kw.slug}"
title: "Your H1 title here"
description: "155-character meta description. Include the primary keyword. End with a benefit."
date: "${today}"
keyword: "${kw.keyword}"
cluster: "${kw.cluster}"
published: true
---
\`\`\`

## Critical requirements
- Output ONLY raw markdown starting with the frontmatter block — no preamble, no explanation
- The primary keyword must appear in the H1, at least one H2, and naturally in the body
- All internal links must use compverdict.com — never salaryverdict.com, pathverdict.com, or spendverdict.com
- Close with a CTA paragraph mentioning checking your offer at compverdict.com
- Do not fabricate specific statistics — use ranges and data from the official sources listed above
- Where quoting salary figures, cite the source (e.g. "according to ONS ASHE 2025")`;
}

// ── Validation ───────────────────────────────────────────────────────────────

interface ValidationResult {
  ok:       boolean;
  errors:   string[];
  warnings: string[];
}

function validateArticle(content: string, kw: QueuedKeyword): ValidationResult {
  const errors: string[]   = [];
  const warnings: string[] = [];

  if (!content.startsWith("---")) {
    errors.push("Missing YAML frontmatter (article must start with ---)");
  }

  if (!content.includes(`slug: "${kw.slug}"`)) {
    errors.push(`Frontmatter slug does not match expected "${kw.slug}"`);
  }

  if (!content.includes("published: true")) {
    warnings.push("published: true not found in frontmatter");
  }

  const frontmatterEnd = content.indexOf("---", 3);
  const body = frontmatterEnd > 0 ? content.slice(frontmatterEnd + 3) : content;
  const wordCount = body.trim().split(/\s+/).length;
  const minWords = Math.floor(kw.wordCountTarget * 0.7);
  if (wordCount < minWords) {
    errors.push(`Word count too low: ${wordCount} words (minimum ${minWords} = 70% of ${kw.wordCountTarget} target)`);
  }

  const h2Matches = body.match(/^## .+/gm) ?? [];
  if (h2Matches.length < 3) {
    errors.push(`Insufficient H2 sections: found ${h2Matches.length} (minimum 3 required)`);
  }

  if (!body.includes("compverdict.com")) {
    errors.push("No compverdict.com links found in article body");
  }

  // Ensure no cross-contamination from other Verdict sites
  for (const domain of ["salaryverdict.com", "pathverdict.com", "spendverdict.com"]) {
    if (body.includes(domain)) {
      errors.push(`Article contains ${domain} links — must use compverdict.com only`);
    }
  }

  const keywordLower = kw.keyword.toLowerCase();
  if (!body.toLowerCase().includes(keywordLower)) {
    warnings.push(`Primary keyword "${kw.keyword}" not found in body`);
  }

  if (!body.toLowerCase().includes("frequently asked")) {
    warnings.push("No FAQ section found (expected '## Frequently asked questions')");
  }

  return { ok: errors.length === 0, errors, warnings };
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const keywordOverrideIdx = args.indexOf("--keyword");
  const keywordOverride = keywordOverrideIdx >= 0 ? args[keywordOverrideIdx + 1] : null;

  console.log("[generateArticle] CompVerdict article generator");
  console.log(`[generateArticle] Mode: ${dryRun ? "DRY RUN" : "LIVE"}`);

  const queue = loadKeywordQueue();
  let kw: QueuedKeyword | null = null;

  if (keywordOverride) {
    kw = queue.find(
      (k) => k.keyword.toLowerCase() === keywordOverride.toLowerCase() || k.id === keywordOverride
    ) ?? null;
    if (!kw) {
      console.error(`[generateArticle] Keyword override not found in queue: "${keywordOverride}"`);
      process.exit(1);
    }
    console.log(`[generateArticle] Using override keyword: "${kw.keyword}" (id: ${kw.id})`);
  } else {
    kw = getNextKeyword(queue);
    if (!kw) {
      console.log("[generateArticle] No unused keywords in queue. Nothing to generate.");
      process.exit(0);
    }
    console.log(`[generateArticle] Next keyword: "${kw.keyword}" (id: ${kw.id}, priority: ${kw.priority})`);
  }

  ensureContentDir();
  const usedSlugs = getUsedSlugs();

  if (slugExists(kw.slug)) {
    console.log(`[generateArticle] Slug already exists: ${kw.slug}.md — skipping.`);
    process.exit(0);
  }
  if (usedSlugs.includes(kw.slug)) {
    console.log(`[generateArticle] Slug already marked used in queue: ${kw.slug} — skipping.`);
    process.exit(0);
  }

  const prompt = buildPrompt(kw);
  console.log(`[generateArticle] Prompt built (${prompt.split(/\s+/).length} words)`);

  if (dryRun) {
    console.log("\n[generateArticle] DRY RUN — prompt preview:\n");
    console.log(prompt.slice(0, 800) + (prompt.length > 800 ? "\n... (truncated)" : ""));
    console.log("\n[generateArticle] Dry run complete. No files written.");
    process.exit(0);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[generateArticle] ANTHROPIC_API_KEY not set.");
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });
  console.log("[generateArticle] Calling Claude claude-sonnet-4-6...");
  const startTime = Date.now();

  let articleContent: string;
  try {
    const message = await client.messages.create({
      model:      "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });
    const block = message.content[0];
    if (block.type !== "text") throw new Error(`Unexpected response block type: ${block.type}`);
    articleContent = block.text.trim();
  } catch (err) {
    console.error("[generateArticle] Claude API call failed:", err);
    process.exit(1);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`[generateArticle] Claude responded in ${elapsed}s`);

  const validation = validateArticle(articleContent, kw);
  for (const w of validation.warnings) console.warn(`[generateArticle] WARNING: ${w}`);
  if (!validation.ok) {
    for (const e of validation.errors) console.error(`[generateArticle] ERROR: ${e}`);
    console.error("[generateArticle] Validation failed — article not saved.");
    process.exit(1);
  }

  const outputPath = path.join(CONTENT_DIR, `${kw.slug}.md`);
  fs.writeFileSync(outputPath, articleContent, "utf-8");
  console.log(`[generateArticle] Article saved: ${outputPath}`);

  markKeywordUsed(kw.id);
  console.log(`[generateArticle] Keyword marked as used: ${kw.id}`);

  const bodyWords = articleContent.trim().split(/\s+/).length;
  console.log(`[generateArticle] Done. Article: ${bodyWords} words, slug: ${kw.slug}`);
}

main().catch((err) => {
  console.error("[generateArticle] Unhandled error:", err);
  process.exit(1);
});
