'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, QrCode, ClipboardList, Shield } from 'lucide-react'
import useAuthStore from '@/app/_stores/useAuthStore'
import { LogoutButton } from '@/components/core/LogoutButton'

const bottomNav = [
  { to: '/petugas/dashboard', icon: Home, label: 'Beranda' },
  { to: '/petugas/scan', icon: QrCode, label: 'Scan QR' },
  { to: '/petugas/riwayat', icon: ClipboardList, label: 'Riwayat' }
]

export default function PetugasLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuthStore()

  const isActive = (to: string) => pathname === to

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Topbar */}
      <header className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <span className="font-bold text-slate-800 text-sm">SIBANSOS-QR</span>
            <p className="text-xs text-slate-400">Petugas Lapangan</p>
          </div>
        </div>
        <LogoutButton variant="topbar" />
      </header>

      {/* Content */}
      <main className="flex-1 pb-20 overflow-auto">{children}</main>

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
