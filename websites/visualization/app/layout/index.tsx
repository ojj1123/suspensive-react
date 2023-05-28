'use client'

import Link from 'next/link'
// These styles apply to every route in the application
import '../global.css'
import { Layout, Providers, TopNavigation } from './components'

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <TopNavigation />
          <Link href="/suspenseCache">🔗 Experimental Feature: suspenseCache</Link>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  )
}
