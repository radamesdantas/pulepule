import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminLogoutButton } from '@/components/admin/AdminLogoutButton'

const NAV = [
  { href: '/admin', label: 'Visão geral' },
  { href: '/admin/envios', label: 'Envios' },
  { href: '/admin/usuarios', label: 'Usuários' },
  { href: '/admin/ranking', label: 'Ranking' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.role !== 'admin') redirect('/auth/login')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-black text-white font-outfit text-lg">Pule Pule</span>
            <span className="bg-teen-purple/20 text-teen-purple text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Admin
            </span>
          </div>
          <nav className="flex items-center gap-1">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 hidden sm:block">{user.email}</span>
            <AdminLogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
