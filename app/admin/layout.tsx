'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, FileText, Calendar, Users, Map, Bell, UserCog, Shield, Menu } from 'lucide-react'
import { useState } from 'react'
import useAuthStore from '@/app/_stores/useAuthStore'
import { LogoutButton } from '@/components/core/LogoutButton'

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/pengajuan', icon: FileText, label: 'Pengajuan' },
  { to: '/admin/periode', icon: Calendar, label: 'Periode Bansos' },
  { to: '/admin/penugasan', icon: Users, label: 'Penugasan Petugas' },
  { to: '/admin/peta', icon: Map, label: 'Monitoring Peta' },
  { to: '/admin/notifikasi', icon: Bell, label: 'Notifikasi & Log' },
  { to: '/admin/pengguna', icon: UserCog, label: 'Pengguna' }
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuthStore()

  const isActive = (to: string) => pathname.includes(to)

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Overlay mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed h-screen inset-y-0 left-0 z-40 w-60 bg-white border-r border-slate-100 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Logo SIMPAN" className="w-9 h-9 rounded-xl object-cover" />
            <div>
              <p className="font-bold text-slate-800 text-sm">SIMPAN</p>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive(item.to)
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}>
              <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Profile */}
        <div className="px-3 py-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {user?.nama?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{user?.nama || 'Admin'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || 'admin@sibansos.go.id'}</p>
            </div>
          </div>
          <div className="mt-2 w-full">
            <LogoutButton variant="sidebar" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar mobile */}
        <header className="lg:hidden bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-slate-50">
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="Logo SIMPAN" className="w-7 h-7 rounded-xl object-cover" />
            <span className="font-bold text-slate-800 text-sm">SIMPAN</span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 lg:ml-60 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
