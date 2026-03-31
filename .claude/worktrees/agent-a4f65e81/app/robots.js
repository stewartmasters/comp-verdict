export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://comp-verdict.netlify.app/sitemap.xml',
  }
}
