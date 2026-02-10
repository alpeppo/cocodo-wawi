'use client'

import { useState } from 'react'
import { Coins, ArrowUpCircle, ArrowDownCircle, TrendingUp, Check, X, Plus } from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils'
import { useWawi } from '@/lib/wawi-context'
import type { PfandTransaction } from '@/lib/types'

export default function PfandPage() {
  const { pfandTransactions, customers, addPfandTransaction } = useWawi()
  const [filter, setFilter] = useState<'Alle' | 'Ausgabe' | 'Rücknahme'>('Alle')
  const [showNewModal, setShowNewModal] = useState(false)
  const [toast, setToast] = useState('')

  // Form
  const [formType, setFormType] = useState<'Ausgabe' | 'Rücknahme'>('Rücknahme')
  const [formCustomerId, setFormCustomerId] = useState('')
  const [formQty, setFormQty] = useState('')

  const totalAusgabe = pfandTransactions.filter(t => t.type === 'Ausgabe').reduce((s, t) => s + t.amount, 0)
  const totalRuecknahme = pfandTransactions.filter(t => t.type === 'Rücknahme').reduce((s, t) => s + t.amount, 0)
  const saldo = totalAusgabe - totalRuecknahme
  const totalDosenImUmlauf = pfandTransactions.filter(t => t.type === 'Ausgabe').reduce((s, t) => s + t.quantity, 0)
    - pfandTransactions.filter(t => t.type === 'Rücknahme').reduce((s, t) => s + t.quantity, 0)

  const filtered = filter === 'Alle' ? pfandTransactions : pfandTransactions.filter(t => t.type === filter)

  // Aggregate per customer
  const customerSaldo = new Map<string, { name: string; ausgabe: number; ruecknahme: number }>()
  pfandTransactions.forEach(t => {
    const key = t.customerName
    const entry = customerSaldo.get(key) || { name: key, ausgabe: 0, ruecknahme: 0 }
    if (t.type === 'Ausgabe') entry.ausgabe += t.quantity
    else entry.ruecknahme += t.quantity
    customerSaldo.set(key, entry)
  })
  const customerList = Array.from(customerSaldo.values())
    .map(c => ({ ...c, offen: c.ausgabe - c.ruecknahme }))
    .filter(c => c.offen !== 0)
    .sort((a, b) => b.offen - a.offen)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleCreate = () => {
    const qty = parseInt(formQty) || 0
    if (qty <= 0 || !formCustomerId) return
    const customer = customers.find(c => c.id === formCustomerId)
    if (!customer) return

    const tx: Omit<PfandTransaction, 'id'> = {
      customerId: customer.id,
      customerName: customer.name,
      type: formType,
      quantity: qty,
      amount: qty * 0.25,
      createdAt: new Date().toISOString().split('T')[0],
    }
    addPfandTransaction(tx)
    setShowNewModal(false)
    setFormType('Rücknahme'); setFormCustomerId(''); setFormQty('')
    showToast(`Pfand-${formType} über ${qty} Dosen erfasst`)
  }

  return (
    <>
      {toast && <div className="toast"><Check size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />{toast}</div>}

      <div className="app-header">
        <div className="header-left">
          <h1 className="header-title">Pfand</h1>
          <p className="header-subtitle">Pfandverwaltung & Salden</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewModal(true)}>
          <Plus size={16} /> Pfand buchen
        </button>
      </div>

      <div className="page-content">
        <div className="stats-grid">
          <StatCard label="Offenes Pfand" value={formatCurrency(saldo)} subtitle="Ausstehende Rücknahmen" icon={Coins} iconColor="#2D7D46" iconBg="rgba(45,125,70,0.1)" />
          <StatCard label="Dosen im Umlauf" value={formatNumber(totalDosenImUmlauf)} subtitle="Noch nicht zurückgegeben" icon={TrendingUp} iconColor="#FF9500" iconBg="rgba(255,149,0,0.1)" />
          <StatCard label="Ausgegeben" value={formatCurrency(totalAusgabe)} subtitle={`${pfandTransactions.filter(t => t.type === 'Ausgabe').length} Transaktionen`} icon={ArrowUpCircle} iconColor="#FF3B30" iconBg="rgba(255,59,48,0.1)" />
          <StatCard label="Zurückgenommen" value={formatCurrency(totalRuecknahme)} subtitle={`${pfandTransactions.filter(t => t.type === 'Rücknahme').length} Transaktionen`} icon={ArrowDownCircle} iconColor="#34C759" iconBg="rgba(52,199,89,0.1)" />
        </div>

        {/* Customer Saldo */}
        {customerList.length > 0 && (
          <div className="table-container" style={{ marginBottom: 24 }}>
            <div className="table-header">
              <h2 className="table-title">Offene Pfand-Salden nach Kunde</h2>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Kunde</th>
                  <th style={{ textAlign: 'right' }}>Ausgegeben</th>
                  <th style={{ textAlign: 'right' }}>Zurückgegeben</th>
                  <th style={{ textAlign: 'right' }}>Offen (Dosen)</th>
                  <th style={{ textAlign: 'right' }}>Offen (€)</th>
                </tr>
              </thead>
              <tbody>
                {customerList.map(c => (
                  <tr key={c.name}>
                    <td style={{ fontWeight: 500 }}>{c.name}</td>
                    <td style={{ textAlign: 'right' }}>{formatNumber(c.ausgabe)}</td>
                    <td style={{ textAlign: 'right' }}>{formatNumber(c.ruecknahme)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatNumber(c.offen)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: c.offen > 0 ? '#FF9500' : '#34C759' }}>{formatCurrency(c.offen * 0.25)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Transaction Log */}
        <div className="table-container">
          <div className="table-header">
            <h2 className="table-title">Pfand-Transaktionen</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['Alle', 'Ausgabe', 'Rücknahme'] as const).map(f => (
                <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '6px 14px', fontSize: 13 }}
                  onClick={() => setFilter(f)}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Datum</th>
                <th>Kunde</th>
                <th>Typ</th>
                <th>Bestellung</th>
                <th style={{ textAlign: 'right' }}>Dosen</th>
                <th style={{ textAlign: 'right' }}>Betrag</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(tx => (
                <tr key={tx.id}>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{formatDate(tx.createdAt)}</td>
                  <td style={{ fontWeight: 500 }}>{tx.customerName}</td>
                  <td>
                    <span className={`badge ${tx.type === 'Ausgabe' ? 'badge-warning' : 'badge-success'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{tx.orderNumber || '—'}</td>
                  <td style={{ textAlign: 'right' }}>{formatNumber(tx.quantity)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: tx.type === 'Ausgabe' ? '#FF9500' : '#34C759' }}>
                    {tx.type === 'Ausgabe' ? '-' : '+'}{formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Pfand Modal */}
      {showNewModal && (
        <div className="modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Pfand buchen</h2>
              <button className="modal-close" onClick={() => setShowNewModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-radio-group">
                {(['Rücknahme', 'Ausgabe'] as const).map(t => (
                  <label key={t} className="form-radio-label">
                    <input type="radio" name="pfandType" checked={formType === t} onChange={() => setFormType(t)} />
                    <span>{t === 'Rücknahme' ? '↓ Rücknahme (Kunde gibt zurück)' : '↑ Ausgabe (an Kunde)'}</span>
                  </label>
                ))}
              </div>
              <div className="form-group">
                <label className="form-label">Kunde *</label>
                <select className="form-select" value={formCustomerId} onChange={e => setFormCustomerId(e.target.value)}>
                  <option value="">Kunde auswählen…</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Anzahl Dosen *</label>
                <input type="number" className="form-input" placeholder="z.B. 96" value={formQty} onChange={e => setFormQty(e.target.value)} />
              </div>
              {(parseInt(formQty) || 0) > 0 && (
                <div className="form-summary">
                  <div className="form-summary-row">
                    <span style={{ color: 'var(--color-text-secondary)' }}>{parseInt(formQty)} Dosen × €0,25</span>
                    <span style={{ fontWeight: 600, color: formType === 'Rücknahme' ? '#34C759' : '#FF9500' }}>
                      {formType === 'Rücknahme' ? '+' : '-'}{formatCurrency((parseInt(formQty) || 0) * 0.25)}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowNewModal(false)}>Abbrechen</button>
              <button className="btn btn-primary" onClick={handleCreate}
                disabled={!formCustomerId || (parseInt(formQty) || 0) <= 0}
                style={{ opacity: !formCustomerId || (parseInt(formQty) || 0) <= 0 ? 0.5 : 1 }}>
                <Check size={16} /> {formType} buchen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
