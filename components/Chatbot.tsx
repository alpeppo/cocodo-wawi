'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Sparkles, ChevronRight } from 'lucide-react'
import {
  totalStock, stockCapacity, openOrders, customers, orders,
  revenueData, currentMonthRevenue, revenueGrowth, stockBatches, product,
} from '@/lib/mock-data'
import { formatCurrency, formatNumber, getDaysUntil } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const suggestedQuestions = [
  'Wie ist der aktuelle Lagerbestand?',
  'Welche Bestellungen sind offen?',
  'Wer sind unsere Top-Kunden?',
  'Wie entwickelt sich der Umsatz?',
  'Gibt es MHD-Warnungen?',
  'Was kostet eine Dose im B2B?',
]

function generateResponse(input: string): string {
  const q = input.toLowerCase()

  // Lager / Bestand
  if (q.includes('lager') || q.includes('bestand') || q.includes('dosen') || q.includes('vorrat') || q.includes('kapazität')) {
    const pct = ((totalStock / stockCapacity) * 100).toFixed(0)
    const kritisch = stockBatches.filter(b => b.status === 'Kritisch')
    let resp = `Aktueller Lagerbestand: **${formatNumber(totalStock)} Dosen** (${pct}% von ${formatNumber(stockCapacity)} Kapazität).\n\n`
    resp += `Aufgeteilt auf ${stockBatches.length} Chargen:\n`
    stockBatches.forEach(b => {
      resp += `- **${b.batchNumber}**: ${formatNumber(b.quantity)} Dosen (${b.location}, MHD: ${getDaysUntil(b.mhd)} Tage)\n`
    })
    if (kritisch.length > 0) {
      resp += `\n⚠️ **Achtung:** Charge ${kritisch[0].batchNumber} hat nur noch ${getDaysUntil(kritisch[0].mhd)} Tage bis zum MHD. Priorisierter Abverkauf empfohlen.`
    }
    return resp
  }

  // MHD
  if (q.includes('mhd') || q.includes('haltbar') || q.includes('ablauf') || q.includes('warnung')) {
    const sorted = [...stockBatches].sort((a, b) => getDaysUntil(a.mhd) - getDaysUntil(b.mhd))
    let resp = `**MHD-Übersicht:**\n\n`
    sorted.forEach(b => {
      const days = getDaysUntil(b.mhd)
      const status = days < 30 ? '🔴' : days < 60 ? '🟡' : '🟢'
      resp += `${status} **${b.batchNumber}**: ${formatNumber(b.quantity)} Dosen — MHD in ${days} Tagen\n`
    })
    const kritisch = sorted.filter(b => getDaysUntil(b.mhd) < 60)
    if (kritisch.length > 0) {
      resp += `\n**Empfehlung:** ${formatNumber(kritisch.reduce((s, b) => s + b.quantity, 0))} Dosen sollten priorisiert verkauft werden. Sonderaktion für B2B-Kunden oder ein Bundle-Angebot im Onlineshop wäre sinnvoll.`
    }
    return resp
  }

  // Bestellungen / offen
  if (q.includes('bestell') || q.includes('offen') || q.includes('auftrag') || q.includes('order')) {
    const offen = orders.filter(o => o.status === 'Neu' || o.status === 'In Bearbeitung')
    const versendet = orders.filter(o => o.status === 'Versendet')
    const heute = orders.filter(o => o.createdAt === '2026-02-08')
    let resp = `**Bestellübersicht:**\n\n`
    resp += `- **${openOrders} offene** Bestellungen (Neu + In Bearbeitung)\n`
    resp += `- **${versendet.length}** in Zustellung\n`
    resp += `- **${heute.length}** heute eingegangen\n\n`
    if (offen.length > 0) {
      resp += `Offene Aufträge:\n`
      offen.forEach(o => {
        resp += `- **${o.orderNumber}** — ${o.customerName} (${formatNumber(o.quantity)} Dosen, ${formatCurrency(o.total)})\n`
      })
    }
    return resp
  }

  // Kunden / Top
  if (q.includes('kunde') || q.includes('top') || q.includes('b2b') || q.includes('partner')) {
    const top5 = [...customers].sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 5)
    const typen = {
      Kiosk: customers.filter(c => c.type === 'Kiosk').length,
      Supermarkt: customers.filter(c => c.type === 'Supermarkt').length,
      Café: customers.filter(c => c.type === 'Café').length,
      Großhandel: customers.filter(c => c.type === 'Großhandel').length,
    }
    let resp = `**${customers.length} aktive B2B-Kunden:**\n\n`
    resp += `${typen.Kiosk} Kiosks, ${typen.Supermarkt} Supermärkte, ${typen.Café} Cafés, ${typen.Großhandel} Großhändler\n\n`
    resp += `**Top 5 nach Umsatz:**\n`
    top5.forEach((c, i) => {
      resp += `${i + 1}. **${c.name}** — ${formatCurrency(c.totalRevenue)} (${c.type}, ${c.frequency})\n`
    })
    resp += `\n**Tipp:** Die wöchentlichen Kunden (${customers.filter(c => c.frequency === 'Wöchentlich').length}) machen den Großteil des Umsatzes. Regelmäßige Nachbestellungen sichern planbaren Cashflow.`
    return resp
  }

  // Umsatz / Revenue
  if (q.includes('umsatz') || q.includes('revenue') || q.includes('entwickl') || q.includes('wachstum') || q.includes('einnahm')) {
    const total6m = revenueData.reduce((s, r) => s + r.total, 0)
    const b2bTotal = revenueData.reduce((s, r) => s + r.b2b, 0)
    const b2bPct = ((b2bTotal / total6m) * 100).toFixed(0)
    let resp = `**Umsatzentwicklung (6 Monate):**\n\n`
    resp += `Gesamtumsatz: **${formatCurrency(total6m)}**\n`
    resp += `- B2B: ${formatCurrency(b2bTotal)} (${b2bPct}%)\n`
    resp += `- B2C: ${formatCurrency(total6m - b2bTotal)} (${100 - parseInt(b2bPct)}%)\n\n`
    resp += `**Monatlicher Trend:**\n`
    revenueData.forEach((r, i) => {
      const prev = i > 0 ? revenueData[i - 1].total : null
      const growth = prev ? ((r.total - prev) / prev * 100).toFixed(1) : null
      resp += `- ${r.label}: ${formatCurrency(r.total)}${growth ? ` (+${growth}%)` : ''}\n`
    })
    resp += `\n📈 **Starkes Wachstum:** +${revenueGrowth}% im aktuellen Monat. Der B2B-Kanal wächst überproportional — ein gutes Zeichen für die Skalierung.`
    return resp
  }

  // Preis / Kosten
  if (q.includes('preis') || q.includes('kost') || q.includes('pfand') || q.includes('dose')) {
    let resp = `**Preisübersicht Cocodo Kokoswasser 250ml:**\n\n`
    resp += `**B2C Staffelpreise (Endkunden):**\n`
    product.b2cPricing.forEach(t => {
      resp += `- ${t.quantity}er Pack: ${formatCurrency(t.price)} (${formatCurrency(t.pricePerCan)}/Dose)\n`
    })
    resp += `\n**B2B Basispreis:** ${formatCurrency(product.b2bBasePrice)}/Dose\n`
    resp += `(Individuelle Preise je nach Kunde: €1,65 – €1,95)\n\n`
    resp += `**Pfand:** ${formatCurrency(product.pfand)} pro Dose (wird auf jede Bestellung aufgeschlagen)`
    return resp
  }

  // Nachbestellen / Lieferung
  if (q.includes('nachbestel') || q.includes('lieferung') || q.includes('vietnam') || q.includes('reorder') || q.includes('container')) {
    return `**Nachbestellungs-Info:**\n\nAktuelle Reichweite bei durchschnittlichem Verbrauch: ca. **6-8 Wochen**.\n\nReorder Point: **${formatNumber(2000)} Dosen** — aktueller Bestand liegt mit ${formatNumber(totalStock)} Dosen deutlich darüber.\n\n**Lieferkette:**\n- Herkunft: Mekong Delta, Vietnam\n- Transportzeit Container: ca. 4-6 Wochen\n- Letzter Wareneingang: 15. Jan 2026 (3.000 Dosen)\n\n**Empfehlung:** Nächste Bestellung bei Lieferanten spätestens planen, wenn Bestand unter 3.000 Dosen fällt, um Lieferengpässe zu vermeiden.`
  }

  // Hilfe / Navigation
  if (q.includes('hilfe') || q.includes('help') || q.includes('was kann') || q.includes('funktion') || q.includes('überblick')) {
    return `**Willkommen im Cocodo WAWI!** Hier ein Überblick:\n\n📊 **Dashboard** — KPIs, Umsatz-Chart, Schnellzugriff\n📦 **Lager** — Bestand, Chargen, MHD-Tracking, Warenbewegungen\n👥 **Kunden** — B2B-Kundenverwaltung mit individuellen Preisen\n🛒 **Bestellungen** — Auftragserfassung, Status-Tracking, Pfand\n📋 **Produkte** — Produktkatalog mit Staffelpreisen\n📈 **Berichte** — Umsatzanalysen, Top-Kunden, Trends\n\nFrag mich einfach, z.B.:\n- "Wie ist der Lagerbestand?"\n- "Welche Bestellungen sind offen?"\n- "Wie entwickelt sich der Umsatz?"`
  }

  // Warenwirtschaft allgemein
  if (q.includes('warenwirtschaft') || q.includes('wawi') || q.includes('erp') || q.includes('system')) {
    return `**Was macht ein Warenwirtschaftssystem?**\n\nEin WAWI wie dieses hier bildet den kompletten Warenfluss ab:\n\n1. **Einkauf** — Bestellungen beim Lieferanten (Vietnam), Container-Tracking\n2. **Lager** — Bestandsführung, Chargen-Tracking mit MHD, Standorte\n3. **Verkauf** — B2B-Aufträge (Kiosks, Supermärkte) + B2C (Shopify)\n4. **Kunden** — CRM für Geschäftskunden mit individuellen Konditionen\n5. **Finanzen** — Umsatzreporting, Pfandabrechnung, Rechnungen\n6. **Analyse** — Trends, Top-Kunden, Lagerumschlag\n\nDas Ziel: **Alles in einem System** statt Excel, WhatsApp und Bauchgefühl. So spart Cocodo Stunden pro Woche und hat jederzeit den Überblick.`
  }

  // Fallback
  return `Gute Frage! Ich kann dir helfen mit:\n\n- **Lagerbestand** & MHD-Warnungen\n- **Bestellungen** & offene Aufträge\n- **Kunden** & Top-Performer\n- **Umsatz** & Wachstum\n- **Preise** & Pfand\n- **Navigation** im System\n\nStell mir einfach eine konkrete Frage, z.B. "Wie ist der Lagerbestand?" oder "Wer sind unsere Top-Kunden?"`
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Hej! 🥥 Ich bin der Cocodo Assistent. Ich kenne alle Daten eures Warenwirtschaftssystems und helfe euch, den Überblick zu behalten. Was möchtet ihr wissen?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  const sendMessage = (text: string) => {
    if (!text.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(text)
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
    }, 600 + Math.random() * 800)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      // Bold
      const parts = line.split(/\*\*(.*?)\*\*/g)
      const rendered = parts.map((part, j) =>
        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
      )

      if (line.startsWith('- ')) {
        return (
          <div key={i} style={{ display: 'flex', gap: 8, paddingLeft: 4, marginTop: 2 }}>
            <span style={{ color: 'var(--color-text-tertiary)' }}>•</span>
            <span>{rendered.slice(1)}</span>
          </div>
        )
      }
      if (line.match(/^\d+\./)) {
        return <div key={i} style={{ paddingLeft: 4, marginTop: 2 }}>{rendered}</div>
      }
      if (line === '') return <div key={i} style={{ height: 8 }} />
      return <div key={i}>{rendered}</div>
    })
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2D7D46 0%, #4CAF50 100%)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(45, 125, 70, 0.4)',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isOpen ? 'scale(0.9) rotate(90deg)' : 'scale(1)',
          zIndex: 999,
        }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 96,
            right: 24,
            width: 420,
            height: 560,
            background: 'var(--color-bg)',
            borderRadius: 24,
            border: '1px solid var(--color-border)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 998,
            animation: 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '18px 24px',
              background: 'linear-gradient(135deg, #2D7D46 0%, #4CAF50 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 15 }}>Cocodo Assistent</p>
              <p style={{ fontSize: 12, opacity: 0.8 }}>Dein WAWI-Experte</p>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '12px 16px',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.role === 'user' ? '#2D7D46' : 'var(--color-bg-secondary)',
                    color: msg.role === 'user' ? 'white' : 'var(--color-text)',
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '12px 20px',
                    borderRadius: '18px 18px 18px 4px',
                    background: 'var(--color-bg-secondary)',
                    display: 'flex',
                    gap: 6,
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'var(--color-text-tertiary)',
                        animation: `typing 1.4s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div style={{ padding: '0 20px 12px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {suggestedQuestions.slice(0, 4).map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  style={{
                    padding: '8px 14px',
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 100,
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#2D7D46'
                    e.currentTarget.style.color = '#2D7D46'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)'
                    e.currentTarget.style.color = 'var(--color-text-secondary)'
                  }}
                >
                  <ChevronRight size={12} />
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: '14px 20px',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              gap: 10,
              background: 'var(--color-bg)',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Frag mich etwas..."
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 14,
                fontSize: 14,
                color: 'var(--color-text)',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#2D7D46'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: input.trim() ? '#2D7D46' : 'var(--color-bg-tertiary)',
                color: input.trim() ? 'white' : 'var(--color-text-tertiary)',
                border: 'none',
                cursor: input.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes typing {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-4px); }
        }
      `}</style>
    </>
  )
}
