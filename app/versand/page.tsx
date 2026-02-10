'use client'

import { useState } from 'react'
import { Truck, Package, MapPin, Check, X, Plus, ExternalLink } from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import { StatusBadge } from '@/components/StatusBadge'
import { formatNumber, formatDate } from '@/lib/utils'
import { useWawi } from '@/lib/wawi-context'
import type { DeliveryNote } from '@/lib/types'

const tabs = [
  { key: 'all', label: 'Alle' },
  { key: 'Erstellt', label: 'Erstellt' },
  { key: 'In Zustellung', label: 'In Zustellung' },
  { key: 'Zugestellt', label: 'Zugestellt' },
] as const

export default function VersandPage() {
  const { deliveryNotes, orders, addDeliveryNote } = useWawi()
  const [activeTab, setActiveTab] = useState<string>('all')
  const [selected, setSelected] = useState<DeliveryNote | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [toast, setToast] = useState('')

  // Form
  const [formOrderId, setFormOrderId] = useState('')
  const [formCarrier, setFormCarrier] = useState('DHL')
  const [formTracking, setFormTracking] = useState('')

  const filtered = activeTab === 'all' ? deliveryNotes : deliveryNotes.filter(d => d.status === activeTab)
  const inTransit = deliveryNotes.filter(d => d.status === 'In Zustellung').length
  const delivered = deliveryNotes.filter(d => d.status === 'Zugestellt').length
  const totalShipped = deliveryNotes.reduce((s, d) => s + d.quantity, 0)

  const shippableOrders = orders.filter(o =>
    (o.status === 'In Bearbeitung' || o.status === 'Versendet') &&
    !deliveryNotes.some(dn => dn.orderId === o.id)
  )

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleCreate = () => {
    const order = orders.find(o => o.id === formOrderId)
    if (!order) return
    const nextNum = deliveryNotes.length + 90
    const note: Omit<DeliveryNote, 'id'> = {
      deliveryNumber: `LS-2026-${String(nextNum).padStart(3, '0')}`,
      orderId: order.id, orderNumber: order.orderNumber,
      customerName: order.customerName, address: 'Lieferadresse',
      quantity: order.quantity, status: 'Erstellt',
      carrier: formCarrier, trackingNumber: formTracking || undefined,
      createdAt: new Date().toISOString().split('T')[0],
    }
    addDeliveryNote(note)
    setShowNewModal(false); setFormOrderId(''); setFormCarrier('DHL'); setFormTracking('')
    showToast(`Lieferschein ${note.deliveryNumber} erstellt`)
  }

  return (
    <>
      {toast && <div className="toast"><Check size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />{toast}</div>}

      <div className="app-header">
        <div className="header-left">
          <h1 className="header-title">Versand</h1>
          <p className="header-subtitle">Lieferscheine & Sendungsverfolgung</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewModal(true)}>
          <Plus size={16} /> Lieferschein erstellen
        </button>
      </div>

      <div className="page-content">
        <div className="stats-grid">
          <StatCard label="In Zustellung" value={String(inTransit)} subtitle="Aktive Sendungen" icon={Truck} iconColor="#FF9500" iconBg="rgba(255,149,0,0.1)" />
          <StatCard label="Zugestellt" value={String(delivered)} subtitle="Diesen Monat" icon={Check} iconColor="#34C759" iconBg="rgba(52,199,89,0.1)" />
          <StatCard label="Dosen versendet" value={formatNumber(totalShipped)} subtitle="Gesamt" icon={Package} iconColor="#2D7D46" iconBg="rgba(45,125,70,0.1)" />
          <StatCard label="Lieferscheine" value={String(deliveryNotes.length)} subtitle="Alle Zeiträume" icon={MapPin} iconColor="#007AFF" iconBg="rgba(0,122,255,0.1)" />
        </div>

        <div style={{ marginBottom: 24 }}>
          <div className="tabs" style={{ display: 'inline-flex' }}>
            {tabs.map(tab => {
              const count = tab.key === 'all' ? deliveryNotes.length : deliveryNotes.filter(d => d.status === tab.key).length
              return (
                <button key={tab.key} className={`tab ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)}>
                  {tab.label}<span className="tab-count">{count}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Lieferschein</th>
                <th>Bestellung</th>
                <th>Kunde</th>
                <th>Menge</th>
                <th>Versandart</th>
                <th>Tracking</th>
                <th>Status</th>
                <th>Datum</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(dn => (
                <tr key={dn.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(dn)}>
                  <td style={{ fontWeight: 500 }}>{dn.deliveryNumber}</td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{dn.orderNumber}</td>
                  <td>{dn.customerName}</td>
                  <td>{formatNumber(dn.quantity)} Dosen</td>
                  <td>
                    <span className="badge badge-default">{dn.carrier || '—'}</span>
                  </td>
                  <td style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>
                    {dn.trackingNumber ? dn.trackingNumber.slice(0, 12) + '...' : '—'}
                  </td>
                  <td><StatusBadge status={dn.status} /></td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{formatDate(dn.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">{selected.deliveryNumber}</h2>
                <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', marginTop: 4 }}>
                  {selected.orderNumber} &middot; {formatDate(selected.createdAt)}
                </p>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 12, padding: 16 }}>
                  <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Kunde</p>
                  <p style={{ fontWeight: 500 }}>{selected.customerName}</p>
                </div>
                <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 12, padding: 16 }}>
                  <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Menge</p>
                  <p style={{ fontWeight: 500 }}>{formatNumber(selected.quantity)} Dosen</p>
                </div>
              </div>
              <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Lieferadresse</p>
                <p style={{ fontWeight: 500 }}>{selected.address}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 12, padding: 16 }}>
                  <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Versandart</p>
                  <p style={{ fontWeight: 500 }}>{selected.carrier || '—'}</p>
                </div>
                <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 12, padding: 16 }}>
                  <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Tracking-Nr.</p>
                  <p style={{ fontWeight: 500, fontFamily: 'monospace', fontSize: 13 }}>{selected.trackingNumber || '—'}</p>
                </div>
              </div>
              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <StatusBadge status={selected.status} />
                {selected.deliveredAt && (
                  <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                    Zugestellt: {formatDate(selected.deliveredAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Delivery Note Modal */}
      {showNewModal && (
        <div className="modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Lieferschein erstellen</h2>
              <button className="modal-close" onClick={() => setShowNewModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Bestellung</label>
                <select className="form-select" value={formOrderId} onChange={e => setFormOrderId(e.target.value)}>
                  <option value="">Bestellung auswählen...</option>
                  {shippableOrders.map(o => (
                    <option key={o.id} value={o.id}>{o.orderNumber} — {o.customerName} ({formatNumber(o.quantity)} Dosen)</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Versanddienstleister</label>
                  <select className="form-select" value={formCarrier} onChange={e => setFormCarrier(e.target.value)}>
                    <option>DHL</option>
                    <option>DPD</option>
                    <option>GLS</option>
                    <option>Hermes</option>
                    <option>Eigenlieferung</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Tracking-Nummer</label>
                  <input type="text" className="form-input" placeholder="Optional" value={formTracking} onChange={e => setFormTracking(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowNewModal(false)}>Abbrechen</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={!formOrderId} style={{ opacity: !formOrderId ? 0.5 : 1 }}>
                <Check size={16} /> Lieferschein erstellen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
