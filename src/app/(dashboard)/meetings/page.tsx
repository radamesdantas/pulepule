import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import MeetingForm from './MeetingForm'

export default async function MeetingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role ?? 'teen'
  if (role !== 'teen' && role !== 'parent') redirect('/teen')

  // Para pais: precisa escolher o teen
  let teenId = user.id
  if (role === 'parent') {
    const { data: link } = await supabase
      .from('parent_teen')
      .select('teen_id')
      .eq('parent_id', user.id)
      .limit(1)
      .single()
    if (!link) redirect('/link')
    teenId = link.teen_id
  }

  const { data: meetings } = await supabase
    .from('family_meetings')
    .select('*')
    .eq('teen_id', teenId)
    .order('meeting_date', { ascending: false })
    .limit(20)

  const weekly = meetings?.filter((m) => m.meeting_type === 'weekly').length ?? 0
  const monthly = meetings?.filter((m) => m.meeting_type === 'monthly').length ?? 0

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Reunioes Familiares</h1>
        <p className="text-gray-400 text-sm mt-1">Registre e acompanhe suas reunioes em familia</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 text-center">
          <p className="text-2xl font-black text-white">{(meetings ?? []).length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Total</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 text-center">
          <p className="text-2xl font-black text-teen-purple">{weekly}</p>
          <p className="text-xs text-gray-400 mt-0.5">Semanais</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 text-center">
          <p className="text-2xl font-black text-xp-gold">{monthly}</p>
          <p className="text-xs text-gray-400 mt-0.5">Mensais</p>
        </div>
      </div>

      {/* Form */}
      <MeetingForm teenId={teenId} recordedBy={user.id} />

      {/* Historico */}
      {(meetings ?? []).length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-black text-white">Historico</h2>
          {meetings!.map((m) => (
            <div
              key={m.id}
              className="bg-gray-900 rounded-2xl p-4 border border-gray-800 flex items-start gap-3"
            >
              <span className="text-xl">{m.meeting_type === 'weekly' ? '📅' : '🗓️'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-white text-sm">
                    {m.meeting_type === 'weekly' ? 'Reuniao Semanal' : 'Reuniao Mensal'}
                  </p>
                  <span className="text-xs text-gray-500 shrink-0">
                    {new Date(m.meeting_date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{m.duration_minutes} minutos</p>
                {m.topic && <p className="text-xs text-gray-300 mt-1 line-clamp-2">{m.topic}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {(meetings ?? []).length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <p className="text-4xl mb-3">👨‍👩‍👦</p>
          <p className="font-semibold text-white">Nenhuma reuniao registrada ainda</p>
          <p className="text-sm mt-1">Registre sua primeira reuniao familiar acima!</p>
        </div>
      )}
    </div>
  )
}
