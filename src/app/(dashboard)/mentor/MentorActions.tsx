'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function MentorActions({ missionId }: { missionId: string }) {
  const router = useRouter()
  const [showReject, setShowReject] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleApprove() {
    setLoading(true)
    const res = await fetch(`/api/mentor/missions/${missionId}/approve`, { method: 'POST' })
    if (res.ok || res.redirected) router.refresh()
    else setLoading(false)
  }

  async function handleReject() {
    if (!feedback.trim()) return
    setLoading(true)
    const form = new FormData()
    form.append('feedback', feedback.trim())
    const res = await fetch(`/api/mentor/missions/${missionId}/reject`, { method: 'POST', body: form })
    if (res.ok || res.redirected) {
      setShowReject(false)
      setFeedback('')
      router.refresh()
    } else {
      setLoading(false)
    }
  }

  if (showReject) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-3">
        <p className="text-sm font-semibold text-red-700">Explique o que o teen deve melhorar:</p>
        <textarea
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          placeholder="Ex: Sua entrega precisa de mais detalhes sobre como você executou a missão. Descreva o resultado concreto..."
          rows={3}
          className="w-full border-2 border-red-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-red-400 resize-none"
          autoFocus
        />
        <div className="flex gap-2">
          <button
            onClick={handleReject}
            disabled={loading || !feedback.trim()}
            className="flex-1 bg-red-500 text-white text-sm font-bold py-2 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar Feedback'}
          </button>
          <button
            onClick={() => { setShowReject(false); setFeedback('') }}
            className="px-4 bg-gray-100 text-gray-600 text-sm font-semibold py-2 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleApprove}
        disabled={loading}
        className="flex-1 bg-level-up text-white text-sm font-bold py-2.5 rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
      >
        {loading ? '...' : '✓ Aprovar'}
      </button>
      <button
        onClick={() => setShowReject(true)}
        disabled={loading}
        className="flex-1 bg-red-100 text-red-600 text-sm font-bold py-2.5 rounded-xl hover:bg-red-200 transition-colors"
      >
        Pedir Revisão
      </button>
    </div>
  )
}
