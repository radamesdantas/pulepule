import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import MentorActions from './MentorActions'

const CONTEXT_LABELS: Record<string, string> = {
  family: '👨‍👩‍👦 Família',
  school: '🏫 Escola',
  community: '🌍 Comunidade',
  company: '🏢 Empresa',
}

export default async function MentorDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const role = profile?.role ?? user.user_metadata?.role ?? 'teen'
  if (role !== 'mentor') redirect('/auth/login')

  const { data: submitted } = await supabase
    .from('teen_missions')
    .select('id, evidence_description, evidence_url, mission:missions(title, xp_reward, context), teen:profiles(name)')
    .eq('status', 'submitted')
    .order('created_at', { ascending: true })

  const { data: recentApproved } = await supabase
    .from('teen_missions')
    .select('id, completed_at, mission:missions(title), teen:profiles(name)')
    .eq('status', 'approved')
    .order('completed_at', { ascending: false })
    .limit(5)

  // Stats globais do mentor
  const { count: totalApproved } = await supabase
    .from('teen_missions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'approved')

  const { count: totalTeens } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'teen')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Olá, {profile?.name ?? user.user_metadata?.name ?? 'Usuário'} 🌟
        </h1>
        <p className="text-gray-500 text-sm mt-1">Valide as entregas dos adolescentes</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-yellow-600">{submitted?.length ?? 0}</p>
          <p className="text-sm text-yellow-700 font-semibold">Na fila</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-level-up">{totalApproved ?? 0}</p>
          <p className="text-sm text-green-700 font-semibold">Total aprovadas</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-teen-purple">{totalTeens ?? 0}</p>
          <p className="text-sm text-purple-700 font-semibold">Teens ativos</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-parent-blue">{recentApproved?.length ?? 0}</p>
          <p className="text-sm text-blue-700 font-semibold">Recentes</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="font-black text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Fila de Validação {submitted && submitted.length > 0 && `(${submitted.length})`}
          </h3>
        </div>

        {submitted && submitted.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {submitted.map((tm) => {
              const mission = (Array.isArray(tm.mission) ? tm.mission[0] : tm.mission) as { title: string; xp_reward: number; context: string } | null
              const teen = (Array.isArray(tm.teen) ? tm.teen[0] : tm.teen) as { name: string } | null

              return (
                <div key={tm.id} className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-bold text-gray-800">{mission?.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        por <span className="font-semibold text-teen-purple">{teen?.name}</span>
                        {mission?.context && (
                          <span className="ml-2 text-xs">{CONTEXT_LABELS[mission.context]}</span>
                        )}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-xp-gold shrink-0">+{mission?.xp_reward} XP</span>
                  </div>

                  {(tm.evidence_description || tm.evidence_url) && (
                    <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-2">
                      {tm.evidence_description && (
                        <>
                          <p className="text-xs text-gray-500 font-semibold">Entrega do teen:</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{tm.evidence_description}</p>
                        </>
                      )}
                      {tm.evidence_url && (
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-sm">📎</span>
                          <a
                            href={tm.evidence_url as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-teen-purple font-semibold hover:underline truncate"
                          >
                            Ver arquivo anexado →
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  <MentorActions missionId={tm.id} />
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-10 text-center">
            <p className="text-4xl mb-3">✅</p>
            <p className="font-bold text-gray-700">Tudo em dia!</p>
            <p className="text-sm text-gray-400 mt-1">Nenhuma entrega aguardando revisão.</p>
          </div>
        )}
      </div>

      {recentApproved && recentApproved.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="font-black text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Aprovações Recentes
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {recentApproved.map((tm) => {
              const mission = (Array.isArray(tm.mission) ? tm.mission[0] : tm.mission) as { title: string } | null
              const teen = (Array.isArray(tm.teen) ? tm.teen[0] : tm.teen) as { name: string } | null
              return (
                <div key={tm.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-bold text-gray-700">{mission?.title}</p>
                    <p className="text-xs text-gray-400">{teen?.name}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">Aprovada ✓</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
