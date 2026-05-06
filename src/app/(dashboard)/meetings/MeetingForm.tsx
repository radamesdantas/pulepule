'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  teenId: string
  recordedBy: string
}

export default function MeetingForm({ teenId, recordedBy }: Props) {
  const router = useRouter()
  const [type, setType] = useState<'weekly' | 'monthly'>('weekly')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [duration, setDuration] = useState(30)
  const [topic, setTopic] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: err } = await supabase.from('family_meetings').insert({
      teen_id: teenId,
      recorded_by: recordedBy,
      meeting_type: type,
      meeting_date: date,
      duration_minutes: duration,
      topic: topic.trim() || null,
      notes: notes.trim() || null,
    })

    if (err) {
      setError('Erro ao registrar reuniao. Tente novamente.')
    } else {
      setSuccess(true)
      setTopic('')
      setNotes('')
      setTimeout(() => setSuccess(false), 3000)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 space-y-4">
      <h2 className="font-black text-white">Registrar Reuniao</h2>

      {error && (
        <div className="bg-red-950/50 border border-red-800 text-red-400 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-950/50 border border-green-800 text-green-400 rounded-xl px-4 py-3 text-sm font-semibold">
          Reuniao registrada com sucesso!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo */}
        <div className="grid grid-cols-2 gap-2">
          {(['weekly', 'monthly'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setType(t)
                setDuration(t === 'weekly' ? 30 : 180)
              }}
              className={`py-3 rounded-xl font-bold text-sm transition-all ${
                type === t
                  ? 'bg-teen-purple text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {t === 'weekly' ? '📅 Semanal' : '🗓️ Mensal'}
            </button>
          ))}
        </div>

        {/* Data */}
        <div>
          <label className="block text-sm font-semibold text-gray-400 mb-1.5">
            Data da reuniao
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            max={new Date().toISOString().split('T')[0]}
            className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-teen-purple transition-colors"
          />
        </div>

        {/* Duracao */}
        <div>
          <label className="block text-sm font-semibold text-gray-400 mb-1.5">
            Duracao: <span className="text-white">{duration} min</span>
          </label>
          <input
            type="range"
            min={15}
            max={type === 'weekly' ? 60 : 360}
            step={15}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full accent-teen-purple"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-0.5">
            <span>15 min</span>
            <span>{type === 'weekly' ? '60 min' : '6h'}</span>
          </div>
        </div>

        {/* Topico */}
        <div>
          <label className="block text-sm font-semibold text-gray-400 mb-1.5">
            Topico principal (opcional)
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ex: Metas do mes, resolucao de conflitos..."
            maxLength={200}
            className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-teen-purple transition-colors placeholder-gray-600"
          />
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-semibold text-gray-400 mb-1.5">
            Anotacoes (opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="O que foi discutido? Quais foram as conclusoes?"
            rows={3}
            maxLength={1000}
            className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-teen-purple transition-colors resize-none placeholder-gray-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teen-purple text-white font-bold py-3.5 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-60 min-h-[44px]"
        >
          {loading ? 'Registrando...' : 'Registrar Reuniao'}
        </button>
      </form>
    </div>
  )
}
