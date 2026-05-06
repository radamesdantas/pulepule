import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

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
    .order('id')

  const { data: xp } = await supabase
    .from('teen_xp')
    .select('current_phase')
    .eq('teen_id', user.id)
    .single()
  const currentPhase = xp?.current_phase ?? 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800">12 Competências ⭐</h1>
        <p className="text-gray-500 text-sm mt-1">
          Sua jornada de liderança em 12 meses — 36 comportamentos
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(competencies ?? []).map((comp) => {
          const isUnlocked = (comp!.phase as number) <= currentPhase
          return (
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
                    <span className="text-xs font-bold text-xp-gold">+{comp!.xp_reward} XP</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{comp!.description}</p>
                  <span className="mt-2 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-teen-purple">
                    Comportamental
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
