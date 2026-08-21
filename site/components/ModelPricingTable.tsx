import { MODELS, PRICING_CAVEATS, VERIFIED, fmt } from '@/lib/models'

const VENDOR_COLOR: Record<string, string> = {
  Anthropic: '#D4845A',
  OpenAI: '#5B8DD9',
  Google: '#4CAF7D',
}

/**
 * Current per-token pricing across vendors, plus the three caveats that make a
 * sticker-price comparison misleading. Rendered on every comparison page.
 *
 * `vendors` filters the rows — pass ['Anthropic','OpenAI'] on a GPT page.
 */
export default function ModelPricingTable({
  vendors = ['Anthropic', 'OpenAI'],
  showCaveats = true,
}: {
  vendors?: string[]
  showCaveats?: boolean
}) {
  const rows = MODELS.filter(m => vendors.includes(m.vendor))

  return (
    <section style={{ marginTop: '64px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <h2 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', fontWeight: 600,
          color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em',
        }}>
          What each one costs
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
          Last verified {VERIFIED}
        </p>
      </div>

      <p style={{
        fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-secondary)',
        lineHeight: 1.7, maxWidth: '68ch', margin: '0 0 24px',
      }}>
        USD per million tokens, standard rates, no discounts applied. Read the three
        caveats underneath before you put these numbers in a spreadsheet.
      </p>

      <div style={{ overflowX: 'auto', border: '1px solid var(--border-base)', borderRadius: '10px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '620px' }}>
          <thead>
            <tr style={{ background: 'var(--bg-subtle)' }}>
              {['Model', 'Tier', 'Input', 'Output', 'Notes'].map((h, i) => (
                <th key={h} style={{
                  textAlign: i > 1 && i < 4 ? 'right' : 'left',
                  padding: '12px 16px',
                  fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  borderBottom: '1px solid var(--border-base)',
                  whiteSpace: 'nowrap',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((m, i) => (
              <tr key={m.name} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border-base)' }}>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                  <span style={{
                    display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%',
                    background: VENDOR_COLOR[m.vendor], marginRight: '8px', verticalAlign: 'middle',
                  }} />
                  {m.name}
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{m.tier}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'right', whiteSpace: 'nowrap' }}>{fmt(m.input)}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'right', whiteSpace: 'nowrap' }}>{fmt(m.output)}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.55, minWidth: '260px' }}>{m.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCaveats && (
        <div style={{ marginTop: '20px', display: 'grid', gap: '12px' }}>
          {PRICING_CAVEATS.map(c => (
            <div key={c.title} style={{
              padding: '18px 20px', borderRadius: '8px',
              border: '1px solid var(--border-base)', background: 'var(--bg-subtle)',
            }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                {c.title}
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0, maxWidth: '76ch' }}>
                {c.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
