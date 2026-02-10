import { formatNumber } from '@/lib/utils'

interface StockIndicatorProps {
  current: number
  capacity: number
  label?: string
  height?: number
}

export function StockIndicator({ current, capacity, label, height = 12 }: StockIndicatorProps) {
  const percentage = Math.min((current / capacity) * 100, 100)
  const color = percentage > 50 ? '#34C759' : percentage > 20 ? '#FF9500' : '#FF3B30'

  return (
    <div>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)' }}>{label}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
            {formatNumber(current)} / {formatNumber(capacity)} Dosen
          </span>
        </div>
      )}
      <div className="stock-bar" style={{ height }}>
        <div className="stock-fill" style={{ width: `${percentage}%`, background: color }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color }}>{percentage.toFixed(0)}%</span>
      </div>
    </div>
  )
}
