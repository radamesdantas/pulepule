'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import EagleMascot from './EagleMascot'

interface Props {
  role: string
  name: string
  unread?: number
}

const NAV_TEEN = [
  { href: '/teen', label: 'Aprender', icon: '🏠' },
  { href: '/missions', label: 'Missões', icon: '🎯' },
  { href: '/competencies', label: 'Competências', icon: '⭐' },
  { href: '/leaderboard', label: 'Ranking', icon: '🏆' },
  { href: '/profile', label: 'Perfil', icon: '👤' },
]

const NAV_PARENT = [
  { href: '/parent', label: 'Dashboard', icon: '🏠' },
  { href: '/link', label: 'Vincular', icon: '🔗' },
  { href: '/report', label: 'Relatório', icon: '📊' },
  { href: '/notifications', label: 'Avisos', icon: '🔔' },
  { href: '/profile', label: 'Perfil', icon: '👤' },
]

const NAV_MENTOR = [
  { href: '/mentor', label: 'Dashboard', icon: '🏠' },
  { href: '/report', label: 'Relatório', icon: '📊' },
  { href: '/notifications', label: 'Avisos', icon: '🔔' },
  { href: '/profile', label: 'Perfil', icon: '👤' },
]

export default function Sidebar({ role, name, unread = 0 }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const navItems = role === 'parent' ? NAV_PARENT : role === 'mentor' ? NAV_MENTOR : NAV_TEEN

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-56 bg-gray-900 border-r border-gray-800 z-40">
        {/* Logo */}
        <Link
          href={role === 'parent' ? '/parent' : role === 'mentor' ? '/mentor' : '/teen'}
          className="flex items-center gap-2 px-5 py-5 border-b border-gray-800"
        >
          <EagleMascot width={32} height={38} />
          <span className="font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-teen-purple to-parent-blue font-outfit tracking-display">
            Pule Pule
          </span>
        </Link>

        {/* Nav items */}
        <nav className="flex-1 py-4 space-y-1 px-3">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/teen' &&
                item.href !== '/parent' &&
                item.href !== '/mentor' &&
                pathname.startsWith(item.href))
            const isNotif = item.href === '/notifications'
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all relative ${
                  isActive
                    ? 'bg-teen-purple/20 text-white border-l-4 border-teen-purple pl-2'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
                {isNotif && unread > 0 && (
                  <span className="absolute right-3 bg-red-500 text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-800 px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teen-purple to-parent-blue rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">
              {name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-bold truncate">{(name ?? '').split(' ')[0]}</p>
              <p className="text-gray-500 text-xs">
                {role === 'teen' ? 'Adolescente' : role === 'parent' ? 'Pai/Mãe' : 'Mentor'}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full text-xs text-gray-500 hover:text-red-400 transition-colors py-2 rounded-lg hover:bg-gray-800"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800">
        <div className="flex items-center justify-around px-1 py-1">
          {navItems.slice(0, 4).map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/teen' &&
                item.href !== '/parent' &&
                item.href !== '/mentor' &&
                pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors ${
                  isActive ? 'text-teen-purple' : 'text-gray-500'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] font-semibold">{item.label}</span>
              </Link>
            )
          })}
          {/* Logout */}
          <button
            onClick={handleSignOut}
            className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors text-gray-500 hover:text-red-400"
          >
            <span className="text-xl">🚪</span>
            <span className="text-[10px] font-semibold">Sair</span>
          </button>
        </div>
      </nav>
    </>
  )
}
