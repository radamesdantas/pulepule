import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  // Perfil pode ser null se o trigger de criação falhou — redireciona para onboarding
  if (!profile) redirect('/onboarding')

  const role = profile.role ?? user.user_metadata?.role ?? 'teen'

  const { data: xp } =
    role === 'teen'
      ? await supabase.from('teen_xp').select('*').eq('teen_id', user.id).single()
      : { data: null }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800">Meu Perfil</h1>
        <p className="text-gray-500 text-sm mt-1">Gerencie suas informações pessoais</p>
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

      <ProfileForm profile={profile} />
    </div>
  )
}
