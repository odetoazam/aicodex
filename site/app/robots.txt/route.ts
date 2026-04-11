export async function GET() {
  const body = `User-agent: *
Allow: /

Sitemap: https://www.aicodex.to/sitemap.xml
`
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
