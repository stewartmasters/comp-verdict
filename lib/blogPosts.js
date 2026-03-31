/**
 * Unified blog post layer.
 * Merges hardcoded JS posts (data/blog-posts.js) with markdown files (content/blog/).
 * TypeScript/JS posts take precedence if the same slug exists in both sources.
 *
 * Future-dated posts (date > today) are silently excluded.
 */

import { BLOG_POSTS } from '@/data/blog-posts'
import { getAllMarkdownPosts, getMarkdownPost } from './markdown'

function isFuture(dateStr) {
  const postDate = new Date(dateStr)
  postDate.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return postDate > today
}

export function getAllBlogPosts() {
  const tsSlugs = new Set(BLOG_POSTS.map((p) => p.slug))
  const mdPosts = getAllMarkdownPosts().filter((p) => !tsSlugs.has(p.slug))

  return [...BLOG_POSTS, ...mdPosts]
    .filter((p) => p.published !== false)
    .filter((p) => !isFuture(p.date))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getBlogPostBySlug(slug) {
  const tsPost = BLOG_POSTS.find((p) => p.slug === slug)
  if (tsPost) return tsPost.published !== false ? tsPost : null

  const mdPost = getMarkdownPost(slug)
  if (!mdPost || mdPost.published === false) return null
  if (isFuture(mdPost.date)) return null
  return mdPost
}

export function getAllBlogSlugs() {
  return getAllBlogPosts().map((p) => ({ slug: p.slug }))
}
