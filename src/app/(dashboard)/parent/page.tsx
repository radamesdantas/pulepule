import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function ParentDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || profile.role !== 'parent') redirect('/auth/login')

  // Busca teens vinculados
  const { data: links } = await supabase
    .from('parent_teen')
    .select('teen_id')
    .eq('parent_id', user.id)

  const teenIds = links?.map(l => l.teen_id) ?? []

  const { data: teens } = teenIds.length > 0
    ? await supabase.from('profiles').select('*').in('id', teenIds)
    : { data: [] }

  const { data: xpData } = teenIds.length > 0
    ? await supabase.from('teen_xp').select('*').in('teen_id', teenIds)
    : { data: [] }

  const xpMap = new Map(xpData?.map(x => [x.teen_id, x]) ?? [])

  const { data: pendingMissions } = teenIds.length > 0
    ? await supabase
        .from('teen_missions')
        .select('*, mission:missions(title), teen:profiles(name)')
        .in('teen_id', teenIds)
        .eq('status', 'submitted')
    : { data: [] }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Olá, {profile.name} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">Acompanhe o desenvolvimento dos seus teens</p>
      </div>

      {teens && teens.length > 0 ? (
        <>
          {/* Cards dos teens */}
          <div className="grid gap-4">
            {teens.map((teen) => {
              const x = xpMap.get(teen.id)
              const autonomy = x?.autonomy_index ?? 0
              const xp = x?.total_xp ?? 0
              const phase = x?.current_phase ?? 1
              const streak = x?.current_streak ?? 0
              const PHASE_LABELS = ['', 'Descoberta', 'Desenvolvimento', 'Liderança', 'Legado']

              return (
                <div key={teen.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={`/parent/teens/${teen.id}`} className="hover:underline">
                        <h3 className="font-black text-gray-800 text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>
                          {teen.name} →
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500">Fase {phase} — {PHASE_LABELS[phase]}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-teen-purple">{autonomy}%</p>
                      <p className="text-xs text-gray-400">Índice de Autonomia</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Autonomia</span>
                      <span>{autonomy}%</span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-teen-purple to-parent-blue rounded-full h-2 transition-all"
                        style={{ width: `${autonomy}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div className="bg-purple-50 rounded-xl p-2">
                      <p className="font-black text-teen-purple">{xp.toLocaleString('pt-BR')}</p>
                      <p className="text-xs text-gray-500">XP Total</p>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-2">
                      <p className="font-black text-orange-500">{streak}</p>
                      <p className="text-xs text-gray-500">Dias seguidos</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-2">
                      <p className="font-black text-level-up">Fase {phase}</p>
                      <p className="text-xs text-gray-500">Atual</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Missões aguardando aprovação */}
          {pendingMissions && pendingMissions.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-yellow-200">
              <h3 className="font-black text-gray-800 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                ⏳ Aguardando sua aprovação ({pendingMissions.length})
              </h3>
              <div className="space-y-3">
                {pendingMissions.map((tm) => (
                  <div key={tm.id} className="flex items-center justify-between border-b border-gray-50 last:border-0 py-2">
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        {(tm.mission as { title: string })?.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        por {(tm.teen as { name: string })?.name}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <form action={`/api/missions/${tm.id}/approve`} method="POST">
                        <button type="submit" className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors">
                          Aprovar ✓
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
          <p className="text-4xl mb-3">👨‍👩‍👦</p>
          <h3 className="font-black text-gray-800 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Nenhum teen vinculado
          </h3>
          <p className="text-gray-500 text-sm">
            Peça ao seu filho(a) para compartilhar o código de vínculo após criar a conta.
          </p>
        </div>
      )}
    </div>
  )
}
