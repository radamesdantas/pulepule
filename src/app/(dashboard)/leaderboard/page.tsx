import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const LEVEL_NAMES = ['Explorador', 'Aprendiz', 'Guerreiro', 'Herói', 'Lenda']
const PHASE_LABELS = ['', 'Descoberta', 'Desenvolvimento', 'Liderança', 'Legado']

function getLevelName(level: number) {
  return LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)]
}

const MEDALS = ['🥇', '🥈', '🥉']

export default async function LeaderboardPage() {
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

  // Busca todos teens com XP
  const { data: xpList } = await supabase
    .from('teen_xp')
    .select('teen_id, total_xp, current_level, current_phase, autonomy_index, current_streak')
    .order('total_xp', { ascending: false })
    .limit(20)

  const teenIds = xpList?.map((x) => x.teen_id) ?? []

  const { data: profiles } =
    teenIds.length > 0
      ? await supabase.from('profiles').select('id, name').in('id', teenIds)
      : { data: [] }

  const nameMap = new Map(profiles?.map((p) => [p.id, p.name]) ?? [])

  const ranked = (xpList ?? []).map((x, i) => ({
    rank: i + 1,
    name: nameMap.get(x.teen_id) ?? 'Teen',
    totalXp: x.total_xp,
    level: x.current_level,
    phase: x.current_phase,
    streak: x.current_streak,
    autonomy: x.autonomy_index,
    isMe: x.teen_id === user.id,
  }))

  const myRank = ranked.find((r) => r.isMe)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800">Ranking 🏆</h1>
        <p className="text-gray-500 text-sm mt-1">Top teens por XP total</p>
      </div>

      {/* Minha posição */}
      {myRank && (
        <div className="bg-gradient-to-r from-teen-purple to-parent-blue rounded-2xl p-5 text-white">
          <p className="text-white/70 text-sm mb-1">Sua posição</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-black">#{myRank.rank}</span>
              <div>
                <p className="font-black text-lg">
                  {getLevelName(myRank.level)} — Nível {myRank.level}
                </p>
                <p className="text-white/70 text-sm">
                  Fase {myRank.phase} — {PHASE_LABELS[myRank.phase]}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black">{myRank.totalXp.toLocaleString('pt-BR')}</p>
              <p className="text-white/60 text-xs">XP Total</p>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 */}
      {ranked.length >= 3 && (
        <div className="grid grid-cols-3 gap-3">
          {/* 2º */}
          <div
            className={`bg-white rounded-2xl p-4 shadow-sm border text-center mt-4 ${ranked[1]?.isMe ? 'border-teen-purple ring-2 ring-teen-purple/30' : 'border-gray-100'}`}
          >
            <p className="text-2xl mb-1">🥈</p>
            <p className="font-black text-sm text-gray-800 truncate">
              {ranked[1]?.name.split(' ')[0]}
            </p>
            <p className="text-xs font-bold text-xp-gold mt-1">
              {ranked[1]?.totalXp.toLocaleString('pt-BR')} XP
            </p>
            <p className="text-[10px] text-gray-400">Nível {ranked[1]?.level}</p>
          </div>
          {/* 1º */}
          <div
            className={`bg-white rounded-2xl p-4 shadow-sm border text-center -mt-2 ${ranked[0]?.isMe ? 'border-teen-purple ring-2 ring-teen-purple/30' : 'border-yellow-200'}`}
          >
            <p className="text-3xl mb-1">🥇</p>
            <p className="font-black text-sm text-gray-800 truncate">
              {ranked[0]?.name.split(' ')[0]}
            </p>
            <p className="text-xs font-bold text-xp-gold mt-1">
              {ranked[0]?.totalXp.toLocaleString('pt-BR')} XP
            </p>
            <p className="text-[10px] text-gray-400">Nível {ranked[0]?.level}</p>
          </div>
          {/* 3º */}
          <div
            className={`bg-white rounded-2xl p-4 shadow-sm border text-center mt-4 ${ranked[2]?.isMe ? 'border-teen-purple ring-2 ring-teen-purple/30' : 'border-gray-100'}`}
          >
            <p className="text-2xl mb-1">🥉</p>
            <p className="font-black text-sm text-gray-800 truncate">
              {ranked[2]?.name.split(' ')[0]}
            </p>
            <p className="text-xs font-bold text-xp-gold mt-1">
              {ranked[2]?.totalXp.toLocaleString('pt-BR')} XP
            </p>
            <p className="text-[10px] text-gray-400">Nível {ranked[2]?.level}</p>
          </div>
        </div>
      )}

      {/* Lista completa */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="font-black text-gray-800">Todos os Rankings</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {ranked.map((r) => (
            <div
              key={r.rank}
              className={`flex items-center gap-4 px-5 py-3 transition-colors ${r.isMe ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
            >
              <div className="w-8 text-center">
                {r.rank <= 3 ? (
                  <span className="text-xl">{MEDALS[r.rank - 1]}</span>
                ) : (
                  <span className="text-sm font-black text-gray-400">#{r.rank}</span>
                )}
              </div>

              <div className="w-9 h-9 bg-gradient-to-br from-teen-purple to-parent-blue rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">
                {r.name[0]?.toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={`font-bold text-sm truncate ${r.isMe ? 'text-teen-purple' : 'text-gray-800'}`}
                  >
                    {r.name} {r.isMe && <span className="text-xs font-normal">(você)</span>}
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  {getLevelName(r.level)} · Fase {r.phase} · 🔥 {r.streak} dias
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className="font-black text-sm text-xp-gold">
                  {r.totalXp.toLocaleString('pt-BR')} XP
                </p>
                <p className="text-[10px] text-gray-400">Nível {r.level}</p>
              </div>
            </div>
          ))}

          {ranked.length === 0 && (
            <div className="p-10 text-center">
              <p className="text-4xl mb-3">🌱</p>
              <p className="font-bold text-gray-700">Nenhum teen no ranking ainda</p>
              <p className="text-sm text-gray-400 mt-1">Complete missões para aparecer aqui!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
