'use client'

import { useState } from 'react'
import { RotateCcw, AlertTriangle, CheckCircle, Clock, Check, X, Plus } from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils'
import { useWawi } from '@/lib/wawi-context'
import type { Return } from '@/lib/types'

const statusColors: Record<string, string> = {
  'Offen': 'badge-warning',
  'In Bearbeitung': 'badge-blue',
  'Abgeschlossen': 'badge-success',
}

const reasonColors: Record<string, string> = {
  'Beschädigt': 'badge-danger',
  'MHD abgelaufen': 'badge-warning',
  'Fehllieferung': 'badge-purple',
  'Kundenwunsch': 'badge-blue',
  'Sonstiges': 'badge-default',
}

export default function RetourenPage() {
  const { returns, customers, addReturn } = useWawi()
  const [filter, setFilter] = useState<string>('Alle')
  const [selected, setSelected] = useState<Return | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [toast, setToast] = useState('')

  // Form
  const [formCustomer, setFormCustomer] = useState('')
  const [formReason, setFormReason] = useState<Return['reason']>('Beschädigt')
  const [formQty, setFormQty] = useState('')
  const [formResolution, setFormResolution] = useState<Return['resolution']>('Offen')
  const [formNotes, setFormNotes] = useState('')

  const openReturns = returns.filter(r => r.status === 'Offen')
  const inProgress = returns.filter(r => r.status === 'In Bearbeitung')
  const totalLoss = returns.filter(r => r.resolution === 'Gutschrift').reduce((s, r) => s + r.amount, 0)
  const totalQty = returns.reduce((s, r) => s + r.quantity, 0)

  const tabs = ['Alle', 'Offen', 'In Bearbeitung', 'Abgeschlossen']
  const filtered = filter === 'Alle' ? returns : returns.filter(r => r.status === filter)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleCreate = () => {
    const qty = parseInt(formQty) || 0
    if (qty <= 0 || !formCustomer) return
    const nextNum = returns.length + 6

    const ret: Omit<Return, 'id'> = {
      returnNumber: `RET-2026-${String(nextNum).padStart(3, '0')}`,
      customerName: formCustomer,
      reason: formReason,
      quantity: qty,
      resolution: formResolution,
      status: 'Offen',
      amount: formResolution === 'Gutschrift' ? qty * 2.31 : 0,
      createdAt: new Date().toISOString().split('T')[0],
      notes: formNotes || undefined,
    }
    addReturn(ret)
    setShowNewModal(false)
    setFormCustomer(''); setFormReason('Beschädigt'); setFormQty(''); setFormResolution('Offen'); setFormNotes('')
    showToast(`Retoure ${ret.returnNumber} erfasst`)
  }

  return (
    <>
      {toast && <div className="toast"><Check size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />{toast}</div>}

      <div className="app-header">
        <div className="header-left">
          <h1 className="header-title">Retouren</h1>
          <p className="header-subtitle">Rücksendungen & Reklamationen</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewModal(true)}>
          <Plus size={16} /> Neue Retoure
        </button>
      </div>

      <div className="page-content">
        <div className="stats-grid">
          <StatCard label="Offene Retouren" value={String(openReturns.length)} subtitle="Warten auf Bearbeitung" icon={AlertTriangle} iconColor="#FF9500" iconBg="rgba(255,149,0,0.1)" />
          <StatCard label="In Bearbeitung" value={String(inProgress.length)} subtitle="Werden bearbeitet" icon={Clock} iconColor="#007AFF" iconBg="rgba(0,122,255,0.1)" />
          <StatCard label="Retourenmenge" value={formatNumber(totalQty) + ' Dosen'} subtitle="Gesamtzeitraum" icon={RotateCcw} iconColor="#AF52DE" iconBg="rgba(175,82,222,0.1)" />
          <StatCard label="Gutschriften" value={formatCurrency(totalLoss)} subtitle="Erstattete Beträge" icon={CheckCircle} iconColor="#FF3B30" iconBg="rgba(255,59,48,0.1)" />
        </div>

        {/* Tabs */}
        <div className="table-container">
          <div className="table-header">
            <h2 className="table-title">Alle Retouren</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              {tabs.map(t => (
                <button key={t} className={`btn ${filter === t ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '6px 14px', fontSize: 13 }}
                  onClick={() => setFilter(t)}>
                  {t} {t !== 'Alle' && <span style={{ opacity: 0.6, marginLeft: 4 }}>({returns.filter(r => r.status === t).length})</span>}
                </button>
              ))}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Retoure-Nr.</th>
                <th>Kunde</th>
                <th>Grund</th>
                <th>Menge</th>
                <th>Lösung</th>
                <th>Betrag</th>
                <th>Status</th>
                <th>Erstellt</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(ret => (
                <tr key={ret.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(ret)}>
                  <td style={{ fontWeight: 500 }}>{ret.returnNumber}</td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{ret.customerName}</td>
                  <td><span className={`badge ${reasonColors[ret.reason]}`}>{ret.reason}</span></td>
                  <td>{formatNumber(ret.quantity)} Dosen</td>
                  <td>
                    <span style={{ fontSize: 13, color: ret.resolution === 'Offen' ? 'var(--color-text-tertiary)' : 'var(--color-text)' }}>
                      {ret.resolution}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{ret.amount > 0 ? formatCurrency(ret.amount) : '—'}</td>
                  <td><span className={`badge ${statusColors[ret.status]}`}>{ret.status}</span></td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{formatDate(ret.createdAt)}</td>
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
                <h2 className="modal-title">{selected.returnNumber}</h2>
                <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', marginTop: 4 }}>{selected.customerName}</p>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Status</p>
                  <span className={`badge ${statusColors[selected.status]}`}>{selected.status}</span>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Grund</p>
                  <span className={`badge ${reasonColors[selected.reason]}`}>{selected.reason}</span>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Menge</p>
                  <p style={{ fontWeight: 600 }}>{formatNumber(selected.quantity)} Dosen</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Lösung</p>
                  <p style={{ fontWeight: 600 }}>{selected.resolution}</p>
                </div>
                {selected.orderNumber && (
                  <div>
                    <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Originalbestellung</p>
                    <p style={{ fontWeight: 500 }}>{selected.orderNumber}</p>
                  </div>
                )}
                {selected.amount > 0 && (
                  <div>
                    <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Gutschriftbetrag</p>
                    <p style={{ fontWeight: 600, color: '#FF3B30' }}>{formatCurrency(selected.amount)}</p>
                  </div>
                )}
              </div>
              {selected.notes && (
                <div style={{ padding: 16, background: 'var(--color-bg-secondary)', borderRadius: 12, fontSize: 14, color: 'var(--color-text-secondary)' }}>
                  <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 6 }}>Anmerkungen</p>
                  {selected.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Return Modal */}
      {showNewModal && (
        <div className="modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Neue Retoure erfassen</h2>
              <button className="modal-close" onClick={() => setShowNewModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Kunde *</label>
                <select className="form-select" value={formCustomer} onChange={e => setFormCustomer(e.target.value)}>
                  <option value="">Kunde auswählen…</option>
                  {customers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Grund *</label>
                  <select className="form-select" value={formReason} onChange={e => setFormReason(e.target.value as Return['reason'])}>
                    <option value="Beschädigt">Beschädigt</option>
                    <option value="MHD abgelaufen">MHD abgelaufen</option>
                    <option value="Fehllieferung">Fehllieferung</option>
                    <option value="Kundenwunsch">Kundenwunsch</option>
                    <option value="Sonstiges">Sonstiges</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Menge (Dosen) *</label>
                  <input type="number" className="form-input" placeholder="z.B. 24" value={formQty} onChange={e => setFormQty(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Lösung</label>
                <div className="form-radio-group">
                  {(['Offen', 'Gutschrift', 'Ersatzlieferung'] as const).map(r => (
                    <label key={r} className="form-radio-label">
                      <input type="radio" name="resolution" checked={formResolution === r} onChange={() => setFormResolution(r)} />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Anmerkungen</label>
                <input type="text" className="form-input" placeholder="Optionale Anmerkungen zur Retoure" value={formNotes} onChange={e => setFormNotes(e.target.value)} />
              </div>
              {formResolution === 'Gutschrift' && (parseInt(formQty) || 0) > 0 && (
                <div className="form-summary">
                  <div className="form-summary-total">
                    <span>Gutschriftbetrag</span>
                    <span style={{ color: '#FF3B30' }}>{formatCurrency((parseInt(formQty) || 0) * 2.31)}</span>
                  </div>
                  <div className="form-summary-row">
                    <span style={{ color: 'var(--color-text-tertiary)', fontSize: 13 }}>{parseInt(formQty)} Dosen × Ø €2,31</span>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowNewModal(false)}>Abbrechen</button>
              <button className="btn btn-primary" onClick={handleCreate}
                disabled={!formCustomer || (parseInt(formQty) || 0) <= 0}
                style={{ opacity: !formCustomer || (parseInt(formQty) || 0) <= 0 ? 0.5 : 1 }}>
                <Check size={16} /> Retoure erfassen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
