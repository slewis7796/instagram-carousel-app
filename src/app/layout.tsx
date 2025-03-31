import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Instagram Carousel Generator',
  description: 'Create beautiful Instagram carousel posts from your text',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
