import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LinkTeenForm from './LinkTeenForm'

export default async function LinkPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const role = profile?.role ?? user.user_metadata?.role ?? 'teen'
  if (role !== 'parent') redirect('/parent')

  // Teen ID do pai é o próprio código de convite
  const { data: links } = await supabase
    .from('parent_teen')
    .select('teen_id, profiles!parent_teen_teen_id_fkey(name, email)')
    .eq('parent_id', user.id)

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Vincular Teen 👦
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Digite o email do seu filho(a) para vincular as contas.
        </p>
      </div>

      <LinkTeenForm parentId={user.id} />

      {/* Teens já vinculados */}
      {links && links.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-800 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Teens vinculados
          </h3>
          <div className="space-y-2">
            {links.map((link) => {
              const teen = link.profiles as unknown as { name: string; email: string } | null
              return (
                <div key={link.teen_id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center font-bold text-teen-purple text-sm">
                    {teen?.name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{teen?.name}</p>
                    <p className="text-xs text-gray-400">{teen?.email}</p>
                  </div>
                  <span className="ml-auto text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                    Vinculado ✓
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
