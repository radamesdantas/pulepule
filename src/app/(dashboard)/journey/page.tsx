import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const PHASE_CONFIG = [
  { phase: 1, label: 'Descoberta', months: [1, 2, 3], color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
  { phase: 2, label: 'Desenvolvimento', months: [4, 5, 6], color: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  { phase: 3, label: 'Liderança', months: [7, 8, 9], color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  { phase: 4, label: 'Legado', months: [10, 11, 12], color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
]

const MONTH_THEMES: Record<number, { focus: string; icon: string }> = {
  1: { focus: 'Autoconhecimento', icon: '🔍' },
  2: { focus: 'Gestão do Tempo', icon: '⏰' },
  3: { focus: 'Comunicação', icon: '💬' },
  4: { focus: 'Decisão & Equipe', icon: '🤝' },
  5: { focus: 'Liderança & Criatividade', icon: '💡' },
  6: { focus: 'Planejamento & Ética', icon: '📋' },
  7: { focus: 'Conflitos & Iniciativa', icon: '🚀' },
  8: { focus: 'Delegação & Feedback', icon: '📊' },
  9: { focus: 'Projetos & Pensamento Crítico', icon: '🔬' },
  10: { focus: 'Inteligência Emocional', icon: '🧠' },
  11: { focus: 'Influência & Impacto', icon: '🌍' },
  12: { focus: 'Legado', icon: '👑' },
}

export default async function JourneyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const role = profile?.role ?? user.user_metadata?.role ?? 'teen'
  if (role !== 'teen') redirect('/teen')

  const { data: xp } = await supabase.from('teen_xp').select('*').eq('teen_id', user.id).single()
  const currentPhase = xp?.current_phase ?? 1

  // Contagem de missões por mês
  const { data: completedMissions } = await supabase
    .from('teen_missions')
    .select('mission_id, status, missions(month, phase)')
    .eq('teen_id', user.id)
    .eq('status', 'approved')

  const completedByMonth: Record<number, number> = {}
  completedMissions?.forEach(tm => {
    const mission = Array.isArray(tm.missions) ? tm.missions[0] as { month: number; phase: number } | null : tm.missions as unknown as { month: number; phase: number } | null
    if (mission) {
      completedByMonth[mission.month] = (completedByMonth[mission.month] ?? 0) + 1
    }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Sua Jornada 🗺️
        </h1>
        <p className="text-gray-500 text-sm mt-1">12 meses, 4 fases, 24 competências — sua trilha completa de liderança</p>
      </div>

      {/* XP Resumo */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-black text-teen-purple">{xp?.total_xp?.toLocaleString('pt-BR') ?? 0} XP</p>
            <p className="text-sm text-gray-500 mt-0.5">acumulados na jornada</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-gray-800">Nível {xp?.current_level ?? 1}</p>
            <p className="text-sm text-gray-500">{Object.values(completedByMonth).reduce((a, b) => a + b, 0)} missões aprovadas</p>
          </div>
        </div>
      </div>

      {/* Fases */}
      {PHASE_CONFIG.map(({ phase, label, months, color, bg, border, text }) => {
        const isUnlocked = phase <= currentPhase
        const isCurrent = phase === currentPhase

        return (
          <div key={phase} className={`rounded-2xl border-2 overflow-hidden transition-all ${isUnlocked ? border : 'border-gray-200'}`}>
            {/* Header da fase */}
            <div className={`bg-gradient-to-r ${isUnlocked ? color : 'from-gray-300 to-gray-400'} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold opacity-80">Fase {phase}</p>
                  <h3 className="text-xl font-black" style={{ fontFamily: 'Outfit, sans-serif' }}>{label}</h3>
                </div>
                <div className="text-right">
                  {isCurrent && (
                    <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Fase atual ✦
                    </span>
                  )}
                  {!isUnlocked && <span className="text-2xl">🔒</span>}
                  {phase < currentPhase && <span className="text-2xl">✅</span>}
                </div>
              </div>
            </div>

            {/* Meses */}
            <div className={`${isUnlocked ? bg : 'bg-gray-50'} p-4`}>
              <div className="grid grid-cols-3 gap-3">
                {months.map(month => {
                  const theme = MONTH_THEMES[month]
                  const completed = completedByMonth[month] ?? 0
                  const total = 4 // 4 missões por mês

                  return (
                    <div
                      key={month}
                      className={`bg-white rounded-xl p-3 border transition-all ${
                        isUnlocked
                          ? `${border} hover:shadow-sm`
                          : 'border-gray-100 opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg">{theme.icon}</span>
                        <span className={`text-xs font-black ${isUnlocked ? text : 'text-gray-400'}`}>
                          Mês {month}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-700 leading-tight mb-2">{theme.focus}</p>

                      {/* Barra de progresso */}
                      <div className="bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full bg-gradient-to-r ${color} transition-all`}
                          style={{ width: `${(completed / total) * 100}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">{completed}/{total} missões</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
        <p className="text-3xl mb-2">🦅</p>
        <h3 className="font-black text-gray-800 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Continue evoluindo!
        </h3>
        <p className="text-gray-500 text-sm mb-4">Cada missão completa te aproxima do seu legado.</p>
        <Link
          href="/missions"
          className="inline-block bg-gradient-to-r from-teen-purple to-parent-blue text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-all"
        >
          Ver Missões do Mês
        </Link>
      </div>
    </div>
  )
}
