'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import EagleMascot from '@/components/EagleMascot'
import { createClient } from '@/lib/supabase/client'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('As senhas não conferem.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({ password })

    if (err) {
      setError('Não foi possível atualizar a senha. Tente novamente.')
      setLoading(false)
      return
    }

    // Determina destino pelo role do usuário
    const { data: { user } } = await supabase.auth.getUser()
    const role = user?.user_metadata?.role ?? 'teen'
    const dest = role === 'parent' ? '/parent' : role === 'mentor' ? '/mentor' : '/teen'
    router.push(`${dest}?updated=1`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teen-purple via-purple-600 to-parent-blue flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-parent-blue/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center gap-1">
            <EagleMascot width={70} height={84} />
            <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Pule Pule
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-black text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Nova senha
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Escolha uma nova senha para sua conta.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nova senha</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm focus:outline-none focus:border-teen-purple transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirmar senha</label>
              <input
                type="password"
                placeholder="Repita a senha"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={`w-full border-2 rounded-xl px-4 py-3 text-gray-800 text-sm focus:outline-none transition-colors ${
                  confirm && confirm !== password ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-teen-purple'
                }`}
              />
              {confirm && confirm !== password && (
                <p className="text-xs text-red-500 mt-1">As senhas não conferem</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || (confirm.length > 0 && password !== confirm)}
              className="w-full bg-gradient-to-r from-teen-purple to-parent-blue text-white font-bold text-lg py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-teen-purple/30 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {loading ? 'Salvando...' : 'Salvar nova senha 🔐'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
