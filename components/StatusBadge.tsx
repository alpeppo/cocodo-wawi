const statusConfig: Record<string, { color: string; bg: string }> = {
  'Neu': { color: '#86868b', bg: 'rgba(134,134,139,0.12)' },
  'In Bearbeitung': { color: '#FF9500', bg: 'rgba(255,149,0,0.12)' },
  'Versendet': { color: '#007AFF', bg: 'rgba(0,122,255,0.12)' },
  'Geliefert': { color: '#34C759', bg: 'rgba(52,199,89,0.12)' },
  'Storniert': { color: '#FF3B30', bg: 'rgba(255,59,48,0.12)' },
  'Aktiv': { color: '#34C759', bg: 'rgba(52,199,89,0.12)' },
  'Niedrig': { color: '#FF9500', bg: 'rgba(255,149,0,0.12)' },
  'Kritisch': { color: '#FF3B30', bg: 'rgba(255,59,48,0.12)' },
}

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { color: '#86868b', bg: 'rgba(134,134,139,0.12)' }

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '5px 12px', borderRadius: 100,
      fontSize: 12, fontWeight: 500,
      color: config.color, background: config.bg,
    }}>
      {status}
    </span>
  )
}
