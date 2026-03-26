'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface BehaviorData {
  id: string
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
  const [uploading, setUploading] = useState(false)
  const [description, setDescription] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [evidenceUrl, setEvidenceUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [localStatus, setLocalStatus] = useState<string | null>(null)

  if (!behavior) return null

  const currentStatus = (localStatus ?? behavior.status) as 'locked' | 'available' | 'in_progress' | 'completed'

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !behavior) return
    if (file.size > 10 * 1024 * 1024) { setError('Arquivo muito grande. Max 10MB.'); return }

    setUploading(true)
    setError('')
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${userId}/${behavior.id}-${Date.now()}.${ext}`
    const { data, error: err } = await supabase.storage.from('evidence').upload(path, file, { upsert: true })
    if (err) { setError('Erro no upload.'); setUploading(false); return }
    const { data: urlData } = supabase.storage.from('evidence').getPublicUrl(data.path)
    setEvidenceUrl(urlData.publicUrl)
    setFileName(file.name)
    setUploading(false)
  }

  async function handleStart() {
    if (!behavior?.missionId) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('teen_missions').upsert({
      teen_id: userId,
      mission_id: behavior.missionId,
      status: 'in_progress',
    }, { onConflict: 'teen_id,mission_id' })
    setLoading(false)
    setLocalStatus('in_progress')
    onRefresh()
  }

  async function handleSubmitEvidence() {
    if (!behavior?.missionId || description.trim().length < 20) {
      setError('Descreva com pelo menos 20 caracteres.')
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()
    await supabase.from('teen_missions').upsert({
      teen_id: userId,
      mission_id: behavior.missionId,
      status: 'submitted',
      evidence_description: description.trim(),
      evidence_url: evidenceUrl,
    }, { onConflict: 'teen_id,mission_id' })
    setSuccess(true)
    setLoading(false)
    setTimeout(() => { onRefresh(); onClose() }, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-gray-900 w-full md:max-w-lg md:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teen-purple to-parent-blue p-6 md:rounded-t-3xl rounded-t-3xl relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white text-xl">✕</button>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{behavior.competencyIcon}</span>
            <span className="text-white/70 text-sm font-semibold">{behavior.competencyName}</span>
          </div>
          <h2 className="text-xl font-black text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {behavior.title}
          </h2>
          <div className="mt-2 inline-flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-sm font-bold text-white">
            ⚡ +{behavior.xpReward} XP
          </div>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-xl font-black text-white mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Evidência enviada!</h3>
            <p className="text-gray-400 text-sm">Seu mentor vai avaliar em breve.</p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">{error}</div>
            )}

            {/* 1. Descrição */}
            <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📋</span>
                <h3 className="font-bold text-white text-sm">O que fazer</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{behavior.description}</p>
            </div>

            {/* 2. Exemplo */}
            <div className="bg-amber-500/10 rounded-2xl p-4 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💡</span>
                <h3 className="font-bold text-amber-300 text-sm">Exemplo prático</h3>
              </div>
              <p className="text-amber-200/80 text-sm leading-relaxed italic">{behavior.example}</p>
            </div>

            {/* 3. Baú de XP */}
            <div className="bg-xp-gold/10 rounded-2xl p-4 border border-xp-gold/20 text-center">
              <span className="text-4xl">{currentStatus === 'completed' ? '✅' : '🎁'}</span>
              <p className="text-xp-gold font-black text-2xl mt-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {currentStatus === 'completed' ? 'XP coletado!' : `+${behavior.xpReward} XP`}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {currentStatus === 'completed' ? 'Parabéns pela conquista!' : 'Ganhe XP ao completar'}
              </p>
            </div>

            {/* 4. Evidência */}
            {currentStatus === 'in_progress' && (
              <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">📸</span>
                  <h3 className="font-bold text-white text-sm">Enviar evidência</h3>
                </div>

                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Descreva o que você fez e como praticou este comportamento..."
                  rows={3}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teen-purple resize-none mb-3"
                />

                {fileName ? (
                  <div className="flex items-center gap-2 bg-level-up/10 border border-level-up/20 rounded-xl px-3 py-2">
                    <span className="text-level-up">✅</span>
                    <span className="text-sm text-level-up truncate flex-1">{fileName}</span>
                    <button onClick={() => { setFileName(null); setEvidenceUrl(null) }} className="text-xs text-gray-500 hover:text-red-400">✕</button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-1 border border-dashed border-gray-600 rounded-xl py-5 cursor-pointer hover:border-teen-purple transition-colors">
                    <span className="text-2xl">📎</span>
                    <span className="text-xs text-gray-400">{uploading ? 'Enviando...' : 'Foto, vídeo ou PDF (max 10MB)'}</span>
                    <input type="file" accept="image/*,video/*,.pdf" onChange={handleFileUpload} disabled={uploading} className="hidden" />
                  </label>
                )}
              </div>
            )}

            {currentStatus === 'completed' && behavior.evidenceUrl && (
              <div className="bg-level-up/10 rounded-2xl p-4 border border-level-up/20">
                <div className="flex items-center gap-2">
                  <span className="text-lg">✅</span>
                  <h3 className="font-bold text-level-up text-sm">Evidência enviada</h3>
                </div>
              </div>
            )}

            {behavior.mentorFeedback && (
              <div className="bg-parent-blue/10 rounded-2xl p-4 border border-parent-blue/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">💬</span>
                  <h3 className="font-bold text-parent-blue text-sm">Feedback do mentor</h3>
                </div>
                <p className="text-blue-200/80 text-sm">{behavior.mentorFeedback}</p>
              </div>
            )}

            {/* 5. Action button */}
            <div className="pt-2">
              {currentStatus === 'available' && (
                <button
                  onClick={handleStart}
                  disabled={loading}
                  className="w-full bg-teen-purple text-white font-bold text-base py-4 rounded-2xl hover:bg-purple-600 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? '...' : 'Iniciar Comportamento 🚀'}
                </button>
              )}
              {currentStatus === 'in_progress' && (
                <button
                  onClick={handleSubmitEvidence}
                  disabled={loading || description.trim().length < 20}
                  className="w-full bg-gradient-to-r from-teen-purple to-parent-blue text-white font-bold text-base py-4 rounded-2xl hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : 'Enviar Evidência 📤'}
                </button>
              )}
              {currentStatus === 'completed' && (
                <div className="text-center py-3">
                  <span className="bg-level-up/20 text-level-up font-bold text-sm px-6 py-2 rounded-full">Concluído ✓</span>
                </div>
              )}
              {currentStatus === 'locked' && (
                <p className="text-center text-gray-500 text-sm py-3">🔒 Complete o anterior para desbloquear</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
