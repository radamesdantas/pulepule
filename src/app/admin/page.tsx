import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminOverview() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.role !== 'admin') redirect('/auth/login')

  const [
    { data: profiles },
    { data: submissions },
    { data: topTeens },
    { data: recentSubmissions },
  ] = await Promise.all([
    supabase.from('profiles').select('role'),
    supabase.from('teen_missions').select('status'),
    supabase
      .from('teen_xp')
      .select('teen_id, total_xp, current_level, autonomy_index')
      .order('total_xp', { ascending: false })
      .limit(5),
    supabase
      .from('teen_missions')
      .select('id, status, evidence_description, updated_at, teen_id, mission_id')
      .order('updated_at', { ascending: false })
      .limit(8),
  ])

  // Stats
  const teens = profiles?.filter((p) => p.role === 'teen').length ?? 0
  const mentors = profiles?.filter((p) => p.role === 'mentor').length ?? 0
  const parents = profiles?.filter((p) => p.role === 'parent').length ?? 0
  const pending =
    submissions?.filter((s) => s.status === 'in_progress' || s.status === 'submitted').length ?? 0
  const approved = submissions?.filter((s) => s.status === 'approved').length ?? 0

  // Enrich top teens with names
  const teenIds = topTeens?.map((t) => t.teen_id) ?? []
  const { data: teenProfiles } = await supabase
    .from('profiles')
    .select('id, name')
    .in('id', teenIds)

  const profileMap = Object.fromEntries((teenProfiles ?? []).map((p) => [p.id, p.name]))

  // Enrich recent submissions
  const subIds = recentSubmissions?.map((s) => s.teen_id) ?? []
  const missionIds = recentSubmissions?.map((s) => s.mission_id) ?? []
  const [{ data: subProfiles }, { data: subMissions }] = await Promise.all([
    supabase.from('profiles').select('id, name').in('id', subIds),
    supabase.from('missions').select('id, title').in('id', missionIds),
  ])
  const subProfileMap = Object.fromEntries((subProfiles ?? []).map((p) => [p.id, p.name]))
  const subMissionMap = Object.fromEntries((subMissions ?? []).map((m) => [m.id, m.title]))

  const STATUS_LABEL: Record<string, string> = {
    approved: 'Aprovado',
    rejected: 'Rejeitado',
    in_progress: 'Em andamento',
    submitted: 'Aguardando',
    pending: 'Pendente',
  }
  const STATUS_COLOR: Record<string, string> = {
    approved: 'bg-level-up/15 text-level-up',
    rejected: 'bg-red-500/15 text-red-400',
    in_progress: 'bg-parent-blue/15 text-parent-blue',
    submitted: 'bg-xp-gold/15 text-xp-gold',
    pending: 'bg-gray-700 text-gray-400',
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black font-outfit text-white">Visão geral</h1>
        <p className="text-gray-500 text-sm mt-1">Resumo em tempo real da plataforma</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Jovens', value: teens, color: 'text-teen-purple' },
          { label: 'Mentores', value: mentors, color: 'text-parent-blue' },
          { label: 'Pais', value: parents, color: 'text-xp-gold' },
          { label: 'Aprovações', value: approved, color: 'text-level-up' },
          { label: 'Pendentes', value: pending, color: 'text-red-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
            <p className={`text-2xl font-black font-outfit ${color}`}>{value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Últimos envios */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800">
          <div className="px-5 py-4 border-b border-gray-800">
            <h2 className="font-bold text-white text-sm">Últimos envios</h2>
          </div>
          <div className="divide-y divide-gray-800">
            {recentSubmissions?.map((sub) => (
              <div key={sub.id} className="px-5 py-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {subProfileMap[sub.teen_id] ?? '—'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {subMissionMap[sub.mission_id] ?? '—'}
                  </p>
                  {sub.evidence_description && (
                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                      {sub.evidence_description}
                    </p>
                  )}
                </div>
                <span
                  className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[sub.status] ?? 'bg-gray-700 text-gray-400'}`}
                >
                  {STATUS_LABEL[sub.status] ?? sub.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top teens */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800">
          <div className="px-5 py-4 border-b border-gray-800">
            <h2 className="font-bold text-white text-sm">Top jovens por XP</h2>
          </div>
          <div className="divide-y divide-gray-800">
            {topTeens?.map((t, i) => (
              <div key={t.teen_id} className="px-5 py-3 flex items-center gap-4">
                <span className="text-gray-600 font-black text-sm w-5 text-center">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {profileMap[t.teen_id] ?? '—'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Nível {t.current_level} · {t.autonomy_index}% autonomia
                  </p>
                </div>
                <span className="text-xp-gold font-black text-sm">{t.total_xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
