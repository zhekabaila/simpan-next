'use client'

import { LogOut } from 'lucide-react'
import useAuthStore from '@/app/_stores/useAuthStore'
import { useState, useTransition } from 'react'
import { removeToken } from '@/actions/auth'
import { cn } from '@/lib/utils'

export function LogoutButton({ variant }: { variant: 'sidebar' | 'topbar' }) {
  const [saving, startSaving] = useTransition()
  const { logout, isLoading } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      startSaving(async () => {
        await removeToken()
        await logout()
      })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleLogout}
        disabled={isLoading || saving}
        className={cn(
          'p-2.5 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-2 bg-red-50 text-red-500',
          variant === 'topbar' && 'w-auto',
          variant === 'sidebar' && 'w-full'
        )}
        aria-label="User menu">
        <LogOut className="w-4 h-4" />
        Keluar
      </button>
    </div>
  )
}
