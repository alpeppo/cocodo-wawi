'use client'

import { useState } from 'react'
import { ShoppingCart, Package, TrendingUp, Clock, X, Check } from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import { StatusBadge } from '@/components/StatusBadge'
import { formatCurrency, formatNumber, formatDate, calculatePfand } from '@/lib/utils'
import { useWawi } from '@/lib/wawi-context'
import type { Order } from '@/lib/types'

const tabs = [
  { key: 'all', label: 'Alle' },
  { key: 'B2B', label: 'B2B' },
  { key: 'B2C', label: 'B2C' },
] as const

export default function BestellungenPage() {
  const { orders, customers, products, addOrder } = useWawi()
  const [activeTab, setActiveTab] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [toast, setToast] = useState('')

  // New order form state
  const [newType, setNewType] = useState<'B2B' | 'B2C'>('B2B')
  const [newCustomerId, setNewCustomerId] = useState('')
  const [newB2CName, setNewB2CName] = useState('')
  const [newQuantity, setNewQuantity] = useState('')

  const filtered = activeTab === 'all' ? orders : orders.filter(o => o.type === activeTab)
  const todayOrders = orders.filter(o => o.createdAt === new Date().toISOString().split('T')[0]).length
  const totalRevenue = orders.filter(o => o.status !== 'Storniert').reduce((s, o) => s + o.total, 0)
  const product = products[0]

  const selectedCustomer = customers.find(c => c.id === newCustomerId)
  const qty = parseInt(newQuantity) || 0

  // Calculate price per can based on type
  const pricePerCan = newType === 'B2B'
    ? (selectedCustomer?.pricing || product?.b2bBasePrice || 1.80)
    : (product?.b2cPricing?.find(t => t.quantity >= qty)?.pricePerCan || product?.b2cPricing?.[0]?.pricePerCan || 2.31)

  const subtotal = qty * pricePerCan
  const pfandTotal = calculatePfand(qty)
  const total = subtotal + pfandTotal

  const resetForm = () => {
    setNewType('B2B')
    setNewCustomerId('')
    setNewB2CName('')
    setNewQuantity('')
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleCreateOrder = () => {
    if (qty <= 0) return
    if (newType === 'B2B' && !newCustomerId) return
    if (newType === 'B2C' && !newB2CName.trim()) return

    const nextNum = orders.length + 100
    const orderNumber = `CO-2026-${String(nextNum).padStart(3, '0')}`
    const customerName = newType === 'B2B'
      ? (selectedCustomer?.name || '')
      : newB2CName.trim()

    const newOrder: Omit<Order, 'id'> = {
      orderNumber,
      customerId: newType === 'B2B' ? newCustomerId : undefined,
      customerName,
      type: newType,
      status: 'Neu',
      quantity: qty,
      pricePerCan,
      subtotal,
      pfandTotal,
      total,
      createdAt: new Date().toISOString().split('T')[0],
    }

    addOrder(newOrder)
    setShowNewModal(false)
    resetForm()
    showToast(`Bestellung ${orderNumber} erstellt`)
  }

  return (
    <>
      {toast && <div className="toast"><Check size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />{toast}</div>}

      <div className="app-header">
        <div className="header-left">
          <h1 className="header-title">Bestellungen</h1>
          <p className="header-subtitle">{orders.length} Bestellungen insgesamt</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewModal(true)}>
          <ShoppingCart size={16} />
          Neue Bestellung
        </button>
      </div>

      <div className="page-content">
        <div className="stats-grid">
          <StatCard label="Gesamt" value={String(orders.length)} change={{ value: '+12 diesen Monat', trend: 'up' }} icon={ShoppingCart} iconColor="#2D7D46" iconBg="rgba(45,125,70,0.1)" />
          <StatCard label="Offen" value={String(orders.filter(o => o.status === 'Neu' || o.status === 'In Bearbeitung').length)} subtitle="Neu + In Bearbeitung" icon={Clock} iconColor="#FF9500" iconBg="rgba(255,149,0,0.1)" />
          <StatCard label="Heute" value={String(todayOrders)} subtitle="Neue Bestellungen" icon={Package} iconColor="#007AFF" iconBg="rgba(0,122,255,0.1)" />
          <StatCard label="Umsatz" value={formatCurrency(totalRevenue)} change={{ value: '+18.2% vs. Vormonat', trend: 'up' }} icon={TrendingUp} iconColor="#34C759" iconBg="rgba(52,199,89,0.1)" />
        </div>

        <div style={{ marginBottom: 24 }}>
          <div className="tabs" style={{ display: 'inline-flex' }}>
            {tabs.map((tab) => {
              const count = tab.key === 'all' ? orders.length : orders.filter(o => o.type === tab.key).length
              return (
                <button key={tab.key} className={`tab ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)}>
                  {tab.label}
                  <span className="tab-count">{count}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Bestellung</th>
                <th>Kunde</th>
                <th>Typ</th>
                <th>Menge</th>
                <th>Status</th>
                <th>Datum</th>
                <th style={{ textAlign: 'right' }}>Gesamt</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedOrder(order)}>
                  <td style={{ fontWeight: 500 }}>{order.orderNumber}</td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{order.customerName}</td>
                  <td>
                    <span className={order.type === 'B2B' ? 'badge badge-primary' : 'badge badge-default'}>
                      {order.type}
                    </span>
                  </td>
                  <td>{formatNumber(order.quantity)} Dosen</td>
                  <td><StatusBadge status={order.status} /></td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{formatDate(order.createdAt)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Bestellung {selectedOrder.orderNumber}</h2>
                <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', marginTop: 4 }}>
                  {formatDate(selectedOrder.createdAt)} &middot; {selectedOrder.type}
                </p>
              </div>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                  <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Kunde</p>
                  <p style={{ fontWeight: 500 }}>{selectedOrder.customerName}</p>
                </div>
                <StatusBadge status={selectedOrder.status} />
              </div>

              <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 14, padding: 20, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
                    Cocodo Kokoswasser 250ml &times; {formatNumber(selectedOrder.quantity)}
                  </span>
                  <span style={{ fontWeight: 500 }}>{formatCurrency(selectedOrder.pricePerCan)}/Dose</span>
                </div>
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Zwischensumme</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      Pfand ({formatNumber(selectedOrder.quantity)} &times; €0,25)
                    </span>
                    <span>{formatCurrency(selectedOrder.pfandTotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 600, borderTop: '1px solid var(--color-border)', paddingTop: 12 }}>
                    <span>Gesamt</span>
                    <span style={{ color: '#2D7D46' }}>{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Status-Verlauf</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Erstellt', date: selectedOrder.createdAt, done: true },
                  { label: 'In Bearbeitung', date: selectedOrder.createdAt, done: selectedOrder.status !== 'Neu' },
                  { label: 'Versendet', date: selectedOrder.shippedAt, done: !!selectedOrder.shippedAt },
                  { label: 'Geliefert', date: selectedOrder.deliveredAt, done: !!selectedOrder.deliveredAt },
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: step.done ? '#34C759' : 'var(--color-bg-tertiary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, color: step.done ? 'white' : 'var(--color-text-tertiary)', fontWeight: 600,
                    }}>
                      {step.done ? '✓' : i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 14, fontWeight: step.done ? 500 : 400, color: step.done ? 'var(--color-text)' : 'var(--color-text-tertiary)' }}>
                        {step.label}
                      </span>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                      {step.date ? formatDate(step.date) : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Order Modal */}
      {showNewModal && (
        <div className="modal-overlay" onClick={() => { setShowNewModal(false); resetForm() }}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Neue Bestellung</h2>
              <button className="modal-close" onClick={() => { setShowNewModal(false); resetForm() }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {/* Type Selection */}
              <div className="form-group">
                <label className="form-label">Bestelltyp</label>
                <div className="form-radio-group">
                  <label className="form-radio-label">
                    <input type="radio" name="type" checked={newType === 'B2B'} onChange={() => { setNewType('B2B'); setNewB2CName('') }} />
                    B2B (Geschäftskunde)
                  </label>
                  <label className="form-radio-label">
                    <input type="radio" name="type" checked={newType === 'B2C'} onChange={() => { setNewType('B2C'); setNewCustomerId('') }} />
                    B2C (Endkunde)
                  </label>
                </div>
              </div>

              {/* Customer Selection */}
              {newType === 'B2B' ? (
                <div className="form-group">
                  <label className="form-label">Kunde</label>
                  <select className="form-select" value={newCustomerId} onChange={(e) => setNewCustomerId(e.target.value)}>
                    <option value="">Kunde auswählen...</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.type}, {formatCurrency(c.pricing)}/Dose)</option>
                    ))}
                  </select>
                  {selectedCustomer && (
                    <p className="form-hint">Preis: {formatCurrency(selectedCustomer.pricing)}/Dose</p>
                  )}
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Kundenname</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="z.B. Online-Bestellung #4822"
                    value={newB2CName}
                    onChange={(e) => setNewB2CName(e.target.value)}
                  />
                </div>
              )}

              {/* Quantity */}
              <div className="form-group">
                <label className="form-label">Menge (Dosen)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder={newType === 'B2B' ? 'z.B. 96, 144, 240' : 'z.B. 24, 48, 72, 96'}
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  min="1"
                  step="24"
                />
                {newType === 'B2C' && (
                  <p className="form-hint">Verfügbare Packungsgrößen: 24, 48, 72, 96</p>
                )}
              </div>

              {/* Summary */}
              {qty > 0 && (
                <div className="form-summary">
                  <div className="form-summary-row">
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      {formatNumber(qty)} Dosen × {formatCurrency(pricePerCan)}
                    </span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="form-summary-row">
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      Pfand ({formatNumber(qty)} × €0,25)
                    </span>
                    <span>{formatCurrency(pfandTotal)}</span>
                  </div>
                  <div className="form-summary-total">
                    <span>Gesamt</span>
                    <span style={{ color: '#2D7D46' }}>{formatCurrency(total)}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => { setShowNewModal(false); resetForm() }}>
                Abbrechen
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreateOrder}
                disabled={qty <= 0 || (newType === 'B2B' && !newCustomerId) || (newType === 'B2C' && !newB2CName.trim())}
                style={{ opacity: qty <= 0 || (newType === 'B2B' && !newCustomerId) || (newType === 'B2C' && !newB2CName.trim()) ? 0.5 : 1 }}
              >
                <Check size={16} />
                Bestellung erstellen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
