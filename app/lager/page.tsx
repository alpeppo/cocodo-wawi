'use client'

import { useState } from 'react'
import { Package, BoxIcon, AlertTriangle, Plus, X, Check } from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import { StockIndicator } from '@/components/StockIndicator'
import { StatusBadge } from '@/components/StatusBadge'
import { MHDWarning } from '@/components/MHDWarning'
import { formatNumber, formatDate, getDaysUntil } from '@/lib/utils'
import { useWawi } from '@/lib/wawi-context'
import type { StockBatch, StockMovement } from '@/lib/types'

export default function LagerPage() {
  const { stockBatches, stockMovements, stockCapacity, addStockEntry } = useWawi()
  const totalStock = stockBatches.reduce((sum, b) => sum + b.quantity, 0)
  const availableStock = totalStock - 800
  const reorderPoint = 2000

  const [showNewModal, setShowNewModal] = useState(false)
  const [toast, setToast] = useState('')

  // Form state
  const [formBatchNumber, setFormBatchNumber] = useState('')
  const [formQuantity, setFormQuantity] = useState('')
  const [formLocation, setFormLocation] = useState('')
  const [formMHD, setFormMHD] = useState('')
  const [formOrigin, setFormOrigin] = useState('Mekong Delta, Vietnam')
  const [formReason, setFormReason] = useState('Container-Lieferung aus Vietnam')

  const resetForm = () => {
    setFormBatchNumber(''); setFormQuantity(''); setFormLocation('')
    setFormMHD(''); setFormOrigin('Mekong Delta, Vietnam'); setFormReason('Container-Lieferung aus Vietnam')
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleCreate = () => {
    const qty = parseInt(formQuantity) || 0
    if (!formBatchNumber.trim() || qty <= 0 || !formMHD) return

    const today = new Date().toISOString().split('T')[0]

    const newBatch: Omit<StockBatch, 'id'> = {
      batchNumber: formBatchNumber.trim(),
      quantity: qty,
      location: formLocation.trim() || 'Lager A1',
      mhd: formMHD,
      receivedAt: today,
      origin: formOrigin.trim(),
      status: 'Aktiv',
    }

    const newMovement: Omit<StockMovement, 'id'> = {
      type: 'Wareneingang',
      quantity: qty,
      batchNumber: formBatchNumber.trim(),
      reason: formReason.trim(),
      createdAt: today,
    }

    addStockEntry(newBatch, newMovement)
    setShowNewModal(false)
    resetForm()
    showToast(`Wareneingang: ${formatNumber(qty)} Dosen (${formBatchNumber})`)
  }

  return (
    <>
      {toast && <div className="toast"><Check size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />{toast}</div>}

      <div className="app-header">
        <div className="header-left">
          <h1 className="header-title">Lager</h1>
          <p className="header-subtitle">Bestandsübersicht & Chargen-Tracking</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewModal(true)}>
          <Package size={16} />
          Wareneingang buchen
        </button>
      </div>

      <div className="page-content">
        <div className="stats-grid">
          <StatCard
            label="Gesamtbestand"
            value={formatNumber(totalStock) + ' Dosen'}
            subtitle={`${((totalStock / stockCapacity) * 100).toFixed(0)}% Kapazität`}
            icon={Package}
            iconColor="#2D7D46"
            iconBg="rgba(45,125,70,0.1)"
          />
          <StatCard
            label="Verfügbar"
            value={formatNumber(availableStock) + ' Dosen'}
            subtitle="Abzgl. reservierter Bestellungen"
            icon={BoxIcon}
            iconColor="#007AFF"
            iconBg="rgba(0,122,255,0.1)"
          />
          <StatCard
            label="Reorder Point"
            value={formatNumber(reorderPoint) + ' Dosen'}
            subtitle={totalStock > reorderPoint ? '✓ Bestand ausreichend' : '⚠ Nachbestellen!'}
            icon={AlertTriangle}
            iconColor={totalStock > reorderPoint ? '#34C759' : '#FF9500'}
            iconBg={totalStock > reorderPoint ? 'rgba(52,199,89,0.1)' : 'rgba(255,149,0,0.1)'}
          />
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <h2 className="card-title">Lagerauslastung</h2>
          </div>
          <div className="card-body">
            <StockIndicator current={totalStock} capacity={stockCapacity} label="Gesamtkapazität" height={20} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          <div className="table-container">
            <div className="table-header">
              <h2 className="table-title">Chargen & MHD</h2>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Charge</th>
                  <th>Menge</th>
                  <th>Standort</th>
                  <th>MHD</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stockBatches.map((batch) => {
                  const days = getDaysUntil(batch.mhd)
                  return (
                    <tr key={batch.id}>
                      <td style={{ fontWeight: 500 }}>{batch.batchNumber}</td>
                      <td>{formatNumber(batch.quantity)}</td>
                      <td style={{ color: 'var(--color-text-secondary)' }}>{batch.location}</td>
                      <td>
                        <span style={{ color: days < 30 ? '#FF3B30' : days < 60 ? '#FF9500' : 'var(--color-text)' }}>
                          {formatDate(batch.mhd)}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginLeft: 6 }}>
                          ({days} Tage)
                        </span>
                      </td>
                      <td><StatusBadge status={batch.status} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">MHD-Warnungen</h2>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stockBatches
                .filter(b => getDaysUntil(b.mhd) < 60)
                .map((batch) => (
                  <MHDWarning key={batch.id} mhd={batch.mhd} quantity={batch.quantity} batchNumber={batch.batchNumber} />
                ))}
              {stockBatches.filter(b => getDaysUntil(b.mhd) < 60).length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-tertiary)' }}>
                  <p style={{ fontWeight: 500 }}>Keine MHD-Warnungen</p>
                  <p style={{ fontSize: 13, marginTop: 4 }}>Alle Chargen haben ausreichend Restlaufzeit.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="table-container">
          <div className="table-header">
            <h2 className="table-title">Lagerbewegungen</h2>
            <span style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>Letzte 30 Tage</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Datum</th>
                <th>Typ</th>
                <th>Menge</th>
                <th>Charge</th>
                <th>Grund</th>
              </tr>
            </thead>
            <tbody>
              {stockMovements.map((movement) => (
                <tr key={movement.id}>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{formatDate(movement.createdAt)}</td>
                  <td>
                    <span className={
                      movement.type === 'Wareneingang' ? 'badge badge-success' :
                      movement.type === 'Warenausgang' ? 'badge badge-blue' :
                      'badge badge-warning'
                    }>
                      {movement.type}
                    </span>
                  </td>
                  <td style={{
                    fontWeight: 600,
                    color: movement.type === 'Wareneingang' ? '#34C759' :
                           movement.quantity < 0 ? '#FF3B30' : 'var(--color-text)',
                  }}>
                    {movement.type === 'Wareneingang' ? '+' : '-'}{formatNumber(Math.abs(movement.quantity))}
                  </td>
                  <td style={{ fontWeight: 500 }}>{movement.batchNumber}</td>
                  <td style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>{movement.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Wareneingang Modal */}
      {showNewModal && (
        <div className="modal-overlay" onClick={() => { setShowNewModal(false); resetForm() }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Wareneingang buchen</h2>
              <button className="modal-close" onClick={() => { setShowNewModal(false); resetForm() }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Chargennummer *</label>
                  <input type="text" className="form-input" placeholder="z.B. VN-2026-01" value={formBatchNumber} onChange={(e) => setFormBatchNumber(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Menge (Dosen) *</label>
                  <input type="number" className="form-input" placeholder="z.B. 3000" value={formQuantity} onChange={(e) => setFormQuantity(e.target.value)} min="1" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Lagerort</label>
                  <input type="text" className="form-input" placeholder="z.B. Lager A1-B3" value={formLocation} onChange={(e) => setFormLocation(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">MHD *</label>
                  <input type="date" className="form-input" value={formMHD} onChange={(e) => setFormMHD(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Herkunft</label>
                <input type="text" className="form-input" value={formOrigin} onChange={(e) => setFormOrigin(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Grund / Lieferreferenz</label>
                <input type="text" className="form-input" value={formReason} onChange={(e) => setFormReason(e.target.value)} />
              </div>

              {(parseInt(formQuantity) || 0) > 0 && (
                <div className="form-summary">
                  <div className="form-summary-row">
                    <span style={{ color: 'var(--color-text-secondary)' }}>Neuer Bestand nach Eingang:</span>
                    <span style={{ fontWeight: 600, color: '#34C759' }}>
                      {formatNumber(totalStock + (parseInt(formQuantity) || 0))} Dosen
                    </span>
                  </div>
                  <div className="form-summary-row">
                    <span style={{ color: 'var(--color-text-secondary)' }}>Auslastung:</span>
                    <span style={{ fontWeight: 600 }}>
                      {(((totalStock + (parseInt(formQuantity) || 0)) / stockCapacity) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => { setShowNewModal(false); resetForm() }}>Abbrechen</button>
              <button
                className="btn btn-primary"
                onClick={handleCreate}
                disabled={!formBatchNumber.trim() || (parseInt(formQuantity) || 0) <= 0 || !formMHD}
                style={{ opacity: !formBatchNumber.trim() || (parseInt(formQuantity) || 0) <= 0 || !formMHD ? 0.5 : 1 }}
              >
                <Check size={16} />
                Wareneingang buchen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
