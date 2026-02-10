'use client'

import { useState } from 'react'
import { ClipboardCheck, AlertTriangle, CheckCircle, BarChart3, Check, X, Plus } from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import { formatNumber, formatDate } from '@/lib/utils'
import { useWawi } from '@/lib/wawi-context'
import type { InventoryCount } from '@/lib/types'

const statusColors: Record<string, string> = {
  'Geplant': 'badge-default',
  'Gezählt': 'badge-blue',
  'Korrigiert': 'badge-success',
}

export default function InventurPage() {
  const { inventoryCounts, stockBatches, addInventoryCount } = useWawi()
  const [selected, setSelected] = useState<InventoryCount | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [toast, setToast] = useState('')

  // Form
  const [formBatch, setFormBatch] = useState('')
  const [formCounted, setFormCounted] = useState('')
  const [formBy, setFormBy] = useState('')
  const [formNotes, setFormNotes] = useState('')

  const geplant = inventoryCounts.filter(c => c.status === 'Geplant').length
  const gezaehlt = inventoryCounts.filter(c => c.status === 'Gezählt' || c.status === 'Korrigiert').length
  const totalDifference = inventoryCounts.reduce((s, c) => s + Math.abs(c.difference), 0)
  const accuracy = inventoryCounts.length > 0
    ? ((1 - inventoryCounts.reduce((s, c) => s + Math.abs(c.difference), 0) / inventoryCounts.reduce((s, c) => s + c.systemQuantity, 0)) * 100).toFixed(1)
    : '100.0'

  const selectedBatch = stockBatches.find(b => b.batchNumber === formBatch)
  const countedQty = parseInt(formCounted) || 0
  const diff = selectedBatch ? countedQty - selectedBatch.quantity : 0

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleCreate = () => {
    if (!selectedBatch || countedQty <= 0) return

    const count: Omit<InventoryCount, 'id'> = {
      batchNumber: selectedBatch.batchNumber,
      location: selectedBatch.location,
      systemQuantity: selectedBatch.quantity,
      countedQuantity: countedQty,
      difference: diff,
      status: 'Gezählt',
      countedAt: new Date().toISOString().split('T')[0],
      countedBy: formBy || 'Admin',
      notes: formNotes || undefined,
    }
    addInventoryCount(count)
    setShowNewModal(false)
    setFormBatch(''); setFormCounted(''); setFormBy(''); setFormNotes('')
    showToast(`Inventur für ${selectedBatch.batchNumber} erfasst (Differenz: ${diff >= 0 ? '+' : ''}${diff})`)
  }

  return (
    <>
      {toast && <div className="toast"><Check size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />{toast}</div>}

      <div className="app-header">
        <div className="header-left">
          <h1 className="header-title">Inventur</h1>
          <p className="header-subtitle">Bestandszählung & Korrekturen</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewModal(true)}>
          <Plus size={16} /> Neue Zählung
        </button>
      </div>

      <div className="page-content">
        <div className="stats-grid">
          <StatCard label="Bestandsgenauigkeit" value={accuracy + '%'} subtitle="Systembestand vs. Zählung" icon={BarChart3} iconColor="#2D7D46" iconBg="rgba(45,125,70,0.1)" />
          <StatCard label="Gezählt" value={String(gezaehlt)} subtitle="Abgeschlossene Zählungen" icon={CheckCircle} iconColor="#34C759" iconBg="rgba(52,199,89,0.1)" />
          <StatCard label="Geplant" value={String(geplant)} subtitle="Ausstehende Zählungen" icon={ClipboardCheck} iconColor="#007AFF" iconBg="rgba(0,122,255,0.1)" />
          <StatCard label="Gesamtabweichung" value={formatNumber(totalDifference) + ' Dosen'} subtitle="Absolut" icon={AlertTriangle} iconColor="#FF9500" iconBg="rgba(255,149,0,0.1)" />
        </div>

        {/* Inventory counts table */}
        <div className="table-container">
          <div className="table-header">
            <h2 className="table-title">Inventurzählungen</h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>Charge</th>
                <th>Standort</th>
                <th style={{ textAlign: 'right' }}>System</th>
                <th style={{ textAlign: 'right' }}>Gezählt</th>
                <th style={{ textAlign: 'right' }}>Differenz</th>
                <th>Status</th>
                <th>Gezählt am</th>
                <th>Gezählt von</th>
              </tr>
            </thead>
            <tbody>
              {inventoryCounts.map(count => (
                <tr key={count.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(count)}>
                  <td style={{ fontWeight: 500, fontFamily: 'monospace' }}>{count.batchNumber}</td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{count.location}</td>
                  <td style={{ textAlign: 'right' }}>{formatNumber(count.systemQuantity)}</td>
                  <td style={{ textAlign: 'right' }}>{formatNumber(count.countedQuantity)}</td>
                  <td style={{
                    textAlign: 'right', fontWeight: 600,
                    color: count.difference === 0 ? '#34C759' : count.difference < 0 ? '#FF3B30' : '#FF9500',
                  }}>
                    {count.difference >= 0 ? '+' : ''}{formatNumber(count.difference)}
                  </td>
                  <td><span className={`badge ${statusColors[count.status]}`}>{count.status}</span></td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{count.countedAt ? formatDate(count.countedAt) : '—'}</td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{count.countedBy || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Current stock for reference */}
        <div className="table-container" style={{ marginTop: 24 }}>
          <div className="table-header">
            <h2 className="table-title">Aktuelle Chargen (Referenz)</h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>Charge</th>
                <th>Standort</th>
                <th style={{ textAlign: 'right' }}>Bestand (System)</th>
                <th>MHD</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stockBatches.map(batch => (
                <tr key={batch.id}>
                  <td style={{ fontWeight: 500, fontFamily: 'monospace' }}>{batch.batchNumber}</td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{batch.location}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatNumber(batch.quantity)}</td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{formatDate(batch.mhd)}</td>
                  <td><span className={`badge ${batch.status === 'Aktiv' ? 'badge-success' : batch.status === 'Niedrig' ? 'badge-warning' : 'badge-danger'}`}>{batch.status}</span></td>
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
                <h2 className="modal-title">Inventur {selected.batchNumber}</h2>
                <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', marginTop: 4 }}>{selected.location}</p>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div style={{ textAlign: 'center', padding: 16, background: 'var(--color-bg-secondary)', borderRadius: 12 }}>
                  <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>System</p>
                  <p style={{ fontSize: 24, fontWeight: 700 }}>{formatNumber(selected.systemQuantity)}</p>
                </div>
                <div style={{ textAlign: 'center', padding: 16, background: 'var(--color-bg-secondary)', borderRadius: 12 }}>
                  <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Gezählt</p>
                  <p style={{ fontSize: 24, fontWeight: 700 }}>{formatNumber(selected.countedQuantity)}</p>
                </div>
                <div style={{
                  textAlign: 'center', padding: 16, borderRadius: 12,
                  background: selected.difference === 0 ? 'rgba(52,199,89,0.1)' : 'rgba(255,59,48,0.1)',
                }}>
                  <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Differenz</p>
                  <p style={{
                    fontSize: 24, fontWeight: 700,
                    color: selected.difference === 0 ? '#34C759' : '#FF3B30',
                  }}>
                    {selected.difference >= 0 ? '+' : ''}{formatNumber(selected.difference)}
                  </p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Status</p>
                  <span className={`badge ${statusColors[selected.status]}`}>{selected.status}</span>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Gezählt von</p>
                  <p style={{ fontWeight: 500 }}>{selected.countedBy || '—'}</p>
                </div>
              </div>
              {selected.notes && (
                <div style={{ marginTop: 16, padding: 16, background: 'var(--color-bg-secondary)', borderRadius: 12, fontSize: 14, color: 'var(--color-text-secondary)' }}>
                  <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 6 }}>Anmerkungen</p>
                  {selected.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Count Modal */}
      {showNewModal && (
        <div className="modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Neue Inventurzählung</h2>
              <button className="modal-close" onClick={() => setShowNewModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Charge *</label>
                <select className="form-select" value={formBatch} onChange={e => setFormBatch(e.target.value)}>
                  <option value="">Charge auswählen…</option>
                  {stockBatches.map(b => (
                    <option key={b.id} value={b.batchNumber}>
                      {b.batchNumber} — {b.location} ({formatNumber(b.quantity)} Dosen)
                    </option>
                  ))}
                </select>
              </div>
              {selectedBatch && (
                <div style={{ padding: '12px 16px', background: 'rgba(45,125,70,0.06)', borderRadius: 12, marginBottom: 16, fontSize: 14 }}>
                  <strong>Standort:</strong> {selectedBatch.location} · <strong>Systembestand:</strong> {formatNumber(selectedBatch.quantity)} Dosen
                </div>
              )}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Gezählte Menge *</label>
                  <input type="number" className="form-input" placeholder="Tatsächliche Menge" value={formCounted} onChange={e => setFormCounted(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Gezählt von</label>
                  <input type="text" className="form-input" placeholder="Name" value={formBy} onChange={e => setFormBy(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Anmerkungen</label>
                <input type="text" className="form-input" placeholder="Optionale Anmerkungen" value={formNotes} onChange={e => setFormNotes(e.target.value)} />
              </div>
              {selectedBatch && countedQty > 0 && (
                <div className="form-summary">
                  <div className="form-summary-row">
                    <span style={{ color: 'var(--color-text-secondary)' }}>Systembestand</span>
                    <span>{formatNumber(selectedBatch.quantity)}</span>
                  </div>
                  <div className="form-summary-row">
                    <span style={{ color: 'var(--color-text-secondary)' }}>Gezählt</span>
                    <span>{formatNumber(countedQty)}</span>
                  </div>
                  <div className="form-summary-total">
                    <span>Differenz</span>
                    <span style={{ color: diff === 0 ? '#34C759' : '#FF3B30' }}>
                      {diff >= 0 ? '+' : ''}{formatNumber(diff)} Dosen
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowNewModal(false)}>Abbrechen</button>
              <button className="btn btn-primary" onClick={handleCreate}
                disabled={!selectedBatch || countedQty <= 0}
                style={{ opacity: !selectedBatch || countedQty <= 0 ? 0.5 : 1 }}>
                <Check size={16} /> Zählung speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
