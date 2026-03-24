import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const PHASE_LABELS = ['', 'Descoberta', 'Desenvolvimento', 'Liderança', 'Legado']
const LEVEL_NAMES = ['Explorador', 'Aprendiz', 'Guerreiro', 'Herói', 'Lenda']

function getLevelName(level: number) {
  return LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)]
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: 'bg-gray-100 text-gray-600' },
  in_progress: { label: 'Em progresso', color: 'bg-blue-100 text-blue-600' },
  submitted: { label: 'Aguardando revisão', color: 'bg-yellow-100 text-yellow-700' },
  approved: { label: 'Aprovada ✓', color: 'bg-green-100 text-green-700' },
  rejected: { label: 'Revisar', color: 'bg-red-100 text-red-600' },
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function ParentTeenDetailPage({ params }: Props) {
  const { id: teenId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'parent') redirect('/auth/login')

  // Verifica vínculo pai-teen
  const { data: link } = await supabase
    .from('parent_teen')
    .select('teen_id')
    .eq('parent_id', user.id)
    .eq('teen_id', teenId)
    .single()

  if (!link) notFound()

  const { data: teen } = await supabase.from('profiles').select('*').eq('id', teenId).single()
  if (!teen) notFound()

  const { data: xp } = await supabase.from('teen_xp').select('*').eq('teen_id', teenId).single()

  const { data: missions } = await supabase
    .from('teen_missions')
    .select('*, mission:missions(title, xp_reward, context, month, phase)')
    .eq('teen_id', teenId)
    .order('created_at', { ascending: false })

  const approved = missions?.filter(m => m.status === 'approved') ?? []
  const submitted = missions?.filter(m => m.status === 'submitted') ?? []
  const inProgress = missions?.filter(m => m.status === 'in_progress') ?? []

  const totalXp = xp?.total_xp ?? 0
  const level = xp?.current_level ?? 1
  const phase = xp?.current_phase ?? 1
  const streak = xp?.current_streak ?? 0
  const autonomy = xp?.autonomy_index ?? 0

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/parent" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
          ← Voltar
        </Link>
      </div>

      {/* Header teen */}
      <div className="bg-gradient-to-r from-teen-purple to-parent-blue rounded-3xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/70 text-sm">Acompanhando</p>
            <h1 className="text-3xl font-black" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {teen.name}
            </h1>
            <p className="text-white/80 text-sm mt-1">
              {getLevelName(level)} — Nível {level} · Fase {phase} {PHASE_LABELS[phase]}
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black">{autonomy}%</p>
            <p className="text-white/60 text-xs">Autonomia</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="bg-white/15 rounded-2xl p-3 text-center">
            <p className="text-2xl font-black">⚡ {totalXp.toLocaleString('pt-BR')}</p>
            <p className="text-white/60 text-xs mt-0.5">XP Total</p>
          </div>
          <div className="bg-white/15 rounded-2xl p-3 text-center">
            <p className="text-2xl font-black">🔥 {streak}</p>
            <p className="text-white/60 text-xs mt-0.5">Dias seguidos</p>
          </div>
          <div className="bg-white/15 rounded-2xl p-3 text-center">
            <p className="text-2xl font-black">✅ {approved.length}</p>
            <p className="text-white/60 text-xs mt-0.5">Missões OK</p>
          </div>
        </div>
      </div>

      {/* Missões aguardando aprovação do mentor */}
      {submitted.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
          <h3 className="font-black text-yellow-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
            ⏳ Aguardando avaliação ({submitted.length})
          </h3>
          <div className="space-y-2">
            {submitted.map((tm) => {
              const m = (Array.isArray(tm.mission) ? tm.mission[0] : tm.mission) as { title: string; xp_reward: number } | null
              return (
                <div key={tm.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5">
                  <p className="text-sm font-semibold text-gray-800">{m?.title}</p>
                  <span className="text-xs font-bold text-xp-gold">+{m?.xp_reward} XP</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Em progresso */}
      {inProgress.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <h3 className="font-black text-blue-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
            🚀 Em andamento ({inProgress.length})
          </h3>
          <div className="space-y-2">
            {inProgress.map((tm) => {
              const m = (Array.isArray(tm.mission) ? tm.mission[0] : tm.mission) as { title: string } | null
              return (
                <div key={tm.id} className="bg-white rounded-xl px-4 py-2.5">
                  <p className="text-sm font-semibold text-gray-800">{m?.title}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Histórico de missões */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="font-black text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Todas as Missões
          </h3>
        </div>

        {missions && missions.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {missions.map((tm) => {
              const m = (Array.isArray(tm.mission) ? tm.mission[0] : tm.mission) as { title: string; xp_reward: number; context: string; month: number } | null
              const s = STATUS_MAP[tm.status] ?? STATUS_MAP.pending
              return (
                <div key={tm.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{m?.title}</p>
                    <p className="text-xs text-gray-400">Mês {m?.month}</p>
                    {tm.status === 'rejected' && tm.mentor_feedback && (
                      <p className="text-xs text-red-500 mt-0.5">↩ {tm.mentor_feedback}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
                    {tm.status === 'approved' && (
                      <span className="text-xs font-bold text-xp-gold">+{m?.xp_reward} XP</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-10 text-center">
            <p className="text-4xl mb-3">🌱</p>
            <p className="font-bold text-gray-700">Nenhuma missão iniciada</p>
          </div>
        )}
      </div>

      {/* Badges */}
      {xp?.badges && (xp.badges as string[]).length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Conquistas 🏆
          </h3>
          <div className="flex flex-wrap gap-2">
            {(xp.badges as string[]).map((badge) => (
              <span key={badge} className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
