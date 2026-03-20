'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, FileText, QrCode, Bell, User } from 'lucide-react'
import { AppHeader } from '@/components/core/AppHeader'

const bottomNav = [
  { to: '/masyarakat/dashboard', icon: Home, label: 'Beranda' },
  { to: '/masyarakat/pengajuan', icon: FileText, label: 'Pengajuan' },
  { to: '/masyarakat/qrcode', icon: QrCode, label: 'QR Code' },
  { to: '/masyarakat/notifikasi', icon: Bell, label: 'Notifikasi' },
  { to: '/masyarakat/profil', icon: User, label: 'Profil' }
]

export default function MasyarakatLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isActive = (to: string) => pathname === to

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <AppHeader title="Dashboard Masyarakat" showNotifications={true} />

      {/* Content */}
      <main className="flex-1 pb-20 mt-20 overflow-auto">{children}</main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-20">
        <div className="flex">
          {bottomNav.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 transition-colors ${
                isActive(item.to) ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}>
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
