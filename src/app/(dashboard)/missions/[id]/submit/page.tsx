'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const CONTEXT_LABELS: Record<string, { label: string; icon: string }> = {
  escola: { label: 'Escola', icon: '🏫' },
  familia: { label: 'Família', icon: '👨‍👩‍👦' },
  amigos: { label: 'Amigos', icon: '👫' },
  casa: { label: 'Casa', icon: '🏠' },
  pessoal: { label: 'Pessoal', icon: '🧍' },
}

const CONTEXT_EXAMPLES: Record<string, string> = {
  escola:
    'Ex: "Liderei meu grupo no trabalho de ciências. Dividi as tarefas, criei um cronograma e apresentamos o melhor trabalho da turma."',
  familia:
    'Ex: "Organizei uma reunião familiar no domingo para discutir as tarefas da semana. Cada pessoa escolheu sua responsabilidade e montamos um quadro na geladeira."',
  amigos:
    'Ex: "Com a Ana, que é direta, fui reto ao ponto. Com o Lucas, mais sensível, comecei perguntando como ele estava antes de falar o que precisava."',
  casa: 'Ex: "Organizei as rotinas domésticas da semana com minha família. Cada um escolheu sua responsabilidade e combinamos como acompanhar o progresso."',
  pessoal:
    'Ex: "Defini um objetivo claro para o mês, criei um plano com etapas e acompanhei meu progresso semanalmente até concluir."',
}

interface MissionData {
  title: string
  description: string
  context: string
  xp_reward: number
  month: number
  competency: { name: string; icon: string; description: string } | null
}

interface Props {
  params: Promise<{ id: string }>
}

export default function SubmitMissionPage({ params }: Props) {
  const router = useRouter()
  const [narration, setNarration] = useState('')
  const [validating, setValidating] = useState(false)
  const [error, setError] = useState('')
  const [rejected, setRejected] = useState(false)
  const [rejectionFeedback, setRejectionFeedback] = useState('')
  const [approved, setApproved] = useState(false)
  const [xpGained, setXpGained] = useState(0)
  const [missionId, setMissionId] = useState<string | null>(null)
  const [mission, setMission] = useState<MissionData | null>(null)

  useEffect(() => {
    params.then(async ({ id }) => {
      setMissionId(id)
      const supabase = createClient()
      const { data } = await supabase
        .from('missions')
        .select(
          'title, description, context, xp_reward, month, competency:competencies(name, icon, description)'
        )
        .eq('id', id)
        .single()
      if (data) setMission(data as unknown as MissionData)
    })
  }, [params])

  async function handleValidate(e: React.FormEvent) {
    e.preventDefault()
    if (!missionId) return
    if (narration.trim().length < 20) {
      setError('Descreva sua entrega com pelo menos 20 caracteres.')
      return
    }

    setError('')
    setRejected(false)
    setRejectionFeedback('')
    setValidating(true)

    try {
      const res = await fetch(`/api/missions/${missionId}/validate-narration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ narration: narration.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Erro ao validar. Tente novamente.')
        setValidating(false)
        return
      }

      if (data.approved) {
        setXpGained(data.xpReward ?? mission?.xp_reward ?? 0)
        setApproved(true)
        setTimeout(() => router.push('/missions'), 3000)
      } else {
        setRejected(true)
        setRejectionFeedback(data.feedback ?? 'Tente detalhar melhor sua narração.')
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
    }

    setValidating(false)
  }

  if (!mission) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-4 border-teen-purple border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (approved) {
    return (
      <div className="max-w-md mx-auto pt-16 text-center">
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Comportamento aprovado!</h2>
          <div className="mt-3 inline-flex items-center gap-1 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-full px-4 py-2 text-lg font-black">
            +{xpGained} XP
          </div>
          <p className="text-gray-500 text-sm mt-4">Redirecionando para missões...</p>
        </div>
      </div>
    )
  }

  const ctx = CONTEXT_LABELS[mission.context] ?? { label: mission.context, icon: '📋' }
  const example = CONTEXT_EXAMPLES[mission.context] ?? ''
  const comp = mission.competency

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-1">
      <Link
        href="/missions"
        className="inline-flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors text-sm"
      >
        ← Voltar para Missões
      </Link>

      {/* Header da missão */}
      <div className="bg-gradient-to-r from-teen-purple to-parent-blue rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-white/20 rounded-full px-3 py-0.5 text-xs font-semibold">
            {ctx.icon} {ctx.label}
          </span>
          <span className="bg-white/20 rounded-full px-3 py-0.5 text-xs font-semibold">
            Mês {mission.month}
          </span>
        </div>
        <h1 className="text-2xl font-black leading-tight">{mission.title}</h1>
        <div className="mt-3 inline-flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-sm font-bold">
          ⚡ +{mission.xp_reward} XP ao ser aprovado pela IA
        </div>
      </div>

      {/* Descrição */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-black text-gray-800 mb-3 flex items-center gap-2">
          📋 O que você precisava fazer
        </h3>
        <p className="text-gray-600 leading-relaxed">{mission.description}</p>

        {comp && (
          <div className="mt-4 bg-purple-50 border border-purple-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{comp.icon}</span>
              <p className="font-bold text-teen-purple text-sm">Competência: {comp.name}</p>
            </div>
            <p className="text-xs text-purple-600 leading-relaxed">{comp.description}</p>
          </div>
        )}
      </div>

      {/* Exemplo prático */}
      {example && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h3 className="font-black text-amber-800 mb-2 flex items-center gap-2">
            💡 Exemplo prático
          </h3>
          <p className="text-amber-700 text-sm leading-relaxed italic">{example}</p>
        </div>
      )}

      {/* Feedback de rejeição */}
      {rejected && rejectionFeedback && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">💬</span>
            <h3 className="font-black text-orange-800 text-sm">Precisa melhorar</h3>
          </div>
          <p className="text-orange-700 text-sm leading-relaxed">{rejectionFeedback}</p>
        </div>
      )}

      {/* Formulário de narração */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-black text-gray-800 mb-1">Narre o que você fez ✍️</h2>
        <p className="text-gray-500 text-sm mb-5">
          Descreva com detalhes o que você fez, como executou e qual foi o resultado. A IA irá
          analisar e aprovar automaticamente.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleValidate} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              O que você fez? <span className="text-red-400">*</span>
            </label>
            <textarea
              value={narration}
              onChange={(e) => {
                setNarration(e.target.value)
                if (rejected) setRejected(false)
              }}
              placeholder="Descreva detalhadamente o que fez, como executou a missão e qual foi o resultado ou impacto que percebeu..."
              rows={6}
              required
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm focus:outline-none focus:border-teen-purple transition-colors resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{narration.length} caracteres (mínimo 20)</p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
            <p className="font-semibold mb-1">✏️ Dicas para uma boa narração:</p>
            <ul className="space-y-0.5 text-blue-600">
              <li>• Descreva especificamente o que você fez</li>
              <li>• Mencione quem esteve envolvido</li>
              <li>• Fale sobre os desafios e como os superou</li>
              <li>• Compartilhe o resultado e o que aprendeu</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={validating || narration.trim().length < 20}
            className="w-full bg-gradient-to-r from-teen-purple to-parent-blue text-white font-bold text-lg py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-teen-purple/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {validating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analisando com IA...
              </span>
            ) : rejected ? (
              'Tentar novamente 🔄'
            ) : (
              'Validar com IA ✨'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
