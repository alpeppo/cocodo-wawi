import { Store, ShoppingBag, Coffee, Warehouse } from 'lucide-react'

const typeConfig: Record<string, { color: string; bg: string; icon: typeof Store }> = {
  'Kiosk': { color: '#007AFF', bg: 'rgba(0,122,255,0.12)', icon: Store },
  'Supermarkt': { color: '#34C759', bg: 'rgba(52,199,89,0.12)', icon: ShoppingBag },
  'Café': { color: '#FF9500', bg: 'rgba(255,149,0,0.12)', icon: Coffee },
  'Großhandel': { color: '#AF52DE', bg: 'rgba(175,82,222,0.12)', icon: Warehouse },
}

export function CustomerBadge({ type }: { type: string }) {
  const config = typeConfig[type] || typeConfig['Kiosk']
  const Icon = config.icon

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 12px', borderRadius: 100,
      fontSize: 12, fontWeight: 500,
      color: config.color, background: config.bg,
    }}>
      <Icon size={13} />
      {type}
    </span>
  )
}
