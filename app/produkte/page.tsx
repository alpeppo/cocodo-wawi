'use client'

import { useState } from 'react'
import { Box, Droplets, MapPin, Package, Plus, X, Check } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { useWawi } from '@/lib/wawi-context'
import { StockIndicator } from '@/components/StockIndicator'
import type { Product } from '@/lib/types'

export default function ProduktePage() {
  const { products, stockBatches, stockCapacity, addProduct } = useWawi()
  const totalStock = stockBatches.reduce((sum, b) => sum + b.quantity, 0)
  const [showNewModal, setShowNewModal] = useState(false)
  const [toast, setToast] = useState('')

  // Form state
  const [formName, setFormName] = useState('')
  const [formSKU, setFormSKU] = useState('')
  const [formSize, setFormSize] = useState('')
  const [formPfand, setFormPfand] = useState('0.25')
  const [formB2BPrice, setFormB2BPrice] = useState('')
  const [formOrigin, setFormOrigin] = useState('')
  const [formDescription, setFormDescription] = useState('')

  const resetForm = () => {
    setFormName(''); setFormSKU(''); setFormSize(''); setFormPfand('0.25')
    setFormB2BPrice(''); setFormOrigin(''); setFormDescription('')
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleCreate = () => {
    if (!formName.trim() || !formSKU.trim()) return

    const newProduct: Omit<Product, 'id'> = {
      name: formName.trim(),
      sku: formSKU.trim(),
      size: formSize.trim() || '250ml',
      pfand: parseFloat(formPfand) || 0.25,
      b2cPricing: [],
      b2bBasePrice: parseFloat(formB2BPrice) || 1.80,
      origin: formOrigin.trim(),
      description: formDescription.trim(),
    }

    addProduct(newProduct)
    setShowNewModal(false)
    resetForm()
    showToast(`Produkt "${formName}" hinzugefügt`)
  }

  return (
    <>
      {toast && <div className="toast"><Check size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />{toast}</div>}

      <div className="app-header">
        <div className="header-left">
          <h1 className="header-title">Produkte</h1>
          <p className="header-subtitle">Produktkatalog & Preisübersicht</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewModal(true)}>
          <Plus size={16} />
          Neues Produkt
        </button>
      </div>

      <div className="page-content">
        {products.map((product) => (
          <div key={product.id} style={{ marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
              {/* Product Card */}
              <div className="card">
                <div className="card-body">
                  <div style={{ display: 'flex', gap: 32 }}>
                    <div style={{
                      width: 200, height: 280, borderRadius: 20,
                      background: 'linear-gradient(135deg, #2D7D46 0%, #4CAF50 50%, #81C784 100%)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      color: 'white', flexShrink: 0,
                    }}>
                      <Droplets size={48} style={{ marginBottom: 12 }} />
                      <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>{product.name.split(' ')[0]}</span>
                      <span style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{product.size}</span>
                    </div>

                    <div style={{ flex: 1 }}>
                      <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5, marginBottom: 8 }}>
                        {product.name}
                      </h2>
                      <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
                        {product.description}
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                        <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 14, padding: 16 }}>
                          <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>SKU</p>
                          <p style={{ fontWeight: 600 }}>{product.sku}</p>
                        </div>
                        <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 14, padding: 16 }}>
                          <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Größe</p>
                          <p style={{ fontWeight: 600 }}>{product.size}</p>
                        </div>
                        <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 14, padding: 16 }}>
                          <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Pfand</p>
                          <p style={{ fontWeight: 600 }}>{formatCurrency(product.pfand)} / Dose</p>
                        </div>
                        <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 14, padding: 16 }}>
                          <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Herkunft</p>
                          <p style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <MapPin size={14} /> {product.origin || 'Nicht angegeben'}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                        <Package size={14} />
                        <span>Lagerbestand: <strong style={{ color: 'var(--color-text)' }}>{formatNumber(totalStock)} Dosen</strong></span>
                        <Link href="/lager" style={{ color: '#2D7D46', fontWeight: 500, textDecoration: 'none' }}>
                          → Zum Lager
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {product.b2cPricing.length > 0 && (
                  <div className="card">
                    <div className="card-header">
                      <h2 className="card-title">B2C Staffelpreise</h2>
                      <span className="badge badge-default">Endkunden</span>
                    </div>
                    <div style={{ padding: 16 }}>
                      {product.b2cPricing.map((tier) => (
                        <div key={tier.quantity} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '14px 12px', borderBottom: '1px solid var(--color-border)',
                        }}>
                          <div>
                            <p style={{ fontWeight: 500 }}>{tier.quantity}er Pack</p>
                            <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                              {formatCurrency(tier.pricePerCan)} / Dose
                            </p>
                          </div>
                          <span style={{ fontSize: 18, fontWeight: 700, color: '#2D7D46' }}>
                            {formatCurrency(tier.price)}
                          </span>
                        </div>
                      ))}
                      <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', padding: '12px 12px 4px', fontStyle: 'italic' }}>
                        zzgl. {formatCurrency(product.pfand)} Pfand pro Dose
                      </p>
                    </div>
                  </div>
                )}

                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">B2B Basispreis</h2>
                    <span className="badge badge-primary">Geschäftskunden</span>
                  </div>
                  <div className="card-body" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 40, fontWeight: 700, color: '#2D7D46', letterSpacing: -1 }}>
                      {formatCurrency(product.b2bBasePrice)}
                    </p>
                    <p style={{ fontSize: 14, color: 'var(--color-text-tertiary)', marginTop: 4 }}>pro Dose (Basispreis)</p>
                    <div style={{
                      marginTop: 16, padding: 16, borderRadius: 14,
                      background: 'rgba(45,125,70,0.06)', border: '1px solid rgba(45,125,70,0.12)',
                    }}>
                      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                        Individuelle Preise pro Kunde möglich.
                      </p>
                      <Link href="/kunden" style={{ fontSize: 13, fontWeight: 500, color: '#2D7D46', textDecoration: 'none' }}>
                        Kundenpreise einsehen →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Product Modal */}
      {showNewModal && (
        <div className="modal-overlay" onClick={() => { setShowNewModal(false); resetForm() }}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Neues Produkt</h2>
              <button className="modal-close" onClick={() => { setShowNewModal(false); resetForm() }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Produktname *</label>
                  <input type="text" className="form-input" placeholder="z.B. Cocodo Mango Mix" value={formName} onChange={(e) => setFormName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">SKU *</label>
                  <input type="text" className="form-input" placeholder="z.B. COC-330-001" value={formSKU} onChange={(e) => setFormSKU(e.target.value)} />
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Größe</label>
                  <input type="text" className="form-input" placeholder="z.B. 330ml" value={formSize} onChange={(e) => setFormSize(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Pfand (€)</label>
                  <input type="number" className="form-input" step="0.01" value={formPfand} onChange={(e) => setFormPfand(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">B2B Basispreis (€)</label>
                  <input type="number" className="form-input" step="0.01" placeholder="1.80" value={formB2BPrice} onChange={(e) => setFormB2BPrice(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Herkunft</label>
                <input type="text" className="form-input" placeholder="z.B. Mekong Delta, Vietnam" value={formOrigin} onChange={(e) => setFormOrigin(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Beschreibung</label>
                <textarea className="form-textarea" placeholder="Produktbeschreibung..." value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => { setShowNewModal(false); resetForm() }}>Abbrechen</button>
              <button
                className="btn btn-primary"
                onClick={handleCreate}
                disabled={!formName.trim() || !formSKU.trim()}
                style={{ opacity: !formName.trim() || !formSKU.trim() ? 0.5 : 1 }}
              >
                <Check size={16} />
                Produkt hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
