import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function CeremonyPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, name')
    .eq('id', user.id)
    .single()

  const role = profile?.role ?? 'teen'
  if (role !== 'teen') redirect('/parent')

  const { data: xp } = await supabase
    .from('teen_xp')
    .select('total_xp, current_level, autonomy_index, badges, current_streak, max_streak')
    .eq('teen_id', user.id)
    .single()

  const { count: approvedCount } = await supabase
    .from('teen_missions')
    .select('id', { count: 'exact', head: true })
    .eq('teen_id', user.id)
    .eq('status', 'approved')

  const totalMissions = 36
  const completed = approvedCount ?? 0
  const progressPct = Math.round((completed / totalMissions) * 100)
  const isComplete = completed >= totalMissions

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Cerimonia de Conclusao</h1>
        <p className="text-gray-400 text-sm mt-1">Sua apresentacao final de lideranca</p>
      </div>

      {/* Hero card */}
      <div
        className={`rounded-3xl p-6 text-center ${isComplete ? 'bg-gradient-to-br from-yellow-600 via-yellow-500 to-amber-400' : 'bg-gradient-to-br from-teen-purple to-parent-blue'}`}
      >
        <div className="text-6xl mb-3">{isComplete ? '🏆' : '🦅'}</div>
        <h2 className="text-xl font-black text-white">{profile?.name}</h2>
        <p className="text-white/80 text-sm mt-1">
          {isComplete
            ? 'Jornada concluida com excelencia!'
            : `${completed} de ${totalMissions} missoes concluidas`}
        </p>

        {!isComplete && (
          <div className="mt-4">
            <div className="bg-white/20 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-white/70 text-xs mt-1">{progressPct}% da jornada completa</p>
          </div>
        )}
      </div>

      {/* Stats da jornada */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
          <p className="text-2xl font-black text-xp-gold">
            {(xp?.total_xp ?? 0).toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">XP Total acumulado</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
          <p className="text-2xl font-black text-white">Nivel {xp?.current_level ?? 1}</p>
          <p className="text-xs text-gray-400 mt-0.5">Nivel de lideranca</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
          <p className="text-2xl font-black text-teen-purple">{xp?.autonomy_index ?? 0}%</p>
          <p className="text-xs text-gray-400 mt-0.5">Indice de autonomia</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
          <p className="text-2xl font-black text-orange-400">{xp?.max_streak ?? 0}</p>
          <p className="text-xs text-gray-400 mt-0.5">Maior sequencia (dias)</p>
        </div>
      </div>

      {/* Conquistas */}
      {(xp?.badges ?? []).length > 0 && (
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <h2 className="font-black text-white mb-3">Conquistas desbloqueadas</h2>
          <div className="flex flex-wrap gap-2">
            {(xp?.badges ?? []).map((b: string) => (
              <span
                key={b}
                className="bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Instrucoes da cerimonia */}
      <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 space-y-4">
        <h2 className="font-black text-white">Sobre a Cerimonia</h2>
        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex gap-3">
            <span className="text-xl shrink-0">🎤</span>
            <div>
              <p className="font-bold text-white">Apresentacao (120 min)</p>
              <p className="text-gray-400 mt-0.5">
                Apresente sua jornada de 12 meses para familia, mentores e convidados.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-xl shrink-0">📋</span>
            <div>
              <p className="font-bold text-white">O que preparar</p>
              <ul className="text-gray-400 mt-0.5 space-y-1 list-disc list-inside">
                <li>3 maiores aprendizados da jornada</li>
                <li>1 projeto de impacto realizado</li>
                <li>Sua visao de futuro como lider</li>
              </ul>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-xl shrink-0">🎖️</span>
            <div>
              <p className="font-bold text-white">Certificado</p>
              <p className="text-gray-400 mt-0.5">
                Ao concluir todas as 36 missoes, voce recebe o certificado de Lider em Formacao.
              </p>
            </div>
          </div>
        </div>
      </div>

      {isComplete && (
        <div className="bg-gradient-to-r from-yellow-600/20 to-amber-500/20 border border-yellow-600/40 rounded-2xl p-5 text-center">
          <p className="text-4xl mb-2">🎉</p>
          <p className="font-black text-yellow-400 text-lg">
            Parabens, {profile?.name?.split(' ')[0]}!
          </p>
          <p className="text-sm text-gray-300 mt-1">
            Voce completou a jornada de 12 meses. Entre em contato com seu mentor para agendar a
            cerimonia.
          </p>
        </div>
      )}
    </div>
  )
}
