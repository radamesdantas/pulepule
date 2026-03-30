import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const PHASE_LABELS = [
  '',
  'Fase 1 — Descoberta',
  'Fase 2 — Desenvolvimento',
  'Fase 3 — Liderança',
  'Fase 4 — Legado',
]

export default async function CompetenciesPage() {
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

  const { data: competencies } = await supabase
    .from('competencies')
    .select('*')
    .order('phase')
    .order('category')

  const { data: xp } = await supabase
    .from('teen_xp')
    .select('current_phase')
    .eq('teen_id', user.id)
    .single()
  const currentPhase = xp?.current_phase ?? 1

  const byPhase = (competencies ?? []).reduce<Record<number, typeof competencies>>((acc, c) => {
    if (!acc[c!.phase]) acc[c!.phase] = []
    acc[c!.phase]!.push(c)
    return acc
  }, {})

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-800">24 Competências ⭐</h1>
        <p className="text-gray-500 text-sm mt-1">Sua jornada de liderança completa em 12 meses</p>
      </div>

      {[1, 2, 3, 4].map((phase) => {
        const items = byPhase[phase] ?? []
        const isUnlocked = phase <= currentPhase

        return (
          <div key={phase}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-black text-gray-800 text-lg">{PHASE_LABELS[phase]}</h2>
              {!isUnlocked && (
                <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-semibold">
                  🔒 Bloqueado
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map((comp) => (
                <div
                  key={comp!.id}
                  className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${
                    isUnlocked
                      ? 'border-gray-100 hover:border-teen-purple/20 hover:shadow-md'
                      : 'border-gray-100 opacity-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{comp!.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-gray-800 text-sm">{comp!.name}</p>
                        <span className="text-xs font-bold text-xp-gold">
                          +{comp!.xp_reward} XP
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{comp!.description}</p>
                      <span
                        className={`mt-2 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          comp!.category === 'management'
                            ? 'bg-purple-50 text-teen-purple'
                            : 'bg-blue-50 text-parent-blue'
                        }`}
                      >
                        {comp!.category === 'management' ? 'Gestão' : 'Comportamental'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
