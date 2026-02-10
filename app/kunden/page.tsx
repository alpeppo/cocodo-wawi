'use client'

import { useState } from 'react'
import { Users, TrendingUp, ShoppingCart, Plus, Mail, X, Check } from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import { CustomerBadge } from '@/components/CustomerBadge'
import { formatCurrency, formatDateShort } from '@/lib/utils'
import { useWawi } from '@/lib/wawi-context'
import type { Customer } from '@/lib/types'

const filterTypes = ['Alle', 'Kiosk', 'Supermarkt', 'Café', 'Großhandel'] as const

export default function KundenPage() {
  const { customers, addCustomer } = useWawi()
  const [filter, setFilter] = useState<string>('Alle')
  const [showNewModal, setShowNewModal] = useState(false)
  const [toast, setToast] = useState('')

  // Form state
  const [formName, setFormName] = useState('')
  const [formType, setFormType] = useState<Customer['type']>('Kiosk')
  const [formPerson, setFormPerson] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formStreet, setFormStreet] = useState('')
  const [formCity, setFormCity] = useState('')
  const [formPLZ, setFormPLZ] = useState('')
  const [formPricing, setFormPricing] = useState('1.85')
  const [formFrequency, setFormFrequency] = useState<Customer['frequency']>('Monatlich')

  const filtered = filter === 'Alle' ? customers : customers.filter(c => c.type === filter)
  const topCustomer = [...customers].sort((a, b) => b.totalRevenue - a.totalRevenue)[0]
  const avgOrderValue = customers.reduce((s, c) => s + c.totalRevenue, 0) / Math.max(customers.reduce((s, c) => s + c.totalOrders, 0), 1)

  const resetForm = () => {
    setFormName(''); setFormType('Kiosk'); setFormPerson(''); setFormEmail('')
    setFormPhone(''); setFormStreet(''); setFormCity(''); setFormPLZ('')
    setFormPricing('1.85'); setFormFrequency('Monatlich')
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleCreate = () => {
    if (!formName.trim() || !formPerson.trim()) return

    const newCustomer: Omit<Customer, 'id'> = {
      name: formName.trim(),
      type: formType,
      contact: { person: formPerson.trim(), email: formEmail.trim(), phone: formPhone.trim() },
      address: { street: formStreet.trim(), city: formCity.trim(), postalCode: formPLZ.trim() },
      pricing: parseFloat(formPricing) || 1.85,
      lastOrder: '—',
      totalOrders: 0,
      totalRevenue: 0,
      frequency: formFrequency,
    }

    addCustomer(newCustomer)
    setShowNewModal(false)
    resetForm()
    showToast(`Kunde "${formName}" angelegt`)
  }

  return (
    <>
      {toast && <div className="toast"><Check size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />{toast}</div>}

      <div className="app-header">
        <div className="header-left">
          <h1 className="header-title">B2B Kunden</h1>
          <p className="header-subtitle">{customers.length} aktive Geschäftskunden</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewModal(true)}>
          <Plus size={16} />
          Neuer Kunde
        </button>
      </div>

      <div className="page-content">
        <div className="stats-grid">
          <StatCard label="Kunden gesamt" value={String(customers.length)} change={{ value: '+2 diesen Monat', trend: 'up' }} icon={Users} iconColor="#AF52DE" iconBg="rgba(175,82,222,0.1)" />
          <StatCard label="Top Kunde" value={topCustomer?.name || '—'} subtitle={topCustomer ? formatCurrency(topCustomer.totalRevenue) + ' Gesamtumsatz' : ''} icon={TrendingUp} iconColor="#2D7D46" iconBg="rgba(45,125,70,0.1)" />
          <StatCard label="Ø Auftragswert" value={formatCurrency(avgOrderValue)} change={{ value: '+12% vs. Vormonat', trend: 'up' }} icon={ShoppingCart} iconColor="#007AFF" iconBg="rgba(0,122,255,0.1)" />
        </div>

        <div style={{ marginBottom: 24 }}>
          <div className="tabs" style={{ display: 'inline-flex' }}>
            {filterTypes.map((type) => {
              const count = type === 'Alle' ? customers.length : customers.filter(c => c.type === type).length
              return (
                <button key={type} className={`tab ${filter === type ? 'active' : ''}`} onClick={() => setFilter(type)}>
                  {type}
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
                <th>Kunde</th>
                <th>Typ</th>
                <th>Ansprechpartner</th>
                <th>Stadt</th>
                <th>Frequenz</th>
                <th>Letzte Bestellung</th>
                <th style={{ textAlign: 'right' }}>Preis/Dose</th>
                <th style={{ textAlign: 'right' }}>Gesamtumsatz</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.id}>
                  <td style={{ fontWeight: 500 }}>{customer.name}</td>
                  <td><CustomerBadge type={customer.type} /></td>
                  <td>
                    <div>
                      <p style={{ fontSize: 14 }}>{customer.contact.person}</p>
                      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                          <Mail size={11} /> {customer.contact.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{customer.address.city}</td>
                  <td>
                    <span className={
                      customer.frequency === 'Wöchentlich' ? 'badge badge-success' :
                      customer.frequency === '2x Monat' ? 'badge badge-blue' :
                      'badge badge-default'
                    }>
                      {customer.frequency}
                    </span>
                  </td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{customer.lastOrder !== '—' ? formatDateShort(customer.lastOrder) : '—'}</td>
                  <td style={{ textAlign: 'right', fontWeight: 500 }}>{formatCurrency(customer.pricing)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(customer.totalRevenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Customer Modal */}
      {showNewModal && (
        <div className="modal-overlay" onClick={() => { setShowNewModal(false); resetForm() }}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Neuer Kunde</h2>
              <button className="modal-close" onClick={() => { setShowNewModal(false); resetForm() }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Firmenname *</label>
                  <input type="text" className="form-input" placeholder="z.B. Kiosk Am Park" value={formName} onChange={(e) => setFormName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Kundentyp</label>
                  <select className="form-select" value={formType} onChange={(e) => setFormType(e.target.value as Customer['type'])}>
                    <option value="Kiosk">Kiosk</option>
                    <option value="Supermarkt">Supermarkt</option>
                    <option value="Café">Café</option>
                    <option value="Großhandel">Großhandel</option>
                  </select>
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Ansprechpartner *</label>
                  <input type="text" className="form-input" placeholder="Max Mustermann" value={formPerson} onChange={(e) => setFormPerson(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">E-Mail</label>
                  <input type="email" className="form-input" placeholder="email@firma.de" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefon</label>
                  <input type="tel" className="form-input" placeholder="+49 ..." value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Straße</label>
                  <input type="text" className="form-input" placeholder="Musterstr. 1" value={formStreet} onChange={(e) => setFormStreet(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Stadt</label>
                  <input type="text" className="form-input" placeholder="Berlin" value={formCity} onChange={(e) => setFormCity(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">PLZ</label>
                  <input type="text" className="form-input" placeholder="10115" value={formPLZ} onChange={(e) => setFormPLZ(e.target.value)} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Preis pro Dose (€)</label>
                  <input type="number" className="form-input" step="0.01" min="0.50" value={formPricing} onChange={(e) => setFormPricing(e.target.value)} />
                  <p className="form-hint">B2B-Basispreis: €1,80 — Individuell verhandelbar</p>
                </div>
                <div className="form-group">
                  <label className="form-label">Bestellfrequenz</label>
                  <select className="form-select" value={formFrequency} onChange={(e) => setFormFrequency(e.target.value as Customer['frequency'])}>
                    <option value="Wöchentlich">Wöchentlich</option>
                    <option value="2x Monat">2x Monat</option>
                    <option value="Monatlich">Monatlich</option>
                    <option value="Unregelmäßig">Unregelmäßig</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => { setShowNewModal(false); resetForm() }}>Abbrechen</button>
              <button
                className="btn btn-primary"
                onClick={handleCreate}
                disabled={!formName.trim() || !formPerson.trim()}
                style={{ opacity: !formName.trim() || !formPerson.trim() ? 0.5 : 1 }}
              >
                <Check size={16} />
                Kunde anlegen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
