import { describe, it, expect } from 'vitest'
import {
  resolveBehaviorStatus,
  buildBehaviors,
  calculateLevel,
  calculateNewXp,
  calculateAutonomy,
} from '@/lib/utils/unlock'
import type { TeenMissionInput } from '@/lib/utils/unlock'

// ── resolveBehaviorStatus ────────────────────────────────────────────────────

describe('resolveBehaviorStatus', () => {
  it('primeira missão sem teen_mission → available', () => {
    expect(resolveBehaviorStatus(undefined, 0, undefined)).toBe('available')
  })

  it('missão não-primeira sem teen_mission e sem anterior → locked', () => {
    expect(resolveBehaviorStatus(undefined, 1, undefined)).toBe('locked')
  })

  it('missão com status approved → completed', () => {
    const tm: TeenMissionInput = { mission_id: 'x', status: 'approved' }
    expect(resolveBehaviorStatus(tm, 1, undefined)).toBe('completed')
  })

  it('missão com status in_progress → in_progress', () => {
    const tm: TeenMissionInput = { mission_id: 'x', status: 'in_progress' }
    expect(resolveBehaviorStatus(tm, 1, undefined)).toBe('in_progress')
  })

  it('missão com status submitted → in_progress', () => {
    const tm: TeenMissionInput = { mission_id: 'x', status: 'submitted' }
    expect(resolveBehaviorStatus(tm, 1, undefined)).toBe('in_progress')
  })

  it('missão com status rejected → in_progress', () => {
    const tm: TeenMissionInput = { mission_id: 'x', status: 'rejected' }
    expect(resolveBehaviorStatus(tm, 1, undefined)).toBe('in_progress')
  })

  it('missão sem teen_mission e anterior approved → available', () => {
    const prev: TeenMissionInput = { mission_id: 'prev', status: 'approved' }
    expect(resolveBehaviorStatus(undefined, 1, prev)).toBe('available')
  })

  it('missão sem teen_mission e anterior in_progress → available (unlock progressivo)', () => {
    const prev: TeenMissionInput = { mission_id: 'prev', status: 'in_progress' }
    expect(resolveBehaviorStatus(undefined, 1, prev)).toBe('available')
  })

  it('missão sem teen_mission e anterior submitted → available', () => {
    const prev: TeenMissionInput = { mission_id: 'prev', status: 'submitted' }
    expect(resolveBehaviorStatus(undefined, 1, prev)).toBe('available')
  })

  it('missão sem teen_mission e anterior rejected → available', () => {
    const prev: TeenMissionInput = { mission_id: 'prev', status: 'rejected' }
    expect(resolveBehaviorStatus(undefined, 1, prev)).toBe('available')
  })

  it('missão sem teen_mission e anterior pending → locked', () => {
    const prev: TeenMissionInput = { mission_id: 'prev', status: 'pending' }
    expect(resolveBehaviorStatus(undefined, 1, prev)).toBe('locked')
  })
})

// ── buildBehaviors ────────────────────────────────────────────────────────────

const makeMission = (id: string, ctx = 'family') => ({
  id,
  context: ctx,
  xp_reward: 50,
  competency: { id: 1, name: 'Liderança', icon: '👑', category: 'management' },
})

describe('buildBehaviors', () => {
  it('lista vazia retorna vazia', () => {
    expect(buildBehaviors([], [], {})).toEqual([])
  })

  it('uma missão sem progresso → available', () => {
    const result = buildBehaviors([makeMission('m1')], [], { default: 'Pratique' })
    expect(result[0].status).toBe('available')
  })

  it('duas missões sem progresso: primeira available, segunda locked', () => {
    const missions = [makeMission('m1'), makeMission('m2')]
    const result = buildBehaviors(missions, [], { default: 'Pratique' })
    expect(result[0].status).toBe('available')
    expect(result[1].status).toBe('locked')
  })

  it('primeira missão approved desbloqueia a segunda', () => {
    const missions = [makeMission('m1'), makeMission('m2')]
    const teenMissions: TeenMissionInput[] = [{ mission_id: 'm1', status: 'approved' }]
    const result = buildBehaviors(missions, teenMissions, { default: '' })
    expect(result[0].status).toBe('completed')
    expect(result[1].status).toBe('available')
  })

  it('primeira in_progress desbloqueia a segunda (unlock progressivo)', () => {
    const missions = [makeMission('m1'), makeMission('m2')]
    const teenMissions: TeenMissionInput[] = [{ mission_id: 'm1', status: 'in_progress' }]
    const result = buildBehaviors(missions, teenMissions, { default: '' })
    expect(result[0].status).toBe('in_progress')
    expect(result[1].status).toBe('available')
  })

  it('segunda missão submitted, terceira ainda locked', () => {
    const missions = [makeMission('m1'), makeMission('m2'), makeMission('m3')]
    const teenMissions: TeenMissionInput[] = [
      { mission_id: 'm1', status: 'approved' },
      { mission_id: 'm2', status: 'submitted' },
    ]
    const result = buildBehaviors(missions, teenMissions, { default: '' })
    expect(result[2].status).toBe('available')
  })

  it('evidenceUrl e mentorFeedback são propagados corretamente', () => {
    const missions = [makeMission('m1')]
    const teenMissions: TeenMissionInput[] = [
      {
        mission_id: 'm1',
        status: 'approved',
        evidence_url: 'https://example.com/proof.jpg',
        mentor_feedback: 'Excelente trabalho!',
      },
    ]
    const result = buildBehaviors(missions, teenMissions, { default: '' })
    expect(result[0].evidenceUrl).toBe('https://example.com/proof.jpg')
    expect(result[0].mentorFeedback).toBe('Excelente trabalho!')
  })

  it('usa exemplo do contexto quando disponível', () => {
    const missions = [makeMission('m1', 'school')]
    const examples = { school: 'Faça algo na escola', default: 'Genérico' }
    const result = buildBehaviors(missions, [], examples)
    expect(result[0].example).toBe('Faça algo na escola')
  })

  it('fallback para exemplo default quando contexto não tem exemplo', () => {
    const missions = [makeMission('m1', 'community')]
    const examples = { default: 'Genérico' }
    const result = buildBehaviors(missions, [], examples)
    expect(result[0].example).toBe('Genérico')
  })
})

// ── XP e level ────────────────────────────────────────────────────────────────

describe('calculateLevel', () => {
  it('0 XP → nível 1', () => expect(calculateLevel(0)).toBe(1))
  it('499 XP → nível 1', () => expect(calculateLevel(499)).toBe(1))
  it('500 XP → nível 2', () => expect(calculateLevel(500)).toBe(2))
  it('999 XP → nível 2', () => expect(calculateLevel(999)).toBe(2))
  it('1000 XP → nível 3', () => expect(calculateLevel(1000)).toBe(3))
  it('2500 XP → nível 6', () => expect(calculateLevel(2500)).toBe(6))
  it('9999 XP → nível 20', () => expect(calculateLevel(9999)).toBe(20))
})

describe('calculateNewXp', () => {
  it('soma corretamente', () => expect(calculateNewXp(200, 50)).toBe(250))
  it('0 + reward = reward', () => expect(calculateNewXp(0, 120)).toBe(120))
  it('não permite valores negativos implicitamente', () => expect(calculateNewXp(100, 0)).toBe(100))
})

describe('calculateAutonomy', () => {
  it('incrementa 2 por aprovação por padrão', () => expect(calculateAutonomy(10)).toBe(12))
  it('não ultrapassa 100', () => expect(calculateAutonomy(99)).toBe(100))
  it('em 100 permanece 100', () => expect(calculateAutonomy(100)).toBe(100))
  it('em 98 sobe para 100', () => expect(calculateAutonomy(98)).toBe(100))
  it('aceita incremento customizado', () => expect(calculateAutonomy(50, 5)).toBe(55))
})
