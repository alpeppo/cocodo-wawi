import { AlertTriangle, Clock } from 'lucide-react'
import { getDaysUntil, getMHDStatus, formatNumber } from '@/lib/utils'

interface MHDWarningProps {
  mhd: string
  quantity: number
  batchNumber: string
}

export function MHDWarning({ mhd, quantity, batchNumber }: MHDWarningProps) {
  const days = getDaysUntil(mhd)
  const status = getMHDStatus(mhd)

  if (status === 'ok') return null

  const color = status === 'urgent' ? '#FF3B30' : '#FF9500'
  const bg = status === 'urgent' ? 'rgba(255,59,48,0.08)' : 'rgba(255,149,0,0.08)'
  const Icon = status === 'urgent' ? AlertTriangle : Clock

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 16px', borderRadius: 14,
      background: bg, border: `1px solid ${color}20`,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: `${color}15`, display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}>
          Charge {batchNumber}
        </p>
        <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', marginTop: 2 }}>
          {formatNumber(quantity)} Dosen &middot; MHD in {days} Tagen
        </p>
      </div>
      <span style={{
        fontSize: 12, fontWeight: 600, padding: '4px 10px',
        borderRadius: 100, color, background: `${color}15`,
      }}>
        {status === 'urgent' ? 'Kritisch' : 'Warnung'}
      </span>
    </div>
  )
}
