'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const CONTEXT_LABELS: Record<string, { label: string; icon: string }> = {
  family: { label: 'Família', icon: '👨‍👩‍👦' },
  school: { label: 'Escola', icon: '🏫' },
  community: { label: 'Comunidade', icon: '🌍' },
  company: { label: 'Empresa', icon: '🏢' },
}

const CONTEXT_EXAMPLES: Record<string, string> = {
  family:
    'Ex: "Organizei uma reunião familiar no domingo para discutir as tarefas da semana. Cada pessoa escolheu sua responsabilidade e montamos um quadro na geladeira."',
  school:
    'Ex: "Liderei meu grupo no trabalho de ciências. Dividi as tarefas, criei um cronograma e apresentamos o melhor trabalho da turma."',
  community:
    'Ex: "Organizei uma coleta de roupas no prédio. Bati de porta em porta explicando a causa e conseguimos 3 sacolas para a ONG do bairro."',
  company:
    'Ex: "Criei um plano de negócios para vender brigadeiros na escola. Calculei custos, defini preço e vendi 30 unidades na primeira semana."',
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
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [missionId, setMissionId] = useState<string | null>(null)
  const [mission, setMission] = useState<MissionData | null>(null)
  const [evidenceUrl, setEvidenceUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

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

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !missionId) return

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      setError('Arquivo muito grande. Máximo 10MB.')
      return
    }

    setUploading(true)
    setError('')

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setUploading(false)
      return
    }

    const ext = file.name.split('.').pop()
    const path = `${user.id}/${missionId}-${Date.now()}.${ext}`

    const { data, error: uploadError } = await supabase.storage
      .from('evidence')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setError('Erro ao enviar arquivo. Tente novamente.')
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage.from('evidence').getPublicUrl(data.path)
    setEvidenceUrl(urlData.publicUrl)
    setFileName(file.name)
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim() || description.trim().length < 20) {
      setError('Descreva sua entrega com pelo menos 20 caracteres.')
      return
    }
    setError('')
    setLoading(true)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user || !missionId) {
      setLoading(false)
      return
    }

    const { error: err } = await supabase.from('teen_missions').upsert(
      {
        teen_id: user.id,
        mission_id: missionId,
        status: 'submitted',
        evidence_description: description.trim(),
        evidence_url: evidenceUrl,
      },
      { onConflict: 'teen_id,mission_id' }
    )

    if (err) {
      setError('Erro ao enviar entrega. Tente novamente.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/missions'), 2500)
  }

  if (!mission) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-4 border-teen-purple border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto pt-16 text-center">
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Entrega enviada!</h2>
          <p className="text-gray-500 text-sm">
            Seu mentor vai avaliar sua entrega em breve.
            <br />
            Redirecionando para missões...
          </p>
          <div className="mt-4 inline-flex items-center gap-1 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-full px-4 py-2 text-sm font-semibold">
            ⏳ Aguardando avaliação
          </div>
        </div>
      </div>
    )
  }

  const ctx = CONTEXT_LABELS[mission.context] ?? { label: mission.context, icon: '📋' }
  const example = CONTEXT_EXAMPLES[mission.context] ?? ''
  const comp = mission.competency

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-1">
      {/* Voltar */}
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
          ⚡ +{mission.xp_reward} XP ao ser aprovado
        </div>
      </div>

      {/* Descrição detalhada */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-black text-gray-800 mb-3 flex items-center gap-2">
          📋 O que você precisa fazer
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

      {/* Formulário de entrega */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-black text-gray-800 mb-1">Enviar Entrega 📤</h2>
        <p className="text-gray-500 text-sm mb-5">
          Descreva o que você fez e envie uma prova (foto, vídeo ou documento).
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Descrição */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              O que você fez? <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva detalhadamente o que fez, como executou a missão e qual foi o resultado ou impacto que percebeu..."
              rows={5}
              required
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm focus:outline-none focus:border-teen-purple transition-colors resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              {description.length} caracteres (mínimo 20)
            </p>
          </div>

          {/* Upload de evidência */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Prova da missão (foto, vídeo ou documento)
            </label>

            {fileName ? (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <span className="text-green-600 text-lg">✅</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-green-700 truncate">{fileName}</p>
                  <p className="text-xs text-green-600">Arquivo enviado com sucesso</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFileName(null)
                    setEvidenceUrl(null)
                  }}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Remover
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center gap-2 border-2 border-dashed border-gray-200 rounded-xl px-4 py-8 cursor-pointer hover:border-teen-purple hover:bg-purple-50/30 transition-all">
                <span className="text-3xl">📎</span>
                <span className="text-sm font-semibold text-gray-600">
                  {uploading ? 'Enviando...' : 'Clique para enviar arquivo'}
                </span>
                <span className="text-xs text-gray-400">Fotos, vídeos ou PDFs • Máximo 10MB</span>
                <input
                  type="file"
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Dicas */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
            <p className="font-semibold mb-1">✏️ Dicas para uma boa entrega:</p>
            <ul className="space-y-0.5 text-blue-600">
              <li>• Descreva especificamente o que você fez</li>
              <li>• Mencione quem esteve envolvido</li>
              <li>• Fale sobre os desafios e como os superou</li>
              <li>• Compartilhe o resultado e o que aprendeu</li>
              <li>• Anexe uma foto ou vídeo como prova</li>
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
