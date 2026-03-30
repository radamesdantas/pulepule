import type { MissionStatus } from '@/lib/types/database'

export type BehaviorStatus = 'locked' | 'available' | 'in_progress' | 'completed'

export interface MissionInput {
  id: string
  context: string
  xp_reward: number
  competency: { id: number; name: string; icon: string; category: string } | null
  [key: string]: unknown
}

export interface TeenMissionInput {
  mission_id: string
  status: MissionStatus
  evidence_url?: string | null
  mentor_feedback?: string | null
}

export function resolveBehaviorStatus(
  tm: TeenMissionInput | undefined,
  index: number,
  prevTm: TeenMissionInput | undefined
): BehaviorStatus {
  if (tm) {
    if (tm.status === 'approved') return 'completed'
    if (['in_progress', 'submitted', 'rejected'].includes(tm.status)) return 'in_progress'
    return 'available'
  }
  if (index === 0) return 'available'
  if (prevTm && ['in_progress', 'submitted', 'rejected', 'approved'].includes(prevTm.status)) {
    return 'available'
  }
  return 'locked'
}

export function buildBehaviors(
  missions: MissionInput[],
  teenMissions: TeenMissionInput[],
  examples: Record<string, string>
) {
  const progressMap = new Map(teenMissions.map((tm) => [tm.mission_id, tm]))

  return missions.map((m, i) => {
    const tm = progressMap.get(m.id)
    const prevTm = i > 0 ? progressMap.get(missions[i - 1].id) : undefined
    const status = resolveBehaviorStatus(tm, i, prevTm)
    const comp = Array.isArray(m.competency) ? m.competency[0] : m.competency

    return {
      id: m.id,
      status,
      xpReward: m.xp_reward,
      competencyCode: comp ? `${comp.category}-${comp.id}` : `unknown-${i}`,
      evidenceUrl: tm?.evidence_url ?? null,
      mentorFeedback: tm?.mentor_feedback ?? null,
      example: examples[m.context] ?? examples.default ?? '',
    }
  })
}

export function calculateLevel(totalXp: number): number {
  return Math.floor(totalXp / 500) + 1
}

export function calculateNewXp(currentXp: number, reward: number): number {
  return currentXp + reward
}

export function calculateAutonomy(current: number, increment = 2): number {
  return Math.min(100, current + increment)
}
