import type { Metadata } from 'next'
import { Sidebar } from '@/components/Sidebar'
import { Chatbot } from '@/components/Chatbot'
import { WawiProvider } from '@/lib/wawi-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cocodo WAWI',
  description: 'Warenwirtschaftssystem für Cocodo Kokoswasser',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <WawiProvider>
          <div className="app-layout">
            <Sidebar />
            <main className="main-content">
              {children}
            </main>
          </div>
          <Chatbot />
        </WawiProvider>
      </body>
    </html>
  )
}
