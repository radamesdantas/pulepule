'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import EagleMascot from '@/components/EagleMascot'

const STEPS_TEEN = [
  {
    icon: '🦅',
    title: 'Bem-vindo ao Pule Pule!',
    body: 'Você está prestes a começar uma jornada incrível de 12 meses que vai transformar você em um verdadeiro líder.',
    cta: 'Vamos lá!',
  },
  {
    icon: '🎯',
    title: 'Como funciona?',
    body: 'Cada mês você recebe missões reais para cumprir na família, escola, comunidade e empresa. Ao completar, ganha XP e sobe de nível.',
    cta: 'Entendi!',
  },
  {
    icon: '⭐',
    title: '24 Competências',
    body: 'Ao longo da jornada você vai desenvolver 24 competências de gestão e comportamento — as mesmas usadas pelos maiores líderes do mundo.',
    cta: 'Que incrível!',
  },
  {
    icon: '🏆',
    title: 'Sua primeira missão te espera!',
    body: 'Você está na Fase 1 — Descoberta. Comece pelo Mês 1 e mostre do que é capaz. Cada entrega aprovada vale XP real!',
    cta: 'Começar Agora 🚀',
  },
]

const STEPS_PARENT = [
  {
    icon: '👨‍👩‍👦',
    title: 'Bem-vindo, Pai/Mãe!',
    body: 'O Pule Pule conecta você ao desenvolvimento do seu filho(a) em tempo real. Você acompanha tudo e ainda aprova as missões.',
    cta: 'Continuar',
  },
  {
    icon: '🔗',
    title: 'Vincule a conta do seu teen',
    body: 'Para começar, vincule a conta do seu filho(a) pelo email. Ele(a) precisa ter criado a conta primeiro.',
    cta: 'Entendi!',
  },
  {
    icon: '📊',
    title: 'Acompanhe o crescimento',
    body: 'Você vai ver o índice de autonomia, XP acumulado, missões em andamento e pode aprovar as entregas com um clique.',
    cta: 'Pronto para começar!',
  },
]

const STEPS_MENTOR = [
  {
    icon: '🌟',
    title: 'Bem-vindo, Mentor!',
    body: 'Você tem um papel fundamental nessa jornada. Os adolescentes dependem da sua validação para evoluir de fase e ganhar XP.',
    cta: 'Continuar',
  },
  {
    icon: '✅',
    title: 'Sua fila de validações',
    body: 'Quando um teen envia uma entrega, ela aparece na sua fila. Você lê a descrição, aprova ou pede revisão com feedback.',
    cta: 'Entendido!',
  },
  {
    icon: '💪',
    title: 'Impacto real',
    body: 'Cada aprovação sua vale XP real para o teen e contribui para o desenvolvimento de uma competência de liderança. Você faz a diferença!',
    cta: 'Começar a Mentorear 🌟',
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Carrega o papel do usuário
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/auth/login')
        return
      }
      const metaRole = user.user_metadata?.role ?? 'teen'
      setRole(metaRole)
      setLoading(false)
    })
  }, [router])

  const steps = role === 'parent' ? STEPS_PARENT : role === 'mentor' ? STEPS_MENTOR : STEPS_TEEN
  const current = steps[step]
  const isLast = step === steps.length - 1

  async function completeOnboarding() {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const userRole = user.user_metadata?.role ?? 'teen'
    const userName = user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'Usuário'

    // Garante que o profile existe antes de navegar para o dashboard
    await supabase.from('profiles').upsert(
      {
        id: user.id,
        email: user.email,
        name: userName,
        role: userRole,
      },
      { onConflict: 'id' }
    )

    // Cria registro de XP para teens
    if (userRole === 'teen') {
      await supabase.from('teen_xp').upsert(
        {
          teen_id: user.id,
          total_xp: 0,
          current_level: 1,
          current_streak: 0,
          max_streak: 0,
          badges: [],
          current_phase: 1,
          autonomy_index: 0,
        },
        { onConflict: 'teen_id' }
      )
    }

    // Marca onboarding como completo
    await supabase.auth.updateUser({ data: { onboarded: true } })

    const dest = userRole === 'parent' ? '/link' : userRole === 'mentor' ? '/mentor' : '/teen'
    router.push(dest)
    router.refresh()
  }

  async function handleNext() {
    if (isLast) {
      await completeOnboarding()
    } else {
      setStep((s) => s + 1)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-4 border-teen-purple border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto pt-8">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-10">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step
                ? 'w-8 bg-teen-purple'
                : i < step
                  ? 'w-2 bg-teen-purple/40'
                  : 'w-2 bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="flex justify-center mb-6">
          {step === 0 && role === 'teen' ? (
            <EagleMascot width={100} height={120} animate />
          ) : (
            <div className="text-7xl">{current.icon}</div>
          )}
        </div>

        <h2 className="text-2xl font-black text-gray-800 mb-3">{current.title}</h2>
        <p className="text-gray-500 leading-relaxed mb-8">{current.body}</p>

        <button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-teen-purple to-parent-blue text-white font-bold text-lg py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-teen-purple/30 active:scale-95"
        >
          {current.cta}
        </button>

        {!isLast && (
          <button
            onClick={completeOnboarding}
            className="mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Pular introdução
          </button>
        )}
      </div>
    </div>
  )
}
