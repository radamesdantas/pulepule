import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import MissionFilter from './MissionFilter'

const CONTEXT_LABELS: Record<string, string> = {
  family: '👨‍👩‍👦 Família',
  school: '🏫 Escola',
  community: '🌍 Comunidade',
  company: '🏢 Empresa',
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: 'Disponível', color: 'bg-gray-100 text-gray-600' },
  in_progress: { label: 'Em progresso', color: 'bg-blue-100 text-blue-600' },
  submitted: { label: 'Aguardando aprovação', color: 'bg-yellow-100 text-yellow-700' },
  approved: { label: 'Concluída ✓', color: 'bg-green-100 text-green-700' },
  rejected: { label: 'Revisar', color: 'bg-red-100 text-red-600' },
}

interface Props {
  searchParams: Promise<{ status?: string }>
}

export default async function MissionsPage({ searchParams }: Props) {
  const { status: filterStatus } = await searchParams
  const activeFilter = filterStatus ?? 'all'

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
  const role = profile?.role ?? user.user_metadata?.role ?? 'teen'
  if (role !== 'teen') redirect('/teen')

  const { data: xp } = await supabase
    .from('teen_xp')
    .select('current_phase')
    .eq('teen_id', user.id)
    .single()
  const currentPhase = xp?.current_phase ?? 1

  // Busca missões da fase atual
  const { data: allMissions } = await supabase
    .from('missions')
    .select('*, competency:competencies(name, icon)')
    .eq('phase', currentPhase)
    .order('month')

  // Busca progresso do teen
  const { data: teenMissions } = await supabase
    .from('teen_missions')
    .select('*')
    .eq('teen_id', user.id)

  const progressMap = new Map(teenMissions?.map((tm) => [tm.mission_id, tm]) ?? [])

  // Aplica filtro de status
  const filteredMissions = (allMissions ?? []).filter((mission) => {
    if (activeFilter === 'all') return true
    const progress = progressMap.get(mission.id)
    const status = progress?.status ?? 'pending'
    if (activeFilter === 'available') return status === 'pending'
    return status === activeFilter
  })

  const counts = {
    all: allMissions?.length ?? 0,
    available: (allMissions ?? []).filter(
      (m) => !progressMap.has(m.id) || progressMap.get(m.id)?.status === 'pending'
    ).length,
    in_progress: (allMissions ?? []).filter((m) => progressMap.get(m.id)?.status === 'in_progress')
      .length,
    submitted: (allMissions ?? []).filter((m) => progressMap.get(m.id)?.status === 'submitted')
      .length,
    approved: (allMissions ?? []).filter((m) => progressMap.get(m.id)?.status === 'approved')
      .length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800">Suas Missões 🎯</h1>
        <p className="text-gray-500 text-sm mt-1">
          Fase {currentPhase} — {counts.approved} concluídas · {counts.in_progress} em progresso
        </p>
      </div>

      <Suspense>
        <MissionFilter current={activeFilter} />
      </Suspense>

      {filteredMissions.length > 0 ? (
        <div className="grid gap-4">
          {filteredMissions.map((mission) => {
            const progress = progressMap.get(mission.id)
            const status = progress?.status ?? 'pending'
            const s = STATUS_MAP[status]
            const comp = mission.competency as { name: string; icon: string } | null

            // Desbloqueio sequencial: só libera se for a primeira OU a anterior já foi aprovada
            const sortedAll = allMissions ?? []
            const missionIndex = sortedAll.findIndex((m) => m.id === mission.id)
            const prevMission = missionIndex > 0 ? sortedAll[missionIndex - 1] : null
            const prevStatus = prevMission
              ? (progressMap.get(prevMission.id)?.status ?? 'pending')
              : 'approved'
            const isLocked = status === 'pending' && prevStatus !== 'approved'

            return (
              <div
                key={mission.id}
                className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${
                  isLocked
                    ? 'border-gray-100 opacity-50'
                    : status === 'approved'
                      ? 'border-green-200 opacity-80'
                      : 'border-gray-100 hover:border-teen-purple/20 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{CONTEXT_LABELS[mission.context]}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-400">Mês {mission.month}</span>
                      {isLocked && <span className="text-xs">🔒</span>}
                    </div>
                    <h3
                      className={`font-black text-lg leading-tight ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}
                    >
                      {mission.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                      {mission.description}
                    </p>

                    {comp && (
                      <div className="mt-3 inline-flex items-center gap-1 bg-purple-50 text-teen-purple text-xs font-semibold px-2.5 py-1 rounded-full">
                        <span>{comp.icon}</span>
                        <span>{comp.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${isLocked ? 'bg-gray-100 text-gray-400' : s.color}`}
                    >
                      {isLocked ? '🔒 Bloqueada' : s.label}
                    </span>
                    <span className="text-xs font-bold text-xp-gold">+{mission.xp_reward} XP</span>
                  </div>
                </div>

                {isLocked && (
                  <div className="mt-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs text-gray-400 font-semibold">
                    🔒 Complete a missão anterior para desbloquear
                  </div>
                )}

                {!isLocked && status === 'rejected' && progress?.mentor_feedback && (
                  <div className="mt-3 bg-red-50 border border-red-100 rounded-xl p-3">
                    <p className="text-xs text-red-600 font-semibold">Feedback do mentor:</p>
                    <p className="text-xs text-red-500 mt-0.5">{progress.mentor_feedback}</p>
                  </div>
                )}

                {!isLocked &&
                  (status === 'pending' || status === 'in_progress' || status === 'rejected') && (
                    <MissionActions missionId={mission.id} teenId={user.id} status={status} />
                  )}

                {!isLocked && status === 'submitted' && (
                  <div className="mt-3 bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-2 text-xs text-yellow-700 font-semibold">
                    ⏳ Aguardando avaliação do mentor
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
          <p className="text-4xl mb-3">
            {activeFilter === 'approved' ? '🏆' : activeFilter === 'available' ? '✅' : '🌱'}
          </p>
          <h3 className="font-black text-gray-800">
            {activeFilter === 'approved'
              ? 'Nenhuma missão concluída ainda'
              : activeFilter === 'available'
                ? 'Todas as missões foram iniciadas!'
                : 'Nenhuma missão encontrada'}
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            {activeFilter !== 'all'
              ? 'Experimente outro filtro.'
              : 'As missões serão carregadas em breve.'}
          </p>
        </div>
      )}
    </div>
  )
}

// Ações por status
function MissionActions({
  missionId,
  teenId,
  status,
}: {
  missionId: string
  teenId: string
  status: string
}) {
  if (status === 'pending') {
    return (
      <form action={`/api/missions/${missionId}/start`} method="POST" className="mt-4">
        <input type="hidden" name="teen_id" value={teenId} />
        <button
          type="submit"
          className="bg-teen-purple text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors"
        >
          Iniciar Missão 🚀
        </button>
      </form>
    )
  }

  return (
    <div className="mt-4">
      <a
        href={`/missions/${missionId}/submit`}
        className="inline-block bg-gradient-to-r from-teen-purple to-parent-blue text-white text-sm font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-all"
      >
        {status === 'rejected' ? 'Reenviar Entrega ↩️' : 'Enviar Entrega 📤'}
      </a>
    </div>
  )
}
