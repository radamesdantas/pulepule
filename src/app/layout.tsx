import type { Metadata } from 'next'
import { Outfit, Inter } from 'next/font/google'
import './globals.css'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  metadataBase: new URL('https://pulepule.netlify.app'),
  title: 'Pule Pule — Pule do ninho e faça seu voo!',
  description:
    'Plataforma gamificada de liderança para jovens líderes. Pulos e voos para desenvolver autonomia, liderança e caráter.',
  openGraph: {
    title: 'Pule Pule',
    description: 'Chegou a hora de pular do ninho e fazer seu voo como líder.',
    images: ['/eagle-icon.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pule Pule',
    description: 'Chegou a hora de pular do ninho e fazer seu voo como líder.',
    images: ['/eagle-icon.svg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '256x256', type: 'image/x-icon' },
      { url: '/eagle-icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/eagle-icon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${inter.variable}`}>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      <body className="antialiased" style={{ fontFamily: 'Inter, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
