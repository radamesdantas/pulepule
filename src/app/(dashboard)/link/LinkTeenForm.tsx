'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LinkTeenForm({ parentId }: { parentId: string }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const supabase = createClient()

    // Busca o teen pelo email
    const { data: teen, error: findErr } = await supabase
      .from('profiles')
      .select('id, name, role')
      .eq('email', email.trim().toLowerCase())
      .eq('role', 'teen')
      .single()

    if (findErr || !teen) {
      setError('Nenhum adolescente encontrado com esse email. Verifique se ele já criou a conta.')
      setLoading(false)
      return
    }

    // Cria o vínculo
    const { error: linkErr } = await supabase
      .from('parent_teen')
      .insert({ parent_id: parentId, teen_id: teen.id })

    if (linkErr) {
      if (linkErr.code === '23505') {
        setError('Você já está vinculado a este adolescente.')
      } else {
        setError('Erro ao vincular. Tente novamente.')
      }
      setLoading(false)
      return
    }

    setSuccess(`✅ ${teen.name} vinculado com sucesso!`)
    setEmail('')
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-semibold">
            {success}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Email do adolescente
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="email@do.teen.com"
            required
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm focus:outline-none focus:border-teen-purple transition-colors"
          />
          <p className="text-xs text-gray-400 mt-1">
            O adolescente deve ter criado a conta primeiro como "Adolescente".
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-teen-purple to-parent-blue text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Buscando...' : 'Vincular Adolescente 🔗'}
        </button>
      </form>
    </div>
  )
}
