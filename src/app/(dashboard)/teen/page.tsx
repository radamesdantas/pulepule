import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const LEVEL_NAMES = ['Explorador', 'Aprendiz', 'Guerreiro', 'Herói', 'Lenda']
const XP_PER_LEVEL = 500

function getLevelName(level: number) {
  return LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)]
}

function getXpProgress(totalXp: number) {
  const xpInLevel = totalXp % XP_PER_LEVEL
  return Math.round((xpInLevel / XP_PER_LEVEL) * 100)
}

const PHASE_LABELS = ['', 'Descoberta', 'Desenvolvimento', 'Liderança', 'Legado']

export default async function TeenDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || profile.role !== 'teen') redirect('/auth/login')

  const { data: xp } = await supabase.from('teen_xp').select('*').eq('teen_id', user.id).single()

  const { data: missions } = await supabase
    .from('teen_missions')
    .select('*, mission:missions(*)')
    .eq('teen_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const totalXp = xp?.total_xp ?? 0
  const level = xp?.current_level ?? 1
  const streak = xp?.current_streak ?? 0
  const phase = xp?.current_phase ?? 1
  const autonomy = xp?.autonomy_index ?? 0
  const badges = xp?.badges ?? []

  const pending = missions?.filter(m => m.status === 'pending' || m.status === 'in_progress').length ?? 0
  const approved = missions?.filter(m => m.status === 'approved').length ?? 0

  // Progresso da fase atual
  const { data: phaseProgress } = await supabase
    .from('teen_missions')
    .select('id, missions!inner(phase)')
    .eq('teen_id', user.id)
    .eq('status', 'approved')
    .eq('missions.phase', phase)

  const approvedInPhase = phaseProgress?.length ?? 0
  const phaseGoal = 8 // 8 missões para avançar de fase

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teen-purple to-parent-blue rounded-3xl p-6 text-white">
        <p className="text-white/70 text-sm">Olá,</p>
        <h1 className="text-3xl font-black" style={{ fontFamily: 'Outfit, sans-serif' }}>
          {profile.name} 👋
        </h1>
        <p className="text-white/80 text-sm mt-1">Fase {phase} — {PHASE_LABELS[phase]}</p>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="font-bold">{getLevelName(level)} — Nível {level}</span>
            <span className="text-white/70">{totalXp % XP_PER_LEVEL} / {XP_PER_LEVEL} XP</span>
          </div>
          <div className="bg-white/20 rounded-full h-3">
            <div
              className="bg-xp-gold rounded-full h-3 transition-all"
              style={{ width: `${getXpProgress(totalXp)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'XP Total', value: totalXp.toLocaleString('pt-BR'), icon: '⚡', color: 'text-xp-gold' },
          { label: 'Streak', value: `${streak} dias`, icon: '🔥', color: 'text-orange-500' },
          { label: 'Missões', value: `${approved} concluídas`, icon: '🎯', color: 'text-level-up' },
          { label: 'Autonomia', value: `${autonomy}%`, icon: '🧭', color: 'text-parent-blue' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl mb-1">{stat.icon}</p>
            <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Progresso da fase */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <p className="font-bold text-gray-800 text-sm">Progresso — Fase {phase}</p>
          <p className="text-sm font-black text-teen-purple">{approvedInPhase}/{phaseGoal}</p>
        </div>
        <div className="bg-gray-100 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-teen-purple to-parent-blue rounded-full h-3 transition-all duration-500"
            style={{ width: `${Math.min(100, (approvedInPhase / phaseGoal) * 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          {approvedInPhase >= phaseGoal
            ? '🎉 Fase completa! Você avançou!'
            : `${phaseGoal - approvedInPhase} missões para avançar para a Fase ${phase + 1}`}
        </p>
      </div>

      {/* Ações rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/missions" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-teen-purple/30 hover:shadow-md transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-purple-200 transition-colors">
              🎯
            </div>
            <div>
              <p className="font-bold text-gray-800">Minhas Missões</p>
              <p className="text-sm text-gray-500">{pending} em andamento</p>
            </div>
          </div>
        </Link>

        <Link href="/competencies" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-teen-purple/30 hover:shadow-md transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-yellow-200 transition-colors">
              ⭐
            </div>
            <div>
              <p className="font-bold text-gray-800">Competências</p>
              <p className="text-sm text-gray-500">24 para desenvolver</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Suas Conquistas 🏆
          </h3>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge: string) => (
              <span key={badge} className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missões recentes */}
      {missions && missions.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Atividade Recente
            </h3>
            <Link href="/missions" className="text-sm text-teen-purple font-semibold hover:underline">
              Ver todas →
            </Link>
          </div>
          <div className="space-y-3">
            {missions.map((tm) => {
              const statusMap: Record<string, { label: string; color: string }> = {
                pending: { label: 'Pendente', color: 'bg-gray-100 text-gray-600' },
                in_progress: { label: 'Em progresso', color: 'bg-blue-100 text-blue-600' },
                submitted: { label: 'Enviada', color: 'bg-yellow-100 text-yellow-700' },
                approved: { label: 'Aprovada ✓', color: 'bg-green-100 text-green-700' },
                rejected: { label: 'Revisar', color: 'bg-red-100 text-red-600' },
              }
              const s = statusMap[tm.status] ?? statusMap.pending
              return (
                <div key={tm.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <p className="text-sm text-gray-700 font-medium">{(tm.mission as { title: string })?.title ?? 'Missão'}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {missions?.length === 0 && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <p className="text-4xl mb-3">🚀</p>
          <h3 className="font-black text-gray-800 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Pronto para começar?
          </h3>
          <p className="text-gray-500 text-sm mb-4">Explore suas missões e inicie sua jornada de liderança!</p>
          <Link href="/missions" className="bg-teen-purple text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors">
            Ver Missões
          </Link>
        </div>
      )}
    </div>
  )
}
