'use client'

import { Package, ShoppingCart, TrendingUp, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { StatCard } from '@/components/StatCard'
import { BarChart } from '@/components/BarChart'
import { StockIndicator } from '@/components/StockIndicator'
import { MHDWarning } from '@/components/MHDWarning'
import { StatusBadge } from '@/components/StatusBadge'
import { formatCurrency, formatNumber, formatDateShort } from '@/lib/utils'
import { useWawi } from '@/lib/wawi-context'

export default function Dashboard() {
  const { orders, revenueData, stockBatches, stockCapacity, customers } = useWawi()

  const totalStock = stockBatches.reduce((sum, b) => sum + b.quantity, 0)
  const openOrders = orders.filter(o => o.status === 'Neu' || o.status === 'In Bearbeitung').length
  const currentMonthRevenue = revenueData[revenueData.length - 1]
  const previousMonthRevenue = revenueData[revenueData.length - 2]
  const revenueGrowth = ((currentMonthRevenue.total - previousMonthRevenue.total) / previousMonthRevenue.total * 100).toFixed(1)

  const recentOrders = orders.slice(0, 5)
  const warningBatches = stockBatches.filter(b => b.status === 'Kritisch' || b.status === 'Niedrig')

  return (
    <>
      <div className="app-header">
        <div className="header-left">
          <h1 className="header-title">Dashboard</h1>
          <p className="header-subtitle">
            {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="page-content">
        <div className="stats-grid">
          <StatCard
            label="Lagerbestand"
            value={formatNumber(totalStock)}
            subtitle={`${((totalStock / stockCapacity) * 100).toFixed(0)}% Kapazität`}
            icon={Package}
            iconColor="#2D7D46"
            iconBg="rgba(45,125,70,0.1)"
          />
          <StatCard
            label="Offene Bestellungen"
            value={String(openOrders)}
            subtitle="Neu + In Bearbeitung"
            icon={ShoppingCart}
            iconColor="#007AFF"
            iconBg="rgba(0,122,255,0.1)"
          />
          <StatCard
            label="Umsatz MTD"
            value={formatCurrency(currentMonthRevenue.total)}
            change={{ value: `${revenueGrowth}% vs. Vormonat`, trend: 'up' }}
            icon={TrendingUp}
            iconColor="#34C759"
            iconBg="rgba(52,199,89,0.1)"
          />
          <StatCard
            label="B2B Kunden"
            value={String(customers.length)}
            change={{ value: '+2 diesen Monat', trend: 'up' }}
            icon={Users}
            iconColor="#AF52DE"
            iconBg="rgba(175,82,222,0.1)"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="card">
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(45,125,70,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={22} style={{ color: '#2D7D46' }} />
                  </div>
                  <div>
                    <h2 className="card-title">Umsatzentwicklung</h2>
                    <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', marginTop: 2 }}>Letzte 6 Monate</p>
                  </div>
                </div>
                <Link href="/berichte" className="btn btn-secondary btn-sm">
                  Details <ArrowRight size={14} />
                </Link>
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
                  height={200}
                  valueFormat="euro-k"
                />
              </div>
            </div>

            <div className="table-container">
              <div className="table-header">
                <h2 className="table-title">Aktuelle Bestellungen</h2>
                <Link href="/bestellungen" className="btn btn-ghost btn-sm">
                  Alle anzeigen <ArrowRight size={14} />
                </Link>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Bestellung</th>
                    <th>Kunde</th>
                    <th>Typ</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Gesamt</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 500 }}>{order.orderNumber}</td>
                      <td style={{ color: 'var(--color-text-secondary)' }}>{order.customerName}</td>
                      <td>
                        <span className={order.type === 'B2B' ? 'badge badge-primary' : 'badge badge-default'}>
                          {order.type}
                        </span>
                      </td>
                      <td><StatusBadge status={order.status} /></td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(order.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Lagerübersicht</h2>
                <Link href="/lager" className="btn btn-ghost btn-sm">
                  Details <ArrowRight size={14} />
                </Link>
              </div>
              <div className="card-body">
                <StockIndicator current={totalStock} capacity={stockCapacity} label="Auslastung" height={14} />
                <div style={{ marginTop: 20 }}>
                  {stockBatches.map((batch) => (
                    <div key={batch.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '12px 0', borderBottom: '1px solid var(--color-border)',
                    }}>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 500 }}>{batch.batchNumber}</p>
                        <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{batch.location}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 14, fontWeight: 600 }}>{formatNumber(batch.quantity)}</p>
                        <StatusBadge status={batch.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {warningBatches.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">MHD-Warnungen</h2>
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {warningBatches.map((batch) => (
                    <MHDWarning
                      key={batch.id}
                      mhd={batch.mhd}
                      quantity={batch.quantity}
                      batchNumber={batch.batchNumber}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Schnellzugriff</h2>
              </div>
              <div style={{ padding: 16 }}>
                {[
                  { label: 'Neue Bestellung', desc: 'B2B oder B2C erfassen', href: '/bestellungen', icon: ShoppingCart, color: '#007AFF', bg: 'rgba(0,122,255,0.1)' },
                  { label: 'Wareneingang', desc: 'Lieferung einbuchen', href: '/lager', icon: Package, color: '#2D7D46', bg: 'rgba(45,125,70,0.1)' },
                  { label: 'Neuer Kunde', desc: 'B2B-Kunde anlegen', href: '/kunden', icon: Users, color: '#AF52DE', bg: 'rgba(175,82,222,0.1)' },
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16, padding: 16,
                      borderRadius: 14, textDecoration: 'none', transition: 'background 0.2s',
                    }}
                    className="hover:bg-[var(--color-bg-secondary)]"
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: 14,
                      background: action.bg, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <action.icon size={20} style={{ color: action.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 500, color: 'var(--color-text)', marginBottom: 2 }}>{action.label}</p>
                      <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>{action.desc}</p>
                    </div>
                    <ArrowRight size={16} style={{ color: 'var(--color-text-tertiary)' }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
