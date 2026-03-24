'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Profile } from '@/lib/types/database'

interface Props {
  profile: Profile
  unread?: number
}

const NAV_TEEN = [
  { href: '/teen', label: 'Início', icon: '🏠' },
  { href: '/missions', label: 'Missões', icon: '🎯' },
  { href: '/leaderboard', label: 'Ranking', icon: '🏆' },
  { href: '/journey', label: 'Jornada', icon: '🗺️' },
  { href: '/notifications', label: 'Avisos', icon: '🔔' },
]

const NAV_PARENT = [
  { href: '/parent', label: 'Dashboard', icon: '🏠' },
  { href: '/link', label: 'Vincular', icon: '🔗' },
  { href: '/notifications', label: 'Avisos', icon: '🔔' },
  { href: '/profile', label: 'Perfil', icon: '👤' },
]

const NAV_MENTOR = [
  { href: '/mentor', label: 'Dashboard', icon: '🏠' },
  { href: '/notifications', label: 'Avisos', icon: '🔔' },
  { href: '/profile', label: 'Perfil', icon: '👤' },
]

export default function MobileNav({ profile, unread = 0 }: Props) {
  const pathname = usePathname()

  const navItems =
    profile.role === 'teen' ? NAV_TEEN :
    profile.role === 'parent' ? NAV_PARENT :
    NAV_MENTOR

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map(item => {
          const isActive = pathname === item.href
          const isNotif = item.href === '/notifications'
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors relative ${
                isActive ? 'text-teen-purple' : 'text-gray-400'
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              {isNotif && unread > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-black rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
              <span className={`text-[10px] font-semibold ${isActive ? 'text-teen-purple' : 'text-gray-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-teen-purple rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
