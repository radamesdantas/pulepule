'use client'

import Link from 'next/link'
import { useState } from 'react'
import EagleMascot from '@/components/EagleMascot'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    })

    if (err) {
      setError('Não foi possível enviar o email. Verifique o endereço e tente novamente.')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teen-purple via-purple-600 to-parent-blue flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 shadow-2xl text-center max-w-md w-full">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Email enviado!
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Verifique sua caixa de entrada e clique no link para redefinir sua senha.
          </p>
          <Link href="/auth/login" className="text-teen-purple font-semibold hover:underline text-sm">
            ← Voltar para o login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teen-purple via-purple-600 to-parent-blue flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-parent-blue/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-1">
            <EagleMascot width={70} height={84} />
            <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Pule Pule
            </h1>
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-black text-gray-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Esqueceu sua senha?
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Informe seu email e enviaremos um link para redefinir sua senha.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="seu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm focus:outline-none focus:border-teen-purple transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teen-purple to-parent-blue text-white font-bold text-lg py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-teen-purple/30 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {loading ? 'Enviando...' : 'Enviar link de recuperação'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-sm text-teen-purple font-semibold hover:underline">
              ← Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
