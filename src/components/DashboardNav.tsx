'use client'

import Link from 'next/link'
import { usePathname, useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types/database'
import EagleMascot from './EagleMascot'

interface Props {
  profile: Profile
}

const NAV_TEEN = [
  { href: '/teen', label: 'Início', icon: '🏠' },
  { href: '/missions', label: 'Missões', icon: '🎯' },
  { href: '/journey', label: 'Jornada', icon: '🗺️' },
  { href: '/competencies', label: 'Competências', icon: '⭐' },
  { href: '/leaderboard', label: 'Ranking', icon: '🏆' },
]

const NAV_PARENT = [
  { href: '/parent', label: 'Dashboard', icon: '🏠' },
  { href: '/link', label: 'Vincular Teen', icon: '🔗' },
]

const NAV_MENTOR = [
  { href: '/mentor', label: 'Dashboard', icon: '🏠' },
]

export default function DashboardNav({ profile }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [unread, setUnread] = useState(0)

  const navItems =
    profile.role === 'teen' ? NAV_TEEN :
    profile.role === 'parent' ? NAV_PARENT :
    NAV_MENTOR

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', profile.id)
      .eq('read', false)
      .then(({ count }) => setUnread(count ?? 0))
  }, [profile.id])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href={profile.role === 'teen' ? '/teen' : profile.role === 'parent' ? '/parent' : '/mentor'}
            className="flex items-center gap-2"
          >
            <EagleMascot width={32} height={38} animate={false} />
            <span className="font-black text-gray-800 text-lg hidden sm:block" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Pule Pule
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  pathname === item.href
                    ? 'bg-purple-50 text-teen-purple'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notificações */}
          <Link
            href="/notifications"
            className={`relative p-2 rounded-lg transition-colors ${
              pathname === '/notifications' ? 'bg-purple-50 text-teen-purple' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl">🔔</span>
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </Link>

          {/* Perfil */}
          <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-teen-purple to-parent-blue rounded-full flex items-center justify-center text-white font-black text-sm">
              {profile.name?.[0]?.toUpperCase()}
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800 leading-tight">{profile.name.split(' ')[0]}</p>
              <p className="text-[10px] text-gray-400">{profile.role === 'teen' ? 'Adolescente' : profile.role === 'parent' ? 'Pai/Mãe' : 'Mentor'}</p>
            </div>
          </Link>

          <button
            onClick={handleSignOut}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded hidden sm:block"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  )
}
