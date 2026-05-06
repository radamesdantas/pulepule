import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfileForm from './ProfileForm'

const RARITY_STYLE: Record<string, string> = {
  bronze: 'border-amber-600 bg-amber-950/40',
  silver: 'border-gray-400 bg-gray-800/60',
  gold: 'border-yellow-400 bg-yellow-950/40',
  diamond: 'border-cyan-400 bg-cyan-950/40',
}

const RARITY_LABEL: Record<string, string> = {
  bronze: 'Bronze',
  silver: 'Prata',
  gold: 'Ouro',
  diamond: 'Diamante',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  if (!profile) redirect('/onboarding')

  const role = profile.role ?? user.user_metadata?.role ?? 'teen'

  const [xpResult, badgesResult] = await Promise.all([
    role === 'teen'
      ? supabase.from('teen_xp').select('*').eq('teen_id', user.id).single()
      : { data: null },
    role === 'teen'
      ? supabase.from('badge_definitions').select('*').order('sort_order')
      : { data: null },
  ])

  const xp = xpResult.data
  const badgeDefs = badgesResult.data ?? []
  const earnedBadges = new Set<string>(xp?.badges ?? [])

  return (
    <div className="max-w-lg mx-auto space-y-6 px-4 py-6">
      <div>
        <h1 className="text-2xl font-black text-white">Meu Perfil</h1>
        <p className="text-gray-400 text-sm mt-1">Gerencie suas informações pessoais</p>
      </div>

      {/* Avatar + stats */}
      <div className="bg-gradient-to-r from-teen-purple to-parent-blue rounded-2xl p-6 text-white text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl font-black mx-auto mb-3">
          {profile.name?.[0]?.toUpperCase() ?? '?'}
        </div>
        <h2 className="text-xl font-black">{profile.name}</h2>
        <p className="text-white/70 text-sm capitalize mt-1">
          {role === 'teen' ? '🦅 Adolescente' : role === 'parent' ? '👨‍👩‍👦 Pai/Mãe' : '🌟 Mentor'}
        </p>
        {xp && (
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <div>
              <p className="font-black text-2xl">{xp.total_xp.toLocaleString('pt-BR')}</p>
              <p className="text-white/60">XP Total</p>
            </div>
            <div>
              <p className="font-black text-2xl">{xp.current_level}</p>
              <p className="text-white/60">Nível</p>
            </div>
            <div>
              <p className="font-black text-2xl">{xp.autonomy_index}%</p>
              <p className="text-white/60">Autonomia</p>
            </div>
          </div>
        )}
      </div>

      {/* Badge gallery — apenas para teens */}
      {role === 'teen' && badgeDefs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white">Conquistas</h2>
            <span className="text-xs text-gray-400 font-semibold">
              {earnedBadges.size}/{badgeDefs.length} desbloqueadas
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {badgeDefs.map((badge) => {
              const earned = earnedBadges.has(badge.code)
              return (
                <div
                  key={badge.code}
                  className={`rounded-2xl border-2 p-3 flex flex-col items-center gap-1 text-center transition-all ${
                    earned
                      ? RARITY_STYLE[badge.rarity]
                      : 'border-gray-800 bg-gray-900/50 opacity-40'
                  }`}
                  title={earned ? badge.criteria : 'Bloqueado'}
                >
                  <span className={`text-2xl leading-none ${earned ? '' : 'grayscale'}`}>
                    {badge.icon}
                  </span>
                  <p
                    className={`text-[10px] font-bold leading-tight ${earned ? 'text-white' : 'text-gray-500'}`}
                  >
                    {badge.name}
                  </p>
                  {earned && (
                    <span className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                      {RARITY_LABEL[badge.rarity]}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <ProfileForm profile={profile} />
    </div>
  )
}
