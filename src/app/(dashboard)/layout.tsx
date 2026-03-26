import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import DashboardNav from '@/components/DashboardNav'
import MobileNav from '@/components/MobileNav'
import CheckinTrigger from '@/components/CheckinTrigger'
import Toast from '@/components/Toast'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Se o profile não existe, cria a partir dos metadados do auth
  if (!profile) {
    const meta = user.user_metadata ?? {}
    const { data: created } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        name: meta.name ?? user.email?.split('@')[0] ?? 'Usuário',
        role: meta.role ?? 'teen',
      }, { onConflict: 'id' })
      .select('*')
      .single()
    profile = created
    if (!profile) redirect('/auth/login')
  }

  // Conta notificações não lidas
  const { count: unread } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('read', false)

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav profile={profile} />
      {/* Checkin diário silencioso para teens */}
      {profile.role === 'teen' && <CheckinTrigger teenId={user.id} />}
      <main className="max-w-5xl mx-auto px-4 py-6 pb-24 sm:pb-8">
        {children}
      </main>
      <MobileNav profile={profile} unread={unread ?? 0} />
      <Suspense><Toast /></Suspense>
    </div>
  )
}
