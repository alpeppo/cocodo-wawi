import { type LucideIcon } from 'lucide-react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  change?: { value: string; trend: 'up' | 'down' }
  subtitle?: string
  icon: LucideIcon
  iconColor: string
  iconBg: string
}

export function StatCard({ label, value, change, subtitle, icon: Icon, iconColor, iconBg }: StatCardProps) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span className="stat-label">{label}</span>
        <div className="stat-icon" style={{ background: iconBg }}>
          <Icon size={20} style={{ color: iconColor }} />
        </div>
      </div>
      <div className="stat-value">{value}</div>
      {change && (
        <span className={`stat-change ${change.trend === 'up' ? 'positive' : 'negative'}`}>
          {change.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change.value}
        </span>
      )}
      {subtitle && (
        <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', marginTop: 8 }}>{subtitle}</p>
      )}
    </div>
  )
}
