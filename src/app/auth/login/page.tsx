'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import EagleMascot from '@/components/EagleMascot'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(
        authError.message === 'Invalid login credentials'
          ? 'Email ou senha incorretos. Verifique e tente novamente.'
          : 'Não foi possível entrar. Tente novamente em instantes.'
      )
      setLoading(false)
      return
    }

    const meta = data.user?.user_metadata
    const onboarded = meta?.onboarded
    const role = meta?.role ?? 'teen'

    if (!onboarded) {
      router.push('/onboarding')
    } else {
      const dest = role === 'parent' ? '/parent' : role === 'mentor' ? '/mentor' : '/teen'
      router.push(dest)
    }
    router.refresh()
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
            <EagleMascot width={90} height={108} />
            <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Pule Pule
            </h1>
          </Link>
          <p className="text-white/70 mt-1">Entre na sua conta</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-black text-gray-800 mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Entrar
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
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
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm focus:outline-none focus:border-teen-purple transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teen-purple to-parent-blue text-white font-bold text-lg py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-teen-purple/30 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 mt-2"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 space-y-3 text-center">
            <Link href="/auth/reset-password" className="block text-sm text-gray-400 hover:text-teen-purple transition-colors">
              Esqueci minha senha
            </Link>
            <p className="text-gray-500 text-sm">
              Não tem conta?{' '}
              <Link href="/auth/signup" className="text-teen-purple font-semibold hover:underline">
                Criar conta grátis
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-white/50 text-xs mt-6">© 2026 Pule Pule. Todos os direitos reservados.</p>
      </div>
    </div>
  )
}
