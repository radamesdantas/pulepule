'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import JourneyPath from '@/components/JourneyPath'
import BehaviorModal from '@/components/BehaviorModal'

const LEVEL_NAMES = ['Explorador', 'Aprendiz', 'Guerreiro', 'Herói', 'Lenda']
const XP_PER_LEVEL = 500

const EXAMPLES: Record<string, string> = {
  // Exemplos por contexto — fallback genérico
  default: 'Pratique este comportamento no seu dia a dia e registre o resultado concreto.',
}

interface Props {
  userId: string
  name: string
  xp: {
    total_xp: number
    current_level: number
    current_streak: number
    current_phase: number
    autonomy_index: number
    badges: string[]
  } | null
  missions: Array<{
    id: string
    title: string
    description: string
    context: string
    xp_reward: number
    month: number
    phase: number
    competency: { id: number; name: string; icon: string; description: string; category: string } | null
  }>
  teenMissions: Array<{
    id: string
    mission_id: string
    status: string
    evidence_url: string | null
    evidence_description: string | null
    mentor_feedback: string | null
  }>
}

export default function TeenGame({ userId, name, xp, missions, teenMissions }: Props) {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const totalXp = xp?.total_xp ?? 0
  const level = xp?.current_level ?? 1
  const streak = xp?.current_streak ?? 0
  const phase = xp?.current_phase ?? 1

  const progressMap = new Map(teenMissions.map(tm => [tm.mission_id, tm]))

  // Build behaviors list with sequential unlock
  const behaviors = missions.map((m, i) => {
    const tm = progressMap.get(m.id)
    let status: 'locked' | 'available' | 'in_progress' | 'completed' = 'locked'

    if (tm) {
      if (tm.status === 'approved') status = 'completed'
      else if (tm.status === 'in_progress' || tm.status === 'submitted' || tm.status === 'rejected') status = 'in_progress'
      else status = 'available'
    } else if (i === 0) {
      status = 'available'
    } else {
      const prevTm = progressMap.get(missions[i - 1].id)
      if (prevTm?.status === 'approved') status = 'available'
      // Also unlock if previous is in_progress or beyond
      else if (prevTm && ['in_progress', 'submitted', 'rejected', 'approved'].includes(prevTm.status)) status = 'available'
    }

    const comp = Array.isArray(m.competency) ? m.competency[0] : m.competency

    return {
      id: m.id,
      title: m.title,
      description: m.description,
      example: EXAMPLES[m.context] ?? EXAMPLES.default,
      competencyName: comp?.name ?? 'Competência',
      competencyIcon: comp?.icon ?? '⭐',
      competencyCode: comp ? `${comp.category}-${comp.id}` : `unknown-${i}`,
      xpReward: m.xp_reward,
      status,
      index: i,
      missionId: m.id,
      evidenceUrl: tm?.evidence_url ?? null,
      mentorFeedback: tm?.mentor_feedback ?? null,
    }
  })

  const selectedBehavior = selectedId ? behaviors.find(b => b.id === selectedId) ?? null : null

  const handleRefresh = useCallback(() => {
    router.refresh()
  }, [router])

  return (
    <div className="max-w-xl mx-auto px-4">
      {/* Stats bar */}
      <div className="sticky top-0 z-30 bg-gray-950/95 backdrop-blur-sm py-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs">Olá, {name.split(' ')[0]}</p>
            <p className="text-white font-black text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)]} — Nível {level}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-xp-gold font-black text-lg">{totalXp}</p>
              <p className="text-gray-500 text-[10px]">XP</p>
            </div>
            <div className="text-center">
              <p className="text-orange-400 font-black text-lg">{streak}</p>
              <p className="text-gray-500 text-[10px]">🔥 Dias</p>
            </div>
          </div>
        </div>

        {/* XP progress bar */}
        <div className="mt-2">
          <div className="bg-gray-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-teen-purple to-xp-gold rounded-full h-2 transition-all"
              style={{ width: `${Math.round(((totalXp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100)}%` }}
            />
          </div>
          <p className="text-gray-500 text-[10px] mt-1 text-right">{totalXp % XP_PER_LEVEL}/{XP_PER_LEVEL} XP para o próximo nível</p>
        </div>
      </div>

      {/* Journey path */}
      <JourneyPath
        behaviors={behaviors}
        onSelectBehavior={setSelectedId}
      />

      {/* Behavior detail modal */}
      {selectedBehavior && (
        <BehaviorModal
          behavior={selectedBehavior}
          userId={userId}
          onClose={() => setSelectedId(null)}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  )
}
