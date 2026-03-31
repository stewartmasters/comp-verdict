/**
 * Markdown post parser.
 * Reads .md files from content/blog/ with YAML frontmatter.
 * Used server-side only (file system access).
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

function calcReadTime(text) {
  const words = text.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min read`
}

export function getAllMarkdownPosts() {
  if (!fs.existsSync(BLOG_DIR)) return []

  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8')
      const { data, content } = matter(raw)
      const html = marked(content)

      return {
        slug: data.slug ?? filename.replace('.md', ''),
        title: data.title ?? 'Untitled',
        description: data.description ?? '',
        date: data.date ?? '2026-01-01',
        readTime: data.readTime ?? calcReadTime(content),
        content: html,
        published: data.published !== false,
      }
    })
    .filter((p) => p.published)
}

export function getMarkdownPost(slug) {
  const filePath = path.join(BLOG_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const html = marked(content)

  return {
    slug: data.slug ?? slug,
    title: data.title ?? 'Untitled',
    description: data.description ?? '',
    date: data.date ?? '2026-01-01',
    readTime: data.readTime ?? calcReadTime(content),
    content: html,
    published: data.published !== false,
  }
}
