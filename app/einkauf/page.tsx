'use client'

import { useState } from 'react'
import { ShoppingBag, Ship, Clock, Check, X, Plus, Anchor } from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import { StatusBadge } from '@/components/StatusBadge'
import { formatCurrency, formatNumber, formatDate, getDaysUntil } from '@/lib/utils'
import { useWawi } from '@/lib/wawi-context'
import type { PurchaseOrder } from '@/lib/types'

const statusColors: Record<string, string> = {
  'Entwurf': 'badge-default',
  'Bestellt': 'badge-blue',
  'Verschifft': 'badge-warning',
  'Im Zoll': 'badge-purple',
  'Geliefert': 'badge-success',
}

export default function EinkaufPage() {
  const { purchaseOrders, addPurchaseOrder } = useWawi()
  const [selected, setSelected] = useState<PurchaseOrder | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [toast, setToast] = useState('')

  // Form
  const [formQty, setFormQty] = useState('')
  const [formPrice, setFormPrice] = useState('0.85')
  const [formShipping, setFormShipping] = useState('1200')
  const [formCustoms, setFormCustoms] = useState('380')
  const [formContainer, setFormContainer] = useState('')
  const [formNotes, setFormNotes] = useState('')

  const activeOrders = purchaseOrders.filter(po => po.status !== 'Geliefert')
  const totalInTransit = purchaseOrders.filter(po => po.status === 'Verschifft').reduce((s, po) => s + po.quantity, 0)
  const totalSpent = purchaseOrders.reduce((s, po) => s + po.totalCost, 0)
  const avgPricePerCan = totalSpent / purchaseOrders.reduce((s, po) => s + po.quantity, 0)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleCreate = () => {
    const qty = parseInt(formQty) || 0
    if (qty <= 0) return
    const price = parseFloat(formPrice) || 0.85
    const shipping = parseFloat(formShipping) || 0
    const customs = parseFloat(formCustoms) || 0
    const total = qty * price + shipping + customs
    const eta = new Date(); eta.setDate(eta.getDate() + 42)
    const nextNum = purchaseOrders.length + 4

    const po: Omit<PurchaseOrder, 'id'> = {
      poNumber: `PO-2026-${String(nextNum).padStart(3, '0')}`,
      supplier: 'Mekong Delta Coconut Co.',
      quantity: qty, pricePerUnit: price,
      shippingCost: shipping, customsCost: customs, totalCost: total,
      status: 'Bestellt',
      orderDate: new Date().toISOString().split('T')[0],
      estimatedArrival: eta.toISOString().split('T')[0],
      containerNumber: formContainer || undefined,
      notes: formNotes || undefined,
    }
    addPurchaseOrder(po)
    setShowNewModal(false)
    setFormQty(''); setFormPrice('0.85'); setFormShipping('1200'); setFormCustoms('380'); setFormContainer(''); setFormNotes('')
    showToast(`Einkaufsbestellung ${po.poNumber} erstellt`)
  }

  return (
    <>
      {toast && <div className="toast"><Check size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />{toast}</div>}

      <div className="app-header">
        <div className="header-left">
          <h1 className="header-title">Einkauf</h1>
          <p className="header-subtitle">Beschaffung & Container-Tracking</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewModal(true)}>
          <Plus size={16} /> Neue Bestellung
        </button>
      </div>

      <div className="page-content">
        <div className="stats-grid">
          <StatCard label="Aktive Bestellungen" value={String(activeOrders.length)} subtitle="In Bearbeitung" icon={ShoppingBag} iconColor="#2D7D46" iconBg="rgba(45,125,70,0.1)" />
          <StatCard label="Unterwegs" value={formatNumber(totalInTransit) + ' Dosen'} subtitle="Auf dem Seeweg" icon={Ship} iconColor="#007AFF" iconBg="rgba(0,122,255,0.1)" />
          <StatCard label="Ø Einkaufspreis" value={formatCurrency(avgPricePerCan)} subtitle="pro Dose (inkl. Logistik)" icon={Anchor} iconColor="#AF52DE" iconBg="rgba(175,82,222,0.1)" />
          <StatCard label="Gesamtausgaben" value={formatCurrency(totalSpent)} subtitle="Alle Bestellungen" icon={Clock} iconColor="#FF9500" iconBg="rgba(255,149,0,0.1)" />
        </div>

        {/* Active orders as cards */}
        {activeOrders.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Aktive Bestellungen</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {activeOrders.map(po => {
                const daysLeft = getDaysUntil(po.estimatedArrival)
                return (
                  <div key={po.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelected(po)}>
                    <div className="card-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div>
                          <p style={{ fontWeight: 600 }}>{po.poNumber}</p>
                          <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>{po.supplier}</p>
                        </div>
                        <span className={`badge ${statusColors[po.status]}`}>{po.status}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                        <div>
                          <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>Menge</p>
                          <p style={{ fontWeight: 600 }}>{formatNumber(po.quantity)}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>Kosten</p>
                          <p style={{ fontWeight: 600 }}>{formatCurrency(po.totalCost)}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>ETA</p>
                          <p style={{ fontWeight: 600, color: daysLeft < 7 ? '#34C759' : 'var(--color-text)' }}>
                            {daysLeft > 0 ? `${daysLeft} Tage` : 'Überfällig'}
                          </p>
                        </div>
                      </div>
                      {po.containerNumber && (
                        <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--color-bg-secondary)', borderRadius: 8, fontSize: 13 }}>
                          <span style={{ color: 'var(--color-text-tertiary)' }}>Container: </span>
                          <span style={{ fontFamily: 'monospace', fontWeight: 500 }}>{po.containerNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* All orders table */}
        <div className="table-container">
          <div className="table-header">
            <h2 className="table-title">Alle Einkaufsbestellungen</h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>PO-Nr.</th>
                <th>Lieferant</th>
                <th>Menge</th>
                <th>Stückpreis</th>
                <th>Gesamt</th>
                <th>Status</th>
                <th>Bestellt</th>
                <th>ETA / Ankunft</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.map(po => (
                <tr key={po.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(po)}>
                  <td style={{ fontWeight: 500 }}>{po.poNumber}</td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{po.supplier}</td>
                  <td>{formatNumber(po.quantity)} Dosen</td>
                  <td>{formatCurrency(po.pricePerUnit)}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(po.totalCost)}</td>
                  <td><span className={`badge ${statusColors[po.status]}`}>{po.status}</span></td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{formatDate(po.orderDate)}</td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{formatDate(po.actualArrival || po.estimatedArrival)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">{selected.poNumber}</h2>
                <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', marginTop: 4 }}>{selected.supplier}</p>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-summary" style={{ marginTop: 0 }}>
                <div className="form-summary-row">
                  <span style={{ color: 'var(--color-text-secondary)' }}>{formatNumber(selected.quantity)} Dosen × {formatCurrency(selected.pricePerUnit)}</span>
                  <span>{formatCurrency(selected.quantity * selected.pricePerUnit)}</span>
                </div>
                <div className="form-summary-row">
                  <span style={{ color: 'var(--color-text-secondary)' }}>Frachtkosten</span>
                  <span>{formatCurrency(selected.shippingCost)}</span>
                </div>
                <div className="form-summary-row">
                  <span style={{ color: 'var(--color-text-secondary)' }}>Zoll & Abgaben</span>
                  <span>{formatCurrency(selected.customsCost)}</span>
                </div>
                <div className="form-summary-total">
                  <span>Gesamtkosten</span>
                  <span style={{ color: '#2D7D46' }}>{formatCurrency(selected.totalCost)}</span>
                </div>
                <div className="form-summary-row" style={{ marginTop: 4 }}>
                  <span style={{ color: 'var(--color-text-tertiary)', fontSize: 13 }}>Landedkosten pro Dose</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{formatCurrency(selected.totalCost / selected.quantity)}</span>
                </div>
              </div>
              {selected.notes && (
                <div style={{ marginTop: 16, padding: 16, background: 'var(--color-bg-secondary)', borderRadius: 12, fontSize: 14, color: 'var(--color-text-secondary)' }}>
                  {selected.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New PO Modal */}
      {showNewModal && (
        <div className="modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Neue Einkaufsbestellung</h2>
              <button className="modal-close" onClick={() => setShowNewModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div style={{ padding: '12px 16px', background: 'rgba(45,125,70,0.06)', borderRadius: 12, marginBottom: 20, fontSize: 14 }}>
                <strong>Lieferant:</strong> Mekong Delta Coconut Co., Vietnam
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Menge (Dosen) *</label>
                  <input type="number" className="form-input" placeholder="z.B. 5000" value={formQty} onChange={e => setFormQty(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Stückpreis (€)</label>
                  <input type="number" className="form-input" step="0.01" value={formPrice} onChange={e => setFormPrice(e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Frachtkosten (€)</label>
                  <input type="number" className="form-input" value={formShipping} onChange={e => setFormShipping(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Zoll & Abgaben (€)</label>
                  <input type="number" className="form-input" value={formCustoms} onChange={e => setFormCustoms(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Container-Nummer</label>
                <input type="text" className="form-input" placeholder="z.B. MSKU7294610" value={formContainer} onChange={e => setFormContainer(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Notizen</label>
                <input type="text" className="form-input" placeholder="Optionale Anmerkungen" value={formNotes} onChange={e => setFormNotes(e.target.value)} />
              </div>
              {(parseInt(formQty) || 0) > 0 && (
                <div className="form-summary">
                  <div className="form-summary-total">
                    <span>Gesamtkosten</span>
                    <span style={{ color: '#2D7D46' }}>
                      {formatCurrency((parseInt(formQty) || 0) * (parseFloat(formPrice) || 0) + (parseFloat(formShipping) || 0) + (parseFloat(formCustoms) || 0))}
                    </span>
                  </div>
                  <div className="form-summary-row">
                    <span style={{ color: 'var(--color-text-tertiary)', fontSize: 13 }}>Landedkosten/Dose</span>
                    <span style={{ fontSize: 13 }}>
                      {formatCurrency(((parseInt(formQty) || 0) * (parseFloat(formPrice) || 0) + (parseFloat(formShipping) || 0) + (parseFloat(formCustoms) || 0)) / (parseInt(formQty) || 1))}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowNewModal(false)}>Abbrechen</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={(parseInt(formQty) || 0) <= 0} style={{ opacity: (parseInt(formQty) || 0) <= 0 ? 0.5 : 1 }}>
                <Check size={16} /> Bestellung aufgeben
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
