import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const LEVEL_NAMES = ['Explorador', 'Aprendiz', 'Guerreiro', 'Herói', 'Lenda']

export default async function AdminRanking() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.role !== 'admin') redirect('/auth/login')

  const { data: xpData } = await supabase
    .from('teen_xp')
    .select('*')
    .order('total_xp', { ascending: false })

  const teenIds = xpData?.map((x) => x.teen_id) ?? []
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, name, email')
    .in('id', teenIds)

  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]))

  const { data: missionCounts } = await supabase
    .from('teen_missions')
    .select('teen_id, status')
    .eq('status', 'approved')
    .in('teen_id', teenIds)

  const approvedMap: Record<string, number> = {}
  for (const m of missionCounts ?? []) {
    approvedMap[m.teen_id] = (approvedMap[m.teen_id] ?? 0) + 1
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black font-outfit text-white">Ranking</h1>
        <p className="text-gray-500 text-sm mt-1">{xpData?.length ?? 0} participantes</p>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">
                  #
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Jovem
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Nível
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  XP Total
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Comportamentos
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Autonomia
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Streak atual
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Streak máx.
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {xpData?.map((x, i) => {
                const profile = profileMap[x.teen_id]
                const levelName = LEVEL_NAMES[Math.min(x.current_level - 1, LEVEL_NAMES.length - 1)]
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null

                return (
                  <tr
                    key={x.teen_id}
                    className={`hover:bg-gray-800/50 transition-colors ${i < 3 ? 'bg-gray-800/20' : ''}`}
                  >
                    <td className="px-4 py-3 text-center">
                      {medal ? (
                        <span className="text-lg">{medal}</span>
                      ) : (
                        <span className="text-gray-600 font-bold">{i + 1}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{profile?.name ?? '—'}</p>
                      <p className="text-xs text-gray-500">{profile?.email ?? '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">Nível {x.current_level}</p>
                      <p className="text-xs text-gray-500">{levelName}</p>
                    </td>
                    <td className="px-4 py-3 text-xp-gold font-black text-base">
                      {x.total_xp.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-level-up font-bold">
                      {approvedMap[x.teen_id] ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-800 rounded-full h-1.5">
                          <div
                            className="bg-teen-purple rounded-full h-1.5"
                            style={{ width: `${x.autonomy_index}%` }}
                          />
                        </div>
                        <span className="text-gray-300 text-xs">{x.autonomy_index}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-orange-400 font-medium">
                      🔥 {x.current_streak}d
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{x.max_streak}d</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
