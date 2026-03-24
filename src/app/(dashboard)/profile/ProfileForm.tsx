'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types/database'

export default function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter()
  const [name, setName] = useState(profile.name)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('Nome não pode ser vazio.'); return }
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: err } = await supabase
      .from('profiles')
      .update({ name: name.trim(), updated_at: new Date().toISOString() })
      .eq('id', profile.id)

    if (err) {
      setError('Erro ao salvar. Tente novamente.')
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      router.refresh()
    }
    setLoading(false)
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
      <h3 className="font-black text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
        Editar Informações
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-semibold">
          ✅ Perfil atualizado com sucesso!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nome</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm focus:outline-none focus:border-teen-purple transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-gray-400 text-sm bg-gray-50 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">O email não pode ser alterado.</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Papel</label>
          <input
            type="text"
            value={profile.role === 'teen' ? '🦅 Adolescente' : profile.role === 'parent' ? '👨‍👩‍👦 Pai/Mãe' : '🌟 Mentor'}
            disabled
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-gray-400 text-sm bg-gray-50 cursor-not-allowed"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teen-purple text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-60"
        >
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>

      <div className="pt-3 border-t border-gray-100">
        <button
          onClick={handleSignOut}
          className="w-full text-red-500 font-semibold text-sm py-2 rounded-xl hover:bg-red-50 transition-colors"
        >
          Sair da conta
        </button>
      </div>
    </div>
  )
}
