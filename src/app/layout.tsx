import type { Metadata } from 'next'
import './globals.css'
import { Terminal } from '@/components/Terminal'

export const metadata: Metadata = {
  title: 'Brillow',
  description: 'Property listing management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          {children}
        </div>
        <Terminal />
      </body>
    </html>
  )
}
