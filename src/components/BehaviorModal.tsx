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

// Converte descrição da 1ª pessoa para 3ª pessoa (pt-BR)
function toThirdPerson(text: string): string {
  return (
    text
      // Pronomes possessivos
      .replace(/\bminha\b/g, 'sua')
      .replace(/\bMinha\b/g, 'Sua')
      .replace(/\bminhas\b/g, 'suas')
      .replace(/\bMeus\b/g, 'Seus')
      .replace(/\bmeus\b/g, 'seus')
      .replace(/\bmeu\b/g, 'seu')
      // Pronome sujeito
      .replace(/\beu\b/g, '')
      .replace(/\bEu\b/g, '')
      // Verbos irregulares comuns
      .replace(/\bfaço\b/g, 'faz')
      .replace(/\bFaço\b/g, 'Faz')
      .replace(/\bdigo\b/g, 'diz')
      .replace(/\bDigo\b/g, 'Diz')
      .replace(/\bsou\b/g, 'é')
      .replace(/\bSou\b/g, 'É')
      .replace(/\btenho\b/g, 'tem')
      .replace(/\bTenho\b/g, 'Tem')
      .replace(/\bvou\b/g, 'vai')
      .replace(/\bVou\b/g, 'Vai')
      .replace(/\bposso\b/g, 'pode')
      .replace(/\bPosso\b/g, 'Pode')
      .replace(/\bsigo\b/g, 'segue')
      .replace(/\bSigo\b/g, 'Segue')
      .replace(/\bpeço\b/g, 'pede')
      .replace(/\bPeço\b/g, 'Pede')
      .replace(/\bofereço\b/g, 'oferece')
      .replace(/\bOFereço\b/g, 'Oferece')
      .replace(/\breconheço\b/g, 'reconhece')
      .replace(/\bReconheço\b/g, 'Reconhece')
      .replace(/\bproponho\b/g, 'propõe')
      .replace(/\bProponho\b/g, 'Propõe')
      .replace(/\bassumo\b/g, 'assume')
      .replace(/\bAssumo\b/g, 'Assume')
      .replace(/\bprefiro\b/g, 'prefere')
      .replace(/\bPrefiro\b/g, 'Prefere')
      .replace(/\bmantenho\b/g, 'mantém')
      .replace(/\bMantenho\b/g, 'Mantém')
      .replace(/\bestabeleço\b/g, 'estabelece')
      .replace(/\bEstabeleço\b/g, 'Estabelece')
      .replace(/\bdivido\b/g, 'divide')
      .replace(/\bDivido\b/g, 'Divide')
      .replace(/\bpreciso\b/g, 'precisa')
      .replace(/\bPreciso\b/g, 'Precisa')
      .replace(/\bquero\b/g, 'quer')
      .replace(/\bQuero\b/g, 'Quer')
      // Verbos regulares -ar (1ª p. -o → 3ª p. -a)
      .replace(/\bdiscordo\b/g, 'discorda')
      .replace(/\bexpresso\b/g, 'expressa')
      .replace(/\bidentífico\b/g, 'identifica')
      .replace(/\bidentífico\b/g, 'identifica')
      .replace(/\bbusco\b/g, 'busca')
      .replace(/\bBusco\b/g, 'Busca')
      .replace(/\bajudo\b/g, 'ajuda')
      .replace(/\borganizo\b/g, 'organiza')
      .replace(/\bOrganizo\b/g, 'Organiza')
      .replace(/\bplanejo\b/g, 'planeja')
      .replace(/\bPlanejo\b/g, 'Planeja')
      .replace(/\badapto\b/g, 'adapta')
      .replace(/\bAdapto\b/g, 'Adapta')
      .replace(/\bcontrolo\b/g, 'controla')
      .replace(/\btomo\b/g, 'toma')
      .replace(/\bTomo\b/g, 'Toma')
      .replace(/\buso\b/g, 'usa')
      .replace(/\bUso\b/g, 'Usa')
      .replace(/\bcrio\b/g, 'cria')
      .replace(/\bCrio\b/g, 'Cria')
      .replace(/\bexecuto\b/g, 'executa')
      .replace(/\bExecuto\b/g, 'Executa')
      .replace(/\bpratico\b/g, 'pratica')
      .replace(/\bPratico\b/g, 'Pratica')
      .replace(/\bdefendo\b/g, 'defende')
      .replace(/\bDefendo\b/g, 'Defende')
      .replace(/\bescolho\b/g, 'escolhe')
      .replace(/\bEscolho\b/g, 'Escolhe')
      .replace(/\bcumpro\b/g, 'cumpre')
      .replace(/\bCumpro\b/g, 'Cumpre')
      .replace(/\bresolvo\b/g, 'resolve')
      .replace(/\bResolvo\b/g, 'Resolve')
      .replace(/\bseparo\b/g, 'separa')
      .replace(/\bprioritizo\b/g, 'prioriza')
      .replace(/\bcomunico\b/g, 'comunica')
      .replace(/\bComunico\b/g, 'Comunica')
      .replace(/\bgerencio\b/g, 'gerencia')
      .replace(/\bnegoceio\b/g, 'negocia')
      .replace(/\bnegoço\b/g, 'negocia')
      .replace(/\bdelego\b/g, 'delega')
      .replace(/\bDelego\b/g, 'Delega')
      .replace(/\bavalio\b/g, 'avalia')
      .replace(/\bAvalio\b/g, 'Avalia')
      .replace(/\bcontribuo\b/g, 'contribui')
      .replace(/\bContribuo\b/g, 'Contribui')
      .replace(/\brespondo\b/g, 'responde')
      .replace(/\bRespondo\b/g, 'Responde')
      .replace(/\bdemonstrro\b/g, 'demonstra')
      .replace(/\bdemonstro\b/g, 'demonstra')
      .replace(/\bDemonstro\b/g, 'Demonstra')
      .replace(/\bdeixo\b/g, 'deixa')
      .replace(/\bDeixo\b/g, 'Deixa')
      .replace(/\bpercebo\b/g, 'percebe')
      .replace(/\bPercebo\b/g, 'Percebe')
      .replace(/\baprendo\b/g, 'aprende')
      .replace(/\bAprendo\b/g, 'Aprende')
      .replace(/\bconvido\b/g, 'convida')
      .replace(/\bConvido\b/g, 'Convida')
      // 'foco' é ambíguo (substantivo "o foco" vs verbo "eu foco") — não substituir
      .replace(/\bsupero\b/g, 'supera')
      .replace(/\bSupero\b/g, 'Supera')
      .replace(/\bgaranto\b/g, 'garante')
      .replace(/\bGaranto\b/g, 'Garante')
      .replace(/\binvisto\b/g, 'investe')
      .replace(/\bInvisto\b/g, 'Investe')
      .replace(/\bpersisto\b/g, 'persiste')
      .replace(/\bPersisto\b/g, 'Persiste')
      .replace(/\benvio\b/g, 'envia')
      .replace(/\bEnvio\b/g, 'Envia')
      .replace(/\bcompartilho\b/g, 'compartilha')
      .replace(/\bCompartilho\b/g, 'Compartilha')
      // Limpar espaços duplos gerados pela remoção do "eu"
      .replace(/  +/g, ' ')
      .trim()
  )
}

export default function BehaviorModal({ behavior, userId, onClose, onRefresh }: Props) {
  const [narration, setNarration] = useState('')
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(false)
  const [error, setError] = useState('')
  const [rejected, setRejected] = useState(false)
  const [rejectionFeedback, setRejectionFeedback] = useState('')
  const [approved, setApproved] = useState(false)
  const [localStatus, setLocalStatus] = useState<string | null>(null)

  if (!behavior) return null

  const currentStatus = (localStatus ?? behavior.status) as
    | 'locked'
    | 'available'
    | 'in_progress'
    | 'completed'

  async function handleStart() {
    if (!behavior?.missionId) return
    if (narration.trim().length >= 20) {
      setLocalStatus('in_progress')
      await handleValidate()
      return
    }
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
        setApproved(true)
        setTimeout(() => {
          onRefresh()
          onClose()
        }, 2500)
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
        className="relative bg-gray-900 w-full md:max-w-lg md:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teen-purple to-parent-blue p-6 md:rounded-t-3xl rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors text-white/80 text-sm"
          >
            ✕
          </button>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{behavior.competencyIcon}</span>
              <span className="text-white/60 text-xs font-semibold tracking-wide uppercase">
                {behavior.competencyName}
              </span>
            </div>
            <span className="bg-black/20 rounded-full px-2.5 py-0.5 text-xs font-bold text-white/70 tabular-nums">
              {behavior.number} <span className="opacity-50">/ {behavior.total}</span>
            </span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight font-outfit leading-snug">
            {behavior.title}
          </h2>
        </div>

        {/* Aprovado */}
        {approved ? (
          <div className="p-10 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-black text-white mb-2 font-outfit">
              Comportamento aprovado!
            </h3>
            <p className="text-gray-400 text-sm">Sua jornada continua. Bom trabalho!</p>
          </div>
        ) : (
          <div className="p-5 space-y-3">
            {/* Erro */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* Feedback de rejeição */}
            {rejected && rejectionFeedback && (
              <div className="bg-amber-500/8 border border-amber-500/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-base">💬</span>
                  <h3 className="font-semibold text-amber-300 text-sm">Precisa melhorar</h3>
                </div>
                <p className="text-amber-200/70 text-sm leading-relaxed">{rejectionFeedback}</p>
              </div>
            )}

            {/* Comportamento (descrição em 3ª pessoa) */}
            <div className="bg-gray-800/70 rounded-2xl p-4 border border-gray-700/60">
              <h3 className="font-semibold text-gray-400 text-xs uppercase tracking-wider mb-2.5">
                Comportamento
              </h3>
              <p className="text-white text-sm leading-relaxed">
                {toThirdPerson(behavior.description)}
              </p>
            </div>

            {/* Exemplo prático */}
            {behavior.example && (
              <div className="bg-gray-800/40 rounded-2xl p-4 border border-gray-700/40">
                <h3 className="font-semibold text-gray-400 text-xs uppercase tracking-wider mb-2.5">
                  Exemplo prático
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed italic">{behavior.example}</p>
              </div>
            )}

            {/* Campo de narração */}
            {(currentStatus === 'available' || currentStatus === 'in_progress') && (
              <div className="bg-gray-800/70 rounded-2xl p-4 border border-gray-700/60">
                <h3 className="font-semibold text-gray-400 text-xs uppercase tracking-wider mb-3">
                  O que você praticou
                </h3>
                <textarea
                  value={narration}
                  onChange={(e) => {
                    setNarration(e.target.value)
                    if (rejected) setRejected(false)
                  }}
                  placeholder="Descreva o que você fez, como executou e qual foi o resultado ou impacto..."
                  rows={4}
                  className="w-full bg-gray-900/80 border border-gray-700/60 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teen-purple/60 resize-none transition-colors"
                />
                <p className="text-xs text-gray-600 mt-1.5 text-right">
                  {narration.length} caracteres (mínimo 20)
                </p>
              </div>
            )}

            {/* Feedback do mentor */}
            {behavior.mentorFeedback && (
              <div className="bg-parent-blue/8 rounded-2xl p-4 border border-parent-blue/20">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-base">💬</span>
                  <h3 className="font-semibold text-parent-blue text-xs uppercase tracking-wider">
                    Feedback do mentor
                  </h3>
                </div>
                <p className="text-blue-200/70 text-sm leading-relaxed">
                  {behavior.mentorFeedback}
                </p>
              </div>
            )}

            {/* Missão concluída */}
            {currentStatus === 'completed' && (
              <div className="bg-level-up/8 rounded-2xl p-4 border border-level-up/20 text-center">
                <p className="text-level-up font-semibold text-sm">Comportamento concluído ✓</p>
              </div>
            )}

            {/* Botões de ação */}
            <div className="pt-1 pb-1">
              {currentStatus === 'available' && (
                <button
                  onClick={handleStart}
                  disabled={loading || validating}
                  className="w-full bg-gradient-to-r from-teen-purple to-parent-blue text-white font-bold text-base py-4 rounded-2xl hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading || validating ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {validating ? 'Avaliando...' : 'Iniciando...'}
                    </span>
                  ) : narration.trim().length >= 20 ? (
                    'Enviar'
                  ) : (
                    'Iniciar Comportamento 🚀'
                  )}
                </button>
              )}

              {currentStatus === 'in_progress' && (
                <button
                  onClick={handleValidate}
                  disabled={validating || narration.trim().length < 20}
                  className="w-full bg-gradient-to-r from-teen-purple to-parent-blue text-white font-bold text-base py-4 rounded-2xl hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {validating ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Avaliando...
                    </span>
                  ) : rejected ? (
                    'Tentar novamente'
                  ) : (
                    'Enviar'
                  )}
                </button>
              )}

              {currentStatus === 'locked' && (
                <p className="text-center text-gray-600 text-sm py-3">
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
