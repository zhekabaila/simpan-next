import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ThemeProvider } from './_components/theme-provider'
import { AuthProvider } from './_components/auth-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { cookies } from 'next/headers'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5
}

export const metadata: Metadata = {
  metadataBase: new URL('https://simpan.coreapps.web.id'),
  title: 'SIMPAN - Sistem Informasi Penyaluran Bantuan Sosial | Platform Digital Terpadu',
  description:
    'SIMPAN adalah platform web terintegrasi untuk penyaluran bantuan sosial yang akurat. Dengan teknologi QR Code, verifikasi real-time, dan pencegahan fraud, kami memastikan bantuan tepat sasaran. Daftar masyarakat, verifikasi admin, dan distribusi petugas dalam satu sistem.',
  keywords: [
    'SIMPAN',
    'Sistem Informasi Penyaluran Bantuan',
    'platform bantuan sosial',
    'penyaluran bantuan',
    'QR Code identitas digital',
    'verifikasi penerima bantuan',
    'pencegahan fraud bantuan sosial',
    'transparansi bantuan',
    'sistem informasi sosial',
    'distribusi bantuan digital',
    'DTKS',
    'manajemen bantuan sosial',
    'aplikasi bantuan sosial'
  ],
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png'
  },
  applicationName: 'SIMPAN',
  authors: [{ name: 'SIMPAN Development Team' }],
  creator: 'SIMPAN',
  publisher: 'SIMPAN',
  category: 'Social Services',
  generator: 'Next.js',
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1
  },
  alternates: {
    canonical: 'https://simpan.coreapps.web.id'
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://simpan.coreapps.web.id',
    siteName: 'SIMPAN',
    title: 'SIMPAN - Platform Penyaluran Bantuan Sosial Berbasis Digital',
    description:
      'Sistem Informasi Penyaluran Bantuan (SIMPAN) mengintegrasikan seluruh proses bantuan sosial dengan teknologi QR Code untuk validasi real-time dan transparansi penuh. Hindari fraud dan pastikan bantuan tepat sasaran.',
    images: [
      {
        url: 'https://simpan.coreapps.web.id/images/logo.png'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@simpan_bantuan',
    creator: '@simpan_bantuan',
    title: 'SIMPAN - Platform Penyaluran Bantuan Sosial',
    description:
      'Sistem terintegrasi untuk penyaluran bantuan sosial dengan QR Code, verifikasi real-time, dan transparansi penuh. Mulai dari pendaftaran hingga distribusi dalam satu platform.',
    images: [
      {
        url: 'https://simpan.coreapps.web.id/images/logo.png'
      }
    ]
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SIMPAN'
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
    date: true,
    url: true
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://simpan.coreapps.web.id/#organization',
      name: 'SIMPAN',
      url: 'https://simpan.coreapps.web.id',
      logo: {
        '@type': 'ImageObject',
        url: 'https://simpan.coreapps.web.id/images/logo.png',
        width: 1200,
        height: 630
      },
      description:
        'SIMPAN adalah Sistem Informasi Penyaluran Bantuan Sosial berbasis web yang mengintegrasikan seluruh proses penyaluran bantuan dengan teknologi QR Code dan verifikasi real-time.',
      sameAs: ['https://simpan.coreapps.web.id'],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        url: 'https://simpan.coreapps.web.id'
      }
    },
    {
      '@type': 'WebSite',
      '@id': 'https://simpan.coreapps.web.id/#website',
      url: 'https://simpan.coreapps.web.id',
      name: 'SIMPAN - Sistem Informasi Penyaluran Bantuan Sosial',
      description: 'Platform terintegrasi untuk penyaluran bantuan sosial dengan QR Code dan verifikasi real-time',
      publisher: {
        '@id': 'https://simpan.coreapps.web.id/#organization'
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://simpan.coreapps.web.id/search?q={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      },
      inLanguage: 'id-ID'
    },
    {
      '@type': 'SoftwareApplication',
      name: 'SIMPAN',
      description:
        'Sistem Informasi Penyaluran Bantuan Sosial - Platform digital untuk manajemen bantuan sosial dengan teknologi QR Code',
      url: 'https://simpan.coreapps.web.id',
      applicationCategory: 'BusinessApplication',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'IDR'
      },
      screenshot: 'https://simpan.coreapps.web.id/images/logo.png',
      image: 'https://simpan.coreapps.web.id/images/logo.png'
    }
  ]
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const c = await cookies()
  const token = c.get('token')?.value

  return (
    <html lang="id">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider cookiesToken={token ?? ''}>
            <TooltipProvider>
              {children}
              <Toaster richColors position="top-right" />
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
