'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import EagleMascot from '@/components/EagleMascot'
import { createClient } from '@/lib/supabase/client'
import type { UserRole } from '@/lib/types/database'

const ROLES: { value: UserRole; label: string; icon: string; desc: string }[] = [
  { value: 'teen', label: 'Adolescente', icon: '🦅', desc: '12 a 15 anos' },
  { value: 'parent', label: 'Pai / Mãe', icon: '👨‍👩‍👦', desc: 'Acompanhe o progresso' },
  { value: 'mentor', label: 'Mentor', icon: '🌟', desc: 'Guie jovens líderes' },
]

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('teen')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
      },
    })

    if (authError) {
      setError(
        authError.message.includes('already registered')
          ? 'Este email já está cadastrado. Tente entrar.'
          : 'Não foi possível criar a conta. Tente novamente.'
      )
      setLoading(false)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teen-purple via-purple-600 to-parent-blue flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 shadow-2xl text-center max-w-md w-full">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Quase lá!</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Enviamos um link de confirmação para o seu email.
            <br />
            <strong>Abra seu email e clique no link</strong> para ativar sua conta e começar a
            jornada!
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-purple-700 mb-4">
            <p className="font-semibold mb-1">Não encontrou o email?</p>
            <ul className="text-xs text-purple-600 space-y-0.5 text-left">
              <li>
                • Verifique a pasta de <strong>spam</strong> ou <strong>lixo eletrônico</strong>
              </li>
              <li>
                • O email vem de <strong>noreply@mail.app.supabase.io</strong>
              </li>
              <li>• Pode levar até 2 minutos para chegar</li>
            </ul>
          </div>
          <button
            onClick={() => router.push('/auth/login')}
            className="w-full bg-gradient-to-r from-teen-purple to-parent-blue text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all"
          >
            Já confirmei, ir para Login →
          </button>
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
            <EagleMascot width={90} height={108} />
            <h1 className="text-3xl font-black text-white">Pule Pule</h1>
          </Link>
          <p className="text-white/70 mt-1">Comece sua jornada</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-black text-gray-800 mb-6">Criar conta grátis</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Tipo de conta */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sou um(a)...</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all text-center ${
                      role === r.value
                        ? 'border-teen-purple bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl mb-1">{r.icon}</span>
                    <span className="text-xs font-bold text-gray-800">{r.label}</span>
                    <span className="text-[10px] text-gray-400">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nome completo
              </label>
              <input
                type="text"
                placeholder="Seu nome"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm focus:outline-none focus:border-teen-purple transition-colors"
              />
            </div>
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
                placeholder="Mínimo 6 caracteres"
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
              {loading ? 'Criando conta...' : 'Começar Agora 🚀'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Já tem conta?{' '}
              <Link href="/auth/login" className="text-teen-purple font-semibold hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-white/50 text-xs mt-6">
          © 2026 Pule Pule. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}
