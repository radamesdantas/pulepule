import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PrintButton from './PrintButton'

const LEVEL_NAMES = ['Explorador', 'Aprendiz', 'Guerreiro', 'Herói', 'Lenda']

const PHASE_NAMES: Record<number, string> = {
  1: 'Descoberta',
  2: 'Experimentação',
  3: 'Crescimento',
  4: 'Liderança',
}

export default async function ReportPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, name')
    .eq('id', user.id)
    .single()

  const role = profile?.role ?? 'teen'
  if (role === 'admin') redirect('/admin')

  // Resolver teen_id conforme o papel
  let teenId = user.id
  let teenName = profile?.name ?? 'Adolescente'

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

  if (role === 'mentor') {
    const { data: link } = await supabase
      .from('parent_teen')
      .select('teen_id')
      .eq('parent_id', user.id)
      .limit(1)
      .single()
    if (link) teenId = link.teen_id
  }

  // Buscar nome do teen se não for o próprio
  if (teenId !== user.id) {
    const { data: teenProfile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', teenId)
      .single()
    teenName = teenProfile?.name ?? 'Adolescente'
  }

  const now = new Date()
  const month = now.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })

  // Dados do teen
  const [xpResult, missionsResult, competenciesResult, meetingsResult] = await Promise.all([
    supabase
      .from('teen_xp')
      .select(
        'total_xp, current_level, autonomy_index, badges, current_streak, max_streak, current_phase'
      )
      .eq('teen_id', teenId)
      .single(),
    supabase
      .from('teen_missions')
      .select(
        'status, mission:missions(title, xp_reward, competency:competencies(name, icon, code))'
      )
      .eq('teen_id', teenId),
    supabase.from('competencies').select('id, name, icon, code, phase').order('phase').order('id'),
    supabase
      .from('family_meetings')
      .select('meeting_type, meeting_date, duration_minutes, topic')
      .eq('teen_id', teenId)
      .order('meeting_date', { ascending: false })
      .limit(10),
  ])

  const xp = xpResult.data
  const allMissions = missionsResult.data ?? []
  const competencies = competenciesResult.data ?? []
  const meetings = meetingsResult.data ?? []

  const approved = allMissions.filter((m) => m.status === 'approved')
  const inProgress = allMissions.filter((m) => m.status === 'in_progress')
  const totalXp = xp?.total_xp ?? 0
  const level = xp?.current_level ?? 1
  const levelName = LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)]
  const autonomy = xp?.autonomy_index ?? 0
  const badges = xp?.badges ?? []
  const currentPhase = xp?.current_phase ?? 1
  const phaseName = PHASE_NAMES[currentPhase] ?? 'Descoberta'

  // Competências com progresso
  const competencyProgress = competencies.map((comp) => {
    const compMissions = allMissions.filter((m) => {
      const mission = m.mission as { competency?: { code?: string } } | null
      return mission?.competency?.code === comp.code
    })
    const approvedCount = compMissions.filter((m) => m.status === 'approved').length
    return { ...comp, approved: approvedCount, total: compMissions.length }
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 print:py-2 print:px-0 print:space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-black text-white">Relatório de Progresso</h1>
          <p className="text-gray-400 text-sm mt-1 capitalize">{month}</p>
        </div>
        <PrintButton />
      </div>

      {/* Cabeçalho impresso */}
      <div className="hidden print:block text-center border-b pb-4 mb-4">
        <h1 className="text-2xl font-black">Relatório de Progresso — Pule Pule</h1>
        <p className="text-gray-600 text-sm capitalize mt-1">{month}</p>
      </div>

      {/* Teen hero */}
      <div className="bg-gradient-to-r from-teen-purple to-parent-blue rounded-2xl p-6 text-white print:rounded-none">
        <p className="text-white/70 text-xs uppercase tracking-wider mb-1">Adolescente</p>
        <h2 className="text-2xl font-black">{teenName}</h2>
        <p className="text-white/80 text-sm mt-1">
          {levelName} — Nível {level} · Fase {currentPhase}: {phaseName}
        </p>
      </div>

      {/* Stats principais */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'XP Total', value: totalXp.toLocaleString('pt-BR'), color: 'text-xp-gold' },
          { label: 'Missões Aprovadas', value: `${approved.length}/36`, color: 'text-green-400' },
          { label: 'Índice de Autonomia', value: `${autonomy}%`, color: 'text-teen-purple' },
          { label: 'Badges', value: `${badges.length}`, color: 'text-white' },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-gray-900 rounded-2xl p-4 border border-gray-800 print:border print:rounded-none"
          >
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Streak */}
      <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 print:border print:rounded-none">
        <h2 className="font-black text-white mb-3">Consistência</h2>
        <div className="flex gap-6">
          <div>
            <p className="text-2xl font-black text-orange-400">{xp?.current_streak ?? 0}</p>
            <p className="text-xs text-gray-400">Streak atual (dias)</p>
          </div>
          <div>
            <p className="text-2xl font-black text-white">{xp?.max_streak ?? 0}</p>
            <p className="text-xs text-gray-400">Maior sequência</p>
          </div>
        </div>
      </div>

      {/* Progresso por competência */}
      <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 print:border print:rounded-none">
        <h2 className="font-black text-white mb-4">Competências</h2>
        <div className="space-y-3">
          {competencyProgress.map((comp) => {
            const pct = comp.total > 0 ? Math.round((comp.approved / comp.total) * 100) : 0
            return (
              <div key={comp.code}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white font-semibold">
                    {comp.icon} {comp.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {comp.approved}/{comp.total}
                  </span>
                </div>
                <div className="bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-teen-purple to-parent-blue rounded-full h-2 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Missões aprovadas */}
      {approved.length > 0 && (
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 print:border print:rounded-none">
          <h2 className="font-black text-white mb-3">
            Comportamentos Aprovados ({approved.length})
          </h2>
          <div className="space-y-2">
            {approved.map((m, i) => {
              const mission = m.mission as {
                title?: string
                xp_reward?: number
                competency?: { name?: string; icon?: string }
              } | null
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-green-400 text-sm font-bold shrink-0">✓</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{mission?.title}</p>
                    <p className="text-xs text-gray-500">
                      {mission?.competency?.icon} {mission?.competency?.name} · +
                      {mission?.xp_reward} XP
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Em progresso */}
      {inProgress.length > 0 && (
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 print:border print:rounded-none">
          <h2 className="font-black text-white mb-3">Em Andamento ({inProgress.length})</h2>
          <div className="space-y-2">
            {inProgress.map((m, i) => {
              const mission = m.mission as {
                title?: string
                competency?: { name?: string; icon?: string }
              } | null
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-yellow-400 text-sm shrink-0">⏳</span>
                  <p className="text-sm text-white truncate">{mission?.title}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Badges */}
      {badges.length > 0 && (
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 print:border print:rounded-none">
          <h2 className="font-black text-white mb-3">Conquistas ({badges.length})</h2>
          <div className="flex flex-wrap gap-2">
            {badges.map((b: string) => (
              <span
                key={b}
                className="bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Reuniões familiares */}
      {meetings.length > 0 && (
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 print:border print:rounded-none">
          <h2 className="font-black text-white mb-3">Reuniões Familiares ({meetings.length})</h2>
          <div className="space-y-2">
            {meetings.map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xl shrink-0">
                  {m.meeting_type === 'weekly' ? '📅' : '🗓️'}
                </span>
                <div>
                  <p className="text-sm text-white">
                    {m.meeting_type === 'weekly' ? 'Semanal' : 'Mensal'} —{' '}
                    {new Date(m.meeting_date).toLocaleDateString('pt-BR')}
                  </p>
                  {m.topic && <p className="text-xs text-gray-400">{m.topic}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rodapé impresso */}
      <div className="hidden print:block text-center text-xs text-gray-500 border-t pt-4 mt-6">
        Gerado em {now.toLocaleDateString('pt-BR')} · Pule Pule — Plataforma de Desenvolvimento de
        Liderança
      </div>
    </div>
  )
}
