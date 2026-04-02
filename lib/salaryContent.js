/**
 * Content reader for SEO salary guide pages in /content/salary/*.md
 * Server-side only — uses Node fs. Do not import in client components.
 *
 * These are AI-generated informational pages published by the Verdict SEO Platform,
 * rendered under /salary/[slug] alongside the existing data-driven salary pages.
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'salary')

function estimateReadTime(text) {
  const words = text.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min read`
}

function getFiles() {
  if (!fs.existsSync(CONTENT_DIR)) return []
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md') && f !== '.gitkeep')
}

export function getAllSalaryContentSlugs() {
  const files = getFiles()
  const slugs = []
  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8')
    const { data } = matter(raw)
    const slug = data.slug ?? file.replace(/\.md$/, '')
    if (slug && data.published !== false) slugs.push({ slug })
  }
  return slugs
}

export function getSalaryContent(slug) {
  if (!fs.existsSync(CONTENT_DIR)) return null
  const filePath = path.join(CONTENT_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  if (data.published === false) return null

  const html = marked(content)

  return {
    slug: data.slug ?? slug,
    title: data.title ?? slug.replace(/-/g, ' '),
    description: data.description ?? '',
    date: data.date ?? new Date().toISOString().slice(0, 10),
    readTime: data.readTime ?? estimateReadTime(content),
    content: html,
  }
}
