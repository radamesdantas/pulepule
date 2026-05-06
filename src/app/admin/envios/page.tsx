import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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

function fmt(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function AdminEnvios() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.role !== 'admin') redirect('/auth/login')

  const { data: submissions } = await supabase
    .from('teen_missions')
    .select('*')
    .order('updated_at', { ascending: false })

  const teenIds = [...new Set(submissions?.map((s) => s.teen_id) ?? [])]
  const missionIds = [...new Set(submissions?.map((s) => s.mission_id) ?? [])]

  const [{ data: profiles }, { data: missions }] = await Promise.all([
    supabase.from('profiles').select('id, name, email').in('id', teenIds),
    supabase
      .from('missions')
      .select('id, title, context, phase, month, competency_id')
      .in('id', missionIds),
  ])

  const compIds = [...new Set(missions?.map((m) => m.competency_id) ?? [])]
  const { data: competencies } = await supabase
    .from('competencies')
    .select('id, name')
    .in('id', compIds)

  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]))
  const missionMap = Object.fromEntries((missions ?? []).map((m) => [m.id, m]))
  const compMap = Object.fromEntries((competencies ?? []).map((c) => [c.id, c.name]))

  const CONTEXT_PT: Record<string, string> = {
    family: 'Família',
    school: 'Escola',
    community: 'Comunidade',
    company: 'Empresa',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black font-outfit text-white">Envios</h1>
          <p className="text-gray-500 text-sm mt-1">
            {submissions?.length ?? 0} registros no total
          </p>
        </div>
        <div className="flex gap-2 text-xs text-gray-500">
          {Object.entries(STATUS_LABEL).map(([k, v]) => (
            <span key={k} className={`px-2 py-1 rounded-full font-medium ${STATUS_COLOR[k]}`}>
              {v}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Jovem
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Comportamento
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Competência
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Contexto
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Enviado em
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-72">
                  Texto enviado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {submissions?.map((sub) => {
                const profile = profileMap[sub.teen_id]
                const mission = missionMap[sub.mission_id]
                const compName = mission ? compMap[mission.competency_id] : '—'
                return (
                  <tr key={sub.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{profile?.name ?? '—'}</p>
                      <p className="text-xs text-gray-500">{profile?.email ?? '—'}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{mission?.title ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-400">{compName ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {mission ? (CONTEXT_PT[mission.context] ?? mission.context) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[sub.status] ?? 'bg-gray-700 text-gray-400'}`}
                      >
                        {STATUS_LABEL[sub.status] ?? sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {fmt(sub.updated_at)}
                    </td>
                    <td className="px-4 py-3">
                      {sub.evidence_description ? (
                        <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">
                          {sub.evidence_description}
                        </p>
                      ) : (
                        <span className="text-gray-700 text-xs">Sem texto</span>
                      )}
                      {sub.mentor_feedback && (
                        <p className="text-parent-blue text-xs mt-1 line-clamp-2">
                          ↳ {sub.mentor_feedback}
                        </p>
                      )}
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
