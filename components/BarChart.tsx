'use client'

interface BarSegment {
  value: number
  color: string
  label: string
}

interface BarChartProps {
  data: Array<{
    label: string
    segments: BarSegment[]
  }>
  height?: number
  valueFormat?: 'euro-k' | 'number'
}

function formatVal(v: number, fmt?: string): string {
  if (fmt === 'euro-k') return `€${(v / 1000).toFixed(0)}k`
  return v.toLocaleString('de-DE')
}

export function BarChart({ data, height = 200, valueFormat }: BarChartProps) {
  const maxTotal = Math.max(...data.map(d => d.segments.reduce((s, seg) => s + seg.value, 0)), 1)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height }}>
        {data.map((bar) => {
          const total = bar.segments.reduce((s, seg) => s + seg.value, 0)
          const barHeight = (total / maxTotal) * 100

          return (
            <div key={bar.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'var(--color-text-secondary)' }}>
                {formatVal(total, valueFormat)}
              </span>
              <div style={{ width: '100%', borderRadius: 10, overflow: 'hidden', height: `${Math.max(barHeight, 4)}%`, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                {bar.segments.map((seg, i) => {
                  const segHeight = total > 0 ? (seg.value / total) * 100 : 0
                  return (
                    <div
                      key={i}
                      style={{
                        width: '100%',
                        height: `${segHeight}%`,
                        background: seg.color,
                        minHeight: segHeight > 0 ? 2 : 0,
                      }}
                    />
                  )
                })}
              </div>
              <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 12 }}>
                {bar.label}
              </span>
            </div>
          )
        })}
      </div>
      {/* Legend */}
      {data.length > 0 && data[0].segments.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 20 }}>
          {data[0].segments.map((seg, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: seg.color }} />
              <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{seg.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
