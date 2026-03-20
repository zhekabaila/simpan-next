'use client'

import { Bell, Menu, X } from 'lucide-react'
import { useState } from 'react'
import useAuthStore from '@/app/_stores/useAuthStore'
import { LogoutButton } from './LogoutButton'

interface AppHeaderProps {
  title?: string
  showNotifications?: boolean
  notificationCount?: number
  onNotificationClick?: () => void
}

export function AppHeader({ title, showNotifications = true, notificationCount = 0, onNotificationClick }: AppHeaderProps) {
  const { user } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 z-50 left-0 right-0 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section: Title */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
            </button>
            {title && <h1 className="text-lg font-bold text-slate-800">{title}</h1>}
          </div>

          {/* Right section: Actions & User Menu */}
          <div className="flex items-center gap-5">
            {showNotifications && (
              <button
                onClick={onNotificationClick}
                className="relative p-2.5 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
              </button>
            )}

            <div className="hidden md:flex items-center gap-2 px-6 border-x border-slate-200">
              <div className="">
                <p className="text-sm font-semibold text-slate-800">{user?.nama || 'User'}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role || 'User'}</p>
              </div>
            </div>

            <LogoutButton variant="topbar" />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-slate-50">
          <div className="px-4 py-3">
            <p className="text-sm font-semibold text-slate-800">{user?.nama || 'User'}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role || 'User'}</p>
            <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
          </div>
        </div>
      )}
    </header>
  )
}
