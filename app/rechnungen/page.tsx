'use client'

import { useState } from 'react'
import { FileText, Euro, Clock, AlertTriangle, Check, X, Plus } from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import { StatusBadge } from '@/components/StatusBadge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useWawi } from '@/lib/wawi-context'
import type { Invoice } from '@/lib/types'

const tabs = [
  { key: 'all', label: 'Alle' },
  { key: 'Offen', label: 'Offen' },
  { key: 'Überfällig', label: 'Überfällig' },
  { key: 'Bezahlt', label: 'Bezahlt' },
] as const

export default function RechnungenPage() {
  const { invoices, orders, customers, addInvoice } = useWawi()
  const [activeTab, setActiveTab] = useState<string>('all')
  const [selected, setSelected] = useState<Invoice | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [toast, setToast] = useState('')

  // Form
  const [formOrderId, setFormOrderId] = useState('')
  const [formTerms, setFormTerms] = useState('14 Tage netto')

  const filtered = activeTab === 'all' ? invoices : invoices.filter(i => i.status === activeTab)
  const totalOpen = invoices.filter(i => i.status === 'Offen' || i.status === 'Überfällig').reduce((s, i) => s + i.total, 0)
  const totalPaid = invoices.filter(i => i.status === 'Bezahlt').reduce((s, i) => s + i.total, 0)
  const overdue = invoices.filter(i => i.status === 'Überfällig')

  const deliveredOrders = orders.filter(o => o.status === 'Geliefert' && !invoices.some(inv => inv.orderId === o.id))

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleCreate = () => {
    const order = orders.find(o => o.id === formOrderId)
    if (!order) return
    const daysMap: Record<string, number> = { '7 Tage netto': 7, '14 Tage netto': 14, '30 Tage netto': 30 }
    const days = daysMap[formTerms] || 14
    const due = new Date(); due.setDate(due.getDate() + days)
    const nextNum = invoices.length + 40
    const inv: Omit<Invoice, 'id'> = {
      invoiceNumber: `RE-2026-${String(nextNum).padStart(3, '0')}`,
      orderId: order.id, orderNumber: order.orderNumber,
      customerId: order.customerId, customerName: order.customerName,
      type: order.type, subtotal: order.subtotal, pfandTotal: order.pfandTotal, total: order.total,
      status: 'Offen', dueDate: due.toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0], paymentTerms: formTerms,
    }
    addInvoice(inv)
    setShowNewModal(false); setFormOrderId(''); setFormTerms('14 Tage netto')
    showToast(`Rechnung ${inv.invoiceNumber} erstellt`)
  }

  return (
    <>
      {toast && <div className="toast"><Check size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />{toast}</div>}

      <div className="app-header">
        <div className="header-left">
          <h1 className="header-title">Rechnungen</h1>
          <p className="header-subtitle">{invoices.length} Rechnungen</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewModal(true)}>
          <Plus size={16} /> Rechnung erstellen
        </button>
      </div>

      <div className="page-content">
        <div className="stats-grid">
          <StatCard label="Offene Forderungen" value={formatCurrency(totalOpen)} subtitle={`${invoices.filter(i => i.status === 'Offen').length} offene Rechnungen`} icon={Clock} iconColor="#FF9500" iconBg="rgba(255,149,0,0.1)" />
          <StatCard label="Überfällig" value={formatCurrency(overdue.reduce((s, i) => s + i.total, 0))} subtitle={`${overdue.length} Mahnungen fällig`} icon={AlertTriangle} iconColor="#FF3B30" iconBg="rgba(255,59,48,0.1)" />
          <StatCard label="Bezahlt (Monat)" value={formatCurrency(totalPaid)} change={{ value: 'Zeitraum: Feb 2026', trend: 'up' }} icon={Euro} iconColor="#34C759" iconBg="rgba(52,199,89,0.1)" />
          <StatCard label="Rechnungen gesamt" value={String(invoices.length)} subtitle="Alle Zeiträume" icon={FileText} iconColor="#2D7D46" iconBg="rgba(45,125,70,0.1)" />
        </div>

        <div style={{ marginBottom: 24 }}>
          <div className="tabs" style={{ display: 'inline-flex' }}>
            {tabs.map(tab => {
              const count = tab.key === 'all' ? invoices.length : invoices.filter(i => i.status === tab.key).length
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
                <th>Rechnung</th>
                <th>Bestellung</th>
                <th>Kunde</th>
                <th>Zahlungsziel</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Betrag</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(inv)}>
                  <td style={{ fontWeight: 500 }}>{inv.invoiceNumber}</td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{inv.orderNumber}</td>
                  <td>{inv.customerName}</td>
                  <td style={{ color: inv.status === 'Überfällig' ? '#FF3B30' : 'var(--color-text-secondary)' }}>
                    {formatDate(inv.dueDate)}
                  </td>
                  <td><StatusBadge status={inv.status} /></td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(inv.total)}</td>
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
                <h2 className="modal-title">{selected.invoiceNumber}</h2>
                <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', marginTop: 4 }}>
                  {selected.paymentTerms} &middot; Erstellt {formatDate(selected.createdAt)}
                </p>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                  <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Kunde</p>
                  <p style={{ fontWeight: 500 }}>{selected.customerName}</p>
                </div>
                <StatusBadge status={selected.status} />
              </div>
              <div className="form-summary">
                <div className="form-summary-row">
                  <span style={{ color: 'var(--color-text-secondary)' }}>Bestellung</span>
                  <span>{selected.orderNumber}</span>
                </div>
                <div className="form-summary-row">
                  <span style={{ color: 'var(--color-text-secondary)' }}>Warenwert</span>
                  <span>{formatCurrency(selected.subtotal)}</span>
                </div>
                <div className="form-summary-row">
                  <span style={{ color: 'var(--color-text-secondary)' }}>Pfand</span>
                  <span>{formatCurrency(selected.pfandTotal)}</span>
                </div>
                <div className="form-summary-total">
                  <span>Rechnungsbetrag</span>
                  <span style={{ color: '#2D7D46' }}>{formatCurrency(selected.total)}</span>
                </div>
              </div>
              <div style={{ marginTop: 20, display: 'flex', gap: 16 }}>
                <div style={{ flex: 1, background: 'var(--color-bg-secondary)', borderRadius: 12, padding: 16 }}>
                  <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Fällig am</p>
                  <p style={{ fontWeight: 600, color: selected.status === 'Überfällig' ? '#FF3B30' : 'var(--color-text)' }}>{formatDate(selected.dueDate)}</p>
                </div>
                <div style={{ flex: 1, background: 'var(--color-bg-secondary)', borderRadius: 12, padding: 16 }}>
                  <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Bezahlt am</p>
                  <p style={{ fontWeight: 600, color: selected.paidAt ? '#34C759' : 'var(--color-text-tertiary)' }}>{selected.paidAt ? formatDate(selected.paidAt) : '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Invoice Modal */}
      {showNewModal && (
        <div className="modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Rechnung erstellen</h2>
              <button className="modal-close" onClick={() => setShowNewModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Gelieferte Bestellung</label>
                <select className="form-select" value={formOrderId} onChange={e => setFormOrderId(e.target.value)}>
                  <option value="">Bestellung auswählen...</option>
                  {deliveredOrders.map(o => (
                    <option key={o.id} value={o.id}>{o.orderNumber} — {o.customerName} ({formatCurrency(o.total)})</option>
                  ))}
                </select>
                {deliveredOrders.length === 0 && <p className="form-hint">Keine unberechteten gelieferten Bestellungen vorhanden.</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Zahlungsbedingung</label>
                <select className="form-select" value={formTerms} onChange={e => setFormTerms(e.target.value)}>
                  <option value="7 Tage netto">7 Tage netto</option>
                  <option value="14 Tage netto">14 Tage netto</option>
                  <option value="30 Tage netto">30 Tage netto</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowNewModal(false)}>Abbrechen</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={!formOrderId} style={{ opacity: !formOrderId ? 0.5 : 1 }}>
                <Check size={16} /> Rechnung erstellen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
