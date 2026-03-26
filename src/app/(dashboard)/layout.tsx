import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'
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

  if (!profile) {
    const meta = user.user_metadata ?? {}
    const fallbackName = meta.name ?? user.email?.split('@')[0] ?? 'Usuário'
    const fallbackRole = meta.role ?? 'teen'

    const { data: created } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        name: fallbackName,
        role: fallbackRole,
      }, { onConflict: 'id' })
      .select('*')
      .single()

    profile = created ?? {
      id: user.id,
      email: user.email ?? '',
      name: fallbackName,
      role: fallbackRole,
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  const { count: unread } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('read', false)

  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar role={profile.role} name={profile.name} unread={unread ?? 0} />
      <main className="md:ml-56 min-h-screen pb-20 md:pb-8">
        {children}
      </main>
      <Suspense><Toast /></Suspense>
    </div>
  )
}
