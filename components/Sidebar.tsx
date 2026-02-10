'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Box,
  BarChart3,
  Palmtree,
  Menu,
  FileText,
  Truck,
  ShoppingBag,
  Coins,
  RotateCcw,
  ClipboardCheck,
} from 'lucide-react'

const navSections = [
  {
    label: 'Übersicht',
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Vertrieb',
    items: [
      { name: 'Bestellungen', href: '/bestellungen', icon: ShoppingCart },
      { name: 'Kunden', href: '/kunden', icon: Users },
      { name: 'Rechnungen', href: '/rechnungen', icon: FileText },
    ],
  },
  {
    label: 'Logistik',
    items: [
      { name: 'Lager', href: '/lager', icon: Package },
      { name: 'Versand', href: '/versand', icon: Truck },
      { name: 'Einkauf', href: '/einkauf', icon: ShoppingBag },
    ],
  },
  {
    label: 'Verwaltung',
    items: [
      { name: 'Pfand', href: '/pfand', icon: Coins },
      { name: 'Retouren', href: '/retouren', icon: RotateCcw },
      { name: 'Inventur', href: '/inventur', icon: ClipboardCheck },
    ],
  },
  {
    label: 'Sonstiges',
    items: [
      { name: 'Produkte', href: '/produkte', icon: Box },
      { name: 'Berichte', href: '/berichte', icon: BarChart3 },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={() => setIsOpen(true)}
        style={{ position: 'fixed', top: 16, left: 16, zIndex: 44 }}
      >
        <Menu size={20} />
      </button>

      {isOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsOpen(false)} />
      )}

      <aside className={clsx('sidebar', { open: isOpen })}>
        <div className="sidebar-header">
          <Link href="/" className="logo">
            <span className="logo-icon">
              <Palmtree size={20} />
            </span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="logo-text">Cocodo</span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 500, letterSpacing: '0.02em' }}>
                Warenwirtschaft
              </span>
            </div>
          </Link>
        </div>

        <nav className="sidebar-nav">
          {navSections.map((section) => (
            <div key={section.label}>
              <div className="nav-section-label">{section.label}</div>
              {section.items.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx('nav-item', { active: isActive })}
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px', borderRadius: '8px',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #2D7D46 0%, #4CAF50 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 600, fontSize: 13, color: 'white',
            }}>
              CD
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'white' }}>Cocodo GmbH</div>
              <div style={{ fontSize: 12, color: 'var(--sidebar-text)' }}>Admin</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
