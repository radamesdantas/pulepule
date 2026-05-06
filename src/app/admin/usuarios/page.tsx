import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DeleteUserButton } from '@/components/admin/DeleteUserButton'

const ROLE_LABEL: Record<string, string> = {
  teen: 'Jovem',
  parent: 'Pai/Resp.',
  mentor: 'Mentor',
  admin: 'Admin',
}
const ROLE_COLOR: Record<string, string> = {
  teen: 'bg-teen-purple/15 text-teen-purple',
  parent: 'bg-xp-gold/15 text-xp-gold',
  mentor: 'bg-parent-blue/15 text-parent-blue',
  admin: 'bg-level-up/15 text-level-up',
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default async function AdminUsuarios() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.role !== 'admin') redirect('/auth/login')

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const teenIds = profiles?.filter((p) => p.role === 'teen').map((p) => p.id) ?? []
  const { data: xpData } = await supabase
    .from('teen_xp')
    .select('teen_id, total_xp, current_level, autonomy_index, current_streak')
    .in('teen_id', teenIds)

  const xpMap = Object.fromEntries((xpData ?? []).map((x) => [x.teen_id, x]))

  // Contagens de missões por teen
  const { data: missionCounts } = await supabase
    .from('teen_missions')
    .select('teen_id, status')
    .in('teen_id', teenIds)

  const countMap: Record<string, { total: number; approved: number }> = {}
  for (const m of missionCounts ?? []) {
    if (!countMap[m.teen_id]) countMap[m.teen_id] = { total: 0, approved: 0 }
    countMap[m.teen_id].total++
    if (m.status === 'approved') countMap[m.teen_id].approved++
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black font-outfit text-white">Usuários</h1>
        <p className="text-gray-500 text-sm mt-1">{profiles?.length ?? 0} contas registradas</p>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Perfil
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Cadastro
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  XP
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Nível
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Missões
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Autonomia
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Streak
                </th>
                <th className="px-4 py-3 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {profiles?.map((p) => {
                const xp = xpMap[p.id]
                const counts = countMap[p.id]
                return (
                  <tr key={p.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${ROLE_COLOR[p.role] ?? 'bg-gray-700 text-gray-400'}`}
                      >
                        {ROLE_LABEL[p.role] ?? p.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{fmt(p.created_at)}</td>
                    <td className="px-4 py-3 text-xp-gold font-bold">{xp?.total_xp ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-300">{xp?.current_level ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {counts ? `${counts.approved} / ${counts.total}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {xp ? `${xp.autonomy_index}%` : '—'}
                    </td>
                    <td className="px-4 py-3 text-orange-400">
                      {xp ? `🔥 ${xp.current_streak}d` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DeleteUserButton userId={p.id} userName={p.name} />
                    </td>
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
