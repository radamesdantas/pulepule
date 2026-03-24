'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const CONTEXT_LABELS: Record<string, string> = {
  family: '👨‍👩‍👦 Família',
  school: '🏫 Escola',
  community: '🌍 Comunidade',
  company: '🏢 Empresa',
}

interface Props {
  params: Promise<{ id: string }>
}

export default function SubmitMissionPage({ params }: Props) {
  const router = useRouter()
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [missionId, setMissionId] = useState<string | null>(null)
  const [mission, setMission] = useState<{ title: string; description: string; context: string; xp_reward: number } | null>(null)

  useEffect(() => {
    params.then(async ({ id }) => {
      setMissionId(id)
      const supabase = createClient()
      const { data } = await supabase
        .from('missions')
        .select('title, description, context, xp_reward')
        .eq('id', id)
        .single()
      if (data) setMission(data as { title: string; description: string; context: string; xp_reward: number })
    })
  }, [params])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim() || description.trim().length < 20) {
      setError('Descreva sua entrega com pelo menos 20 caracteres.')
      return
    }
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !missionId) { setLoading(false); return }

    const { error: err } = await supabase
      .from('teen_missions')
      .upsert({
        teen_id: user.id,
        mission_id: missionId,
        status: 'submitted',
        evidence_description: description.trim(),
      }, { onConflict: 'teen_id,mission_id' })

    if (err) {
      setError('Erro ao enviar entrega. Tente novamente.')
      setLoading(false)
      return
    }

    router.push('/teen?submitted=1')
  }

  if (!mission) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-4 border-teen-purple border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/missions" className="text-gray-400 hover:text-gray-600 transition-colors">
          ← Voltar
        </Link>
      </div>

      {/* Missão */}
      <div className="bg-gradient-to-r from-teen-purple to-parent-blue rounded-2xl p-6 text-white">
        <p className="text-white/70 text-sm mb-1">{CONTEXT_LABELS[mission.context]}</p>
        <h1 className="text-2xl font-black" style={{ fontFamily: 'Outfit, sans-serif' }}>
          {mission.title}
        </h1>
        <p className="text-white/80 text-sm mt-2 leading-relaxed">{mission.description}</p>
        <div className="mt-3 inline-flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-sm font-bold">
          ⚡ +{mission.xp_reward} XP ao ser aprovado
        </div>
      </div>

      {/* Formulário de entrega */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-black text-gray-800 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Enviar Entrega 📤
        </h2>
        <p className="text-gray-500 text-sm mb-5">
          Descreva o que você fez, como fez e qual foi o resultado. Seja específico!
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              O que você fez? <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Descreva detalhadamente o que fez, como executou a missão e qual foi o resultado ou impacto que percebeu..."
              rows={6}
              required
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm focus:outline-none focus:border-teen-purple transition-colors resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{description.length} caracteres (mínimo 20)</p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
            <p className="font-semibold mb-1">💡 Dicas para uma boa entrega:</p>
            <ul className="space-y-0.5 text-blue-600">
              <li>• Descreva especificamente o que você fez</li>
              <li>• Mencione quem esteve envolvido</li>
              <li>• Fale sobre os desafios e como os superou</li>
              <li>• Compartilhe o resultado e o que aprendeu</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading || description.trim().length < 20}
            className="w-full bg-gradient-to-r from-teen-purple to-parent-blue text-white font-bold text-lg py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-teen-purple/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {loading ? 'Enviando...' : 'Enviar para Avaliação 🚀'}
          </button>
        </form>
      </div>
    </div>
  )
}
