'use client'

import { BarChart3, TrendingUp, Users, Download } from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import { BarChart } from '@/components/BarChart'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { useWawi } from '@/lib/wawi-context'

export default function BerichtePage() {
  const { revenueData, customers, orders } = useWawi()

  const totalRevenue = revenueData.reduce((s, r) => s + r.total, 0)
  const totalB2B = revenueData.reduce((s, r) => s + r.b2b, 0)
  const b2bShare = ((totalB2B / totalRevenue) * 100).toFixed(0)
  const avgOrderValue = orders.filter(o => o.status !== 'Storniert').reduce((s, o) => s + o.total, 0) / orders.filter(o => o.status !== 'Storniert').length

  const topCustomers = [...customers].sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 10)
  const maxRevenue = topCustomers[0]?.totalRevenue || 1

  const exportCSV = () => {
    // Header
    const lines = ['Monat;B2B;B2C;Gesamt;Wachstum']

    revenueData.forEach((r, i) => {
      const prev = i > 0 ? revenueData[i - 1].total : null
      const growth = prev ? ((r.total - prev) / prev * 100).toFixed(1) + '%' : '—'
      lines.push(`${r.label} ${r.month.split('-')[0]};${r.b2b.toFixed(2)};${r.b2c.toFixed(2)};${r.total.toFixed(2)};${growth}`)
    })

    // Totals
    const totalB2C = revenueData.reduce((s, r) => s + r.b2c, 0)
    lines.push(`Gesamt;${totalB2B.toFixed(2)};${totalB2C.toFixed(2)};${totalRevenue.toFixed(2)};—`)

    // Orders summary
    lines.push('')
    lines.push('Bestellübersicht')
    lines.push('Bestellnummer;Kunde;Typ;Menge;Gesamt;Status;Datum')
    orders.forEach(o => {
      lines.push(`${o.orderNumber};${o.customerName};${o.type};${o.quantity};${o.total.toFixed(2)};${o.status};${o.createdAt}`)
    })

    const blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cocodo-bericht-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="app-header">
        <div className="header-left">
          <h1 className="header-title">Berichte</h1>
          <p className="header-subtitle">Analysen & Geschäftskennzahlen</p>
        </div>
        <button className="btn btn-primary" onClick={exportCSV}>
          <Download size={16} />
          CSV Export
        </button>
      </div>

      <div className="page-content">
        <div className="stats-grid">
          <StatCard
            label="Umsatz Gesamt"
            value={formatCurrency(totalRevenue)}
            subtitle="Letzte 6 Monate"
            icon={TrendingUp}
            iconColor="#2D7D46"
            iconBg="rgba(45,125,70,0.1)"
          />
          <StatCard
            label="B2B Anteil"
            value={b2bShare + '%'}
            subtitle={formatCurrency(totalB2B) + ' B2B-Umsatz'}
            icon={Users}
            iconColor="#007AFF"
            iconBg="rgba(0,122,255,0.1)"
          />
          <StatCard
            label="Ø Auftragswert"
            value={formatCurrency(avgOrderValue)}
            change={{ value: '+12% vs. Vorperiode', trend: 'up' }}
            icon={BarChart3}
            iconColor="#AF52DE"
            iconBg="rgba(175,82,222,0.1)"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Umsatz nach Kanal</h2>
                <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', marginTop: 2 }}>B2B vs. B2C — 6 Monate</p>
              </div>
            </div>
            <div className="card-body">
              <BarChart
                data={revenueData.map(r => ({
                  label: r.label,
                  segments: [
                    { value: r.b2b, color: '#2D7D46', label: 'B2B' },
                    { value: r.b2c, color: '#4CAF50', label: 'B2C' },
                  ],
                }))}
                height={220}
                valueFormat="euro-k"
              />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Top 10 Kunden</h2>
              <span style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>nach Umsatz</span>
            </div>
            <div style={{ padding: '8px 24px 24px' }}>
              {topCustomers.map((customer, index) => (
                <div key={customer.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 0', borderBottom: index < topCustomers.length - 1 ? '1px solid var(--color-border)' : 'none',
                }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: index < 3 ? '#2D7D46' : 'var(--color-bg-tertiary)',
                    color: index < 3 ? 'white' : 'var(--color-text-tertiary)',
                    fontSize: 11, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {index + 1}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {customer.name}
                    </p>
                  </div>
                  <div style={{ width: 100 }}>
                    <div style={{ height: 6, borderRadius: 3, background: 'var(--color-bg-tertiary)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 3,
                        width: `${(customer.totalRevenue / maxRevenue) * 100}%`,
                        background: index < 3 ? '#2D7D46' : '#4CAF50',
                      }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, minWidth: 80, textAlign: 'right' }}>
                    {formatCurrency(customer.totalRevenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="table-container" style={{ marginBottom: 24 }}>
          <div className="table-header">
            <h2 className="table-title">Monatliche Entwicklung</h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>Monat</th>
                <th style={{ textAlign: 'right' }}>B2B</th>
                <th style={{ textAlign: 'right' }}>B2C</th>
                <th style={{ textAlign: 'right' }}>Gesamt</th>
                <th style={{ textAlign: 'right' }}>Wachstum</th>
              </tr>
            </thead>
            <tbody>
              {revenueData.map((month, index) => {
                const prev = index > 0 ? revenueData[index - 1].total : null
                const growth = prev ? ((month.total - prev) / prev * 100).toFixed(1) : null
                return (
                  <tr key={month.month}>
                    <td style={{ fontWeight: 500 }}>{month.label} {month.month.split('-')[0]}</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(month.b2b)}</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(month.b2c)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(month.total)}</td>
                    <td style={{ textAlign: 'right' }}>
                      {growth ? (
                        <span style={{
                          color: parseFloat(growth) >= 0 ? '#34C759' : '#FF3B30',
                          fontWeight: 500,
                        }}>
                          {parseFloat(growth) >= 0 ? '+' : ''}{growth}%
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-text-tertiary)' }}>—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
          <div className="card">
            <div className="card-body" style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', marginBottom: 8 }}>Ø Verweildauer</p>
              <p style={{ fontSize: 36, fontWeight: 700, color: '#2D7D46' }}>45</p>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Tage</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body" style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', marginBottom: 8 }}>Umschlagshäufigkeit</p>
              <p style={{ fontSize: 36, fontWeight: 700, color: '#2D7D46' }}>8x</p>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>pro Jahr</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body" style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', marginBottom: 8 }}>Ø Lieferzeit</p>
              <p style={{ fontSize: 36, fontWeight: 700, color: '#2D7D46' }}>2,3</p>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Tage (Inland)</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
