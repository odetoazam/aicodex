/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // The GPT comparison pages were rebuilt for GPT-5.6 in August 2026.
      // Permanent redirects so the old URLs keep their search equity.
      { source: '/compare/claude-vs-gpt4-coding',            destination: '/compare/claude-vs-gpt5-coding',            permanent: true },
      { source: '/compare/claude-vs-gpt4-customer-support',  destination: '/compare/claude-vs-gpt5-customer-support',  permanent: true },
      { source: '/compare/claude-vs-gpt4-writing',           destination: '/compare/claude-vs-gpt5-writing',           permanent: true },
      { source: '/compare/claude-vs-gpt4-document-analysis', destination: '/compare/claude-vs-gpt5-document-analysis', permanent: true },
    ]
  },
}

export default nextConfig
