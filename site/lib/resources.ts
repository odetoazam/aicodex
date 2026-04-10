/**
 * Official Anthropic resource links per term slug.
 * Shown in the sidebar of term and article pages for claude_specific terms.
 */

export type ExternalResource = {
  label: string
  url: string
  source: 'docs' | 'support' | 'academy' | 'blog'
}

export const OFFICIAL_RESOURCES: Record<string, ExternalResource[]> = {
  'connector': [
    { label: 'Connectors overview', url: 'https://support.anthropic.com/en/collections/connectors', source: 'support' },
    { label: 'Available connectors', url: 'https://claude.ai/connectors', source: 'support' },
  ],
  'skill': [
    { label: 'Skills in Claude', url: 'https://support.anthropic.com/en/articles/claude-skills', source: 'support' },
  ],
  'artifact': [
    { label: 'Using Artifacts', url: 'https://support.anthropic.com/en/articles/claude-artifacts', source: 'support' },
  ],
  'claude-projects': [
    { label: 'Projects overview', url: 'https://support.anthropic.com/en/articles/claude-projects', source: 'support' },
  ],
  'extended-thinking': [
    { label: 'Extended thinking guide', url: 'https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking', source: 'docs' },
  ],
  'adaptive-thinking': [
    { label: 'Adaptive thinking docs', url: 'https://docs.anthropic.com/en/docs/about-claude/models/overview', source: 'docs' },
  ],
  'mcp': [
    { label: 'MCP connector docs', url: 'https://docs.anthropic.com/en/docs/agents-and-tools/mcp-connector', source: 'docs' },
    { label: 'MCP introduction', url: 'https://modelcontextprotocol.io', source: 'docs' },
  ],
  'tool-use': [
    { label: 'Tool use guide', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use', source: 'docs' },
  ],
  'prompt-caching': [
    { label: 'Prompt caching guide', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching', source: 'docs' },
  ],
  'rag': [
    { label: 'Embeddings guide', url: 'https://docs.anthropic.com/en/docs/build-with-claude/embeddings', source: 'docs' },
  ],
  'constitutional-ai': [
    { label: 'Constitutional AI paper', url: 'https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback', source: 'blog' },
  ],
  'evals': [
    { label: 'Evals best practices', url: 'https://docs.anthropic.com/en/docs/test-and-evaluate/eval-intro', source: 'docs' },
  ],
  'system-prompt': [
    { label: 'Prompt engineering guide', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview', source: 'docs' },
  ],
  'context-window': [
    { label: 'Models overview', url: 'https://docs.anthropic.com/en/docs/about-claude/models/overview', source: 'docs' },
  ],
  'claude-code': [
    { label: 'Claude Code docs', url: 'https://docs.anthropic.com/en/docs/claude-code/overview', source: 'docs' },
  ],
  'batch-processing': [
    { label: 'Message Batches API', url: 'https://docs.anthropic.com/en/docs/build-with-claude/batch-processing', source: 'docs' },
  ],
  'streaming': [
    { label: 'Streaming guide', url: 'https://docs.anthropic.com/en/docs/build-with-claude/streaming', source: 'docs' },
  ],
  'ai-safety': [
    { label: 'Anthropic safety research', url: 'https://www.anthropic.com/safety', source: 'blog' },
  ],
  'alignment': [
    { label: 'Anthropic alignment research', url: 'https://www.anthropic.com/research', source: 'blog' },
  ],
  'anthropic': [
    { label: 'Anthropic Academy', url: 'https://www.anthropic.com/learn', source: 'academy' },
    { label: 'Anthropic research', url: 'https://www.anthropic.com/research', source: 'blog' },
  ],
  'claude': [
    { label: 'Claude for work', url: 'https://www.anthropic.com/claude/work', source: 'docs' },
    { label: 'Claude Academy', url: 'https://www.anthropic.com/learn', source: 'academy' },
  ],
  'claude-agent-sdk': [
    { label: 'Agent SDK docs', url: 'https://docs.anthropic.com/en/docs/agents-and-tools/agent-sdk', source: 'docs' },
  ],
  'hallucination': [
    { label: 'Reducing hallucinations', url: 'https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations', source: 'docs' },
  ],
}

const SOURCE_LABELS: Record<ExternalResource['source'], string> = {
  docs:    'Anthropic Docs',
  support: 'Anthropic Support',
  academy: 'Anthropic Academy',
  blog:    'Anthropic',
}

export function getSourceLabel(source: ExternalResource['source']) {
  return SOURCE_LABELS[source]
}
