'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface BehaviorData {
  id: string
  number: number
  total: number
  title: string
  description: string
  example: string
  competencyName: string
  competencyIcon: string
  xpReward: number
  status: 'locked' | 'available' | 'in_progress' | 'completed'
  missionId?: string
  evidenceUrl?: string | null
  mentorFeedback?: string | null
}

interface Props {
  behavior: BehaviorData | null
  userId: string
  onClose: () => void
  onRefresh: () => void
}

export default function BehaviorModal({ behavior, userId, onClose, onRefresh }: Props) {
  const [narration, setNarration] = useState('')
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(false)
  const [error, setError] = useState('')
  const [rejected, setRejected] = useState(false)
  const [rejectionFeedback, setRejectionFeedback] = useState('')
  const [approved, setApproved] = useState(false)
  const [xpGained, setXpGained] = useState(0)
  const [localStatus, setLocalStatus] = useState<string | null>(null)

  if (!behavior) return null

  const currentStatus = (localStatus ?? behavior.status) as
    | 'locked'
    | 'available'
    | 'in_progress'
    | 'completed'

  async function handleStart() {
    if (!behavior?.missionId) return
    // Se já tem narração suficiente, valida direto — a API faz o auto-start
    if (narration.trim().length >= 20) {
      setLocalStatus('in_progress')
      await handleValidate()
      return
    }
    // Sem narração suficiente: apenas inicia a missão
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase
      .from('teen_missions')
      .upsert(
        { teen_id: userId, mission_id: behavior.missionId, status: 'in_progress' },
        { onConflict: 'teen_id,mission_id' }
      )
    setLoading(false)
    if (err) {
      setError('Erro ao iniciar comportamento. Tente novamente.')
      return
    }
    setLocalStatus('in_progress')
    onRefresh()
  }

  async function handleValidate() {
    if (!behavior?.missionId) return
    if (narration.trim().length < 20) {
      setError('Descreva com pelo menos 20 caracteres.')
      return
    }

    setValidating(true)
    setError('')
    setRejected(false)
    setRejectionFeedback('')

    try {
      const res = await fetch(`/api/missions/${behavior.missionId}/validate-narration`, {
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
        setXpGained(data.xpReward ?? behavior.xpReward)
        setApproved(true)
        setTimeout(() => {
          onRefresh()
          onClose()
        }, 3000)
      } else {
        setRejected(true)
        setRejectionFeedback(data.feedback ?? 'Tente detalhar melhor sua narração.')
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
    }

    setValidating(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-gray-900 w-full md:max-w-lg md:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teen-purple to-parent-blue p-6 md:rounded-t-3xl rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-xl"
          >
            ✕
          </button>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{behavior.competencyIcon}</span>
              <span className="text-white/70 text-sm font-semibold">{behavior.competencyName}</span>
            </div>
            <span className="bg-white/20 rounded-full px-2.5 py-0.5 text-xs font-black text-white/90 tabular-nums">
              #{behavior.number} <span className="font-normal opacity-60">/ {behavior.total}</span>
            </span>
          </div>
          <h2 className="text-xl font-black text-white tracking-display font-outfit">
            {behavior.title}
          </h2>
          <div className="mt-2 inline-flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-sm font-bold text-white">
            ⚡ +{behavior.xpReward} XP
          </div>
        </div>

        {/* Aprovado pela IA */}
        {approved ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-xl font-black text-white mb-1 tracking-display font-outfit">
              Comportamento aprovado!
            </h3>
            <div className="mt-3 inline-flex items-center gap-1 bg-xp-gold/20 border border-xp-gold/30 rounded-full px-4 py-2 text-xp-gold font-black text-lg">
              +{xpGained} XP
            </div>
            <p className="text-gray-400 text-sm mt-3">Sua jornada continua. Bom trabalho!</p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* Feedback de rejeição */}
            {rejected && rejectionFeedback && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">💬</span>
                  <h3 className="font-bold text-amber-300 text-sm">Precisa melhorar</h3>
                </div>
                <p className="text-amber-200/80 text-sm leading-relaxed">{rejectionFeedback}</p>
              </div>
            )}

            {/* Descrição da missão */}
            <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📋</span>
                <h3 className="font-bold text-white text-sm">O que fazer</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{behavior.description}</p>
            </div>

            {/* Exemplo */}
            {behavior.example && (
              <div className="bg-amber-500/10 rounded-2xl p-4 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">💡</span>
                  <h3 className="font-bold text-amber-300 text-sm">Exemplo prático</h3>
                </div>
                <p className="text-amber-200/80 text-sm leading-relaxed italic">
                  {behavior.example}
                </p>
              </div>
            )}

            {/* Baú de XP */}
            <div className="bg-xp-gold/10 rounded-2xl p-4 border border-xp-gold/20 text-center">
              <span className="text-4xl">{currentStatus === 'completed' ? '✅' : '🎁'}</span>
              <p className="text-xp-gold font-black text-2xl mt-1">
                {currentStatus === 'completed' ? 'XP coletado!' : `+${behavior.xpReward} XP`}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {currentStatus === 'completed'
                  ? 'Parabéns pela conquista!'
                  : 'Aprovado pela IA ao completar'}
              </p>
            </div>

            {/* Campo de narração (available e in_progress) */}
            {(currentStatus === 'available' || currentStatus === 'in_progress') && (
              <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">✍️</span>
                  <h3 className="font-bold text-white text-sm">Narre o que você fez</h3>
                </div>

                <textarea
                  value={narration}
                  onChange={(e) => {
                    setNarration(e.target.value)
                    if (rejected) setRejected(false)
                  }}
                  placeholder="Descreva especificamente o que você fez, como executou e qual foi o resultado ou impacto..."
                  rows={4}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teen-purple resize-none"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {narration.length} caracteres (mínimo 20)
                </p>
              </div>
            )}

            {behavior.mentorFeedback && (
              <div className="bg-parent-blue/10 rounded-2xl p-4 border border-parent-blue/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">💬</span>
                  <h3 className="font-bold text-parent-blue text-sm">Feedback recebido</h3>
                </div>
                <p className="text-blue-200/80 text-sm">{behavior.mentorFeedback}</p>
              </div>
            )}

            {/* Botões de ação */}
            <div className="pt-2">
              {currentStatus === 'available' && (
                <button
                  onClick={handleStart}
                  disabled={loading || validating}
                  className="w-full bg-gradient-to-r from-teen-purple to-parent-blue text-white font-bold text-base py-4 rounded-2xl hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading || validating ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {validating ? 'Analisando com IA...' : 'Iniciando...'}
                    </span>
                  ) : narration.trim().length >= 20 ? (
                    'Validar com IA ✨'
                  ) : (
                    'Iniciar Comportamento 🚀'
                  )}
                </button>
              )}

              {currentStatus === 'in_progress' && (
                <button
                  onClick={handleValidate}
                  disabled={validating || narration.trim().length < 20}
                  className="w-full bg-gradient-to-r from-teen-purple to-parent-blue text-white font-bold text-base py-4 rounded-2xl hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
                >
                  {validating ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analisando com IA...
                    </span>
                  ) : rejected ? (
                    'Tentar novamente 🔄'
                  ) : (
                    'Validar com IA ✨'
                  )}
                </button>
              )}

              {currentStatus === 'completed' && (
                <div className="text-center py-3">
                  <span className="bg-level-up/20 text-level-up font-bold text-sm px-6 py-2 rounded-full">
                    Concluído ✓
                  </span>
                </div>
              )}

              {currentStatus === 'locked' && (
                <p className="text-center text-gray-500 text-sm py-3">
                  🔒 Complete o anterior para desbloquear
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
