import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TeenGame from './TeenGame'

export default async function TeenDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const role = profile?.role ?? user.user_metadata?.role ?? 'teen'
  const name = profile?.name ?? user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'Usuário'
  if (role !== 'teen') redirect('/auth/login')

  const { data: xp } = await supabase.from('teen_xp').select('*').eq('teen_id', user.id).single()

  // Busca missões (comportamentos) com competência
  const { data: allMissions } = await supabase
    .from('missions')
    .select('*, competency:competencies(id, name, icon, description, category)')
    .order('phase')
    .order('month')

  // Progresso do teen
  const { data: teenMissions } = await supabase
    .from('teen_missions')
    .select('*')
    .eq('teen_id', user.id)

  return (
    <TeenGame
      userId={user.id}
      name={name}
      xp={xp}
      missions={allMissions ?? []}
      teenMissions={teenMissions ?? []}
    />
  )
}
