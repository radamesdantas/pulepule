import { describe, it, expect } from 'vitest'

// Logica de badges — criterios de desbloqueio

type BadgeCode =
  | 'first_mission'
  | 'streak_7'
  | 'streak_30'
  | 'streak_100'
  | 'streak_267'
  | 'xp_1000'
  | 'xp_5000'
  | 'xp_10000'
  | 'level_3'
  | 'level_5'
  | 'autonomy_50'
  | 'autonomy_100'
  | 'missions_10'
  | 'missions_36'

interface BadgeInput {
  totalXp: number
  level: number
  streak: number
  autonomy: number
  approvedMissions: number
}

function computeEarnedBadges(input: BadgeInput): BadgeCode[] {
  const badges: BadgeCode[] = []
  if (input.approvedMissions >= 1) badges.push('first_mission')
  if (input.streak >= 7) badges.push('streak_7')
  if (input.streak >= 30) badges.push('streak_30')
  if (input.streak >= 100) badges.push('streak_100')
  if (input.streak >= 267) badges.push('streak_267')
  if (input.totalXp >= 1000) badges.push('xp_1000')
  if (input.totalXp >= 5000) badges.push('xp_5000')
  if (input.totalXp >= 10000) badges.push('xp_10000')
  if (input.level >= 3) badges.push('level_3')
  if (input.level >= 5) badges.push('level_5')
  if (input.autonomy >= 50) badges.push('autonomy_50')
  if (input.autonomy >= 100) badges.push('autonomy_100')
  if (input.approvedMissions >= 10) badges.push('missions_10')
  if (input.approvedMissions >= 36) badges.push('missions_36')
  return badges
}

describe('Badges — criterios de desbloqueio', () => {
  it('usuario zerado nao tem badges', () => {
    const badges = computeEarnedBadges({
      totalXp: 0,
      level: 1,
      streak: 0,
      autonomy: 0,
      approvedMissions: 0,
    })
    expect(badges).toHaveLength(0)
  })

  it('primeira missao desbloqueia first_mission', () => {
    const badges = computeEarnedBadges({
      totalXp: 50,
      level: 1,
      streak: 1,
      autonomy: 0,
      approvedMissions: 1,
    })
    expect(badges).toContain('first_mission')
  })

  it('streak 7 desbloqueia streak_7 mas nao streak_30', () => {
    const badges = computeEarnedBadges({
      totalXp: 0,
      level: 1,
      streak: 7,
      autonomy: 0,
      approvedMissions: 0,
    })
    expect(badges).toContain('streak_7')
    expect(badges).not.toContain('streak_30')
  })

  it('streak 30 desbloqueia streak_7 e streak_30', () => {
    const badges = computeEarnedBadges({
      totalXp: 0,
      level: 1,
      streak: 30,
      autonomy: 0,
      approvedMissions: 0,
    })
    expect(badges).toContain('streak_7')
    expect(badges).toContain('streak_30')
  })

  it('streak 267 desbloqueia todos os badges de streak', () => {
    const badges = computeEarnedBadges({
      totalXp: 0,
      level: 1,
      streak: 267,
      autonomy: 0,
      approvedMissions: 0,
    })
    expect(badges).toContain('streak_7')
    expect(badges).toContain('streak_30')
    expect(badges).toContain('streak_100')
    expect(badges).toContain('streak_267')
  })

  it('xp 5000 desbloqueia xp_1000 e xp_5000', () => {
    const badges = computeEarnedBadges({
      totalXp: 5000,
      level: 1,
      streak: 0,
      autonomy: 0,
      approvedMissions: 0,
    })
    expect(badges).toContain('xp_1000')
    expect(badges).toContain('xp_5000')
    expect(badges).not.toContain('xp_10000')
  })

  it('nivel 5 desbloqueia level_3 e level_5', () => {
    const badges = computeEarnedBadges({
      totalXp: 0,
      level: 5,
      streak: 0,
      autonomy: 0,
      approvedMissions: 0,
    })
    expect(badges).toContain('level_3')
    expect(badges).toContain('level_5')
  })

  it('autonomy 100 desbloqueia autonomy_50 e autonomy_100', () => {
    const badges = computeEarnedBadges({
      totalXp: 0,
      level: 1,
      streak: 0,
      autonomy: 100,
      approvedMissions: 0,
    })
    expect(badges).toContain('autonomy_50')
    expect(badges).toContain('autonomy_100')
  })

  it('36 missoes aprovadas desbloqueia missions_10 e missions_36', () => {
    const badges = computeEarnedBadges({
      totalXp: 0,
      level: 1,
      streak: 0,
      autonomy: 0,
      approvedMissions: 36,
    })
    expect(badges).toContain('missions_10')
    expect(badges).toContain('missions_36')
  })

  it('usuario completo tem todos os badges', () => {
    const badges = computeEarnedBadges({
      totalXp: 10000,
      level: 5,
      streak: 267,
      autonomy: 100,
      approvedMissions: 36,
    })
    expect(badges).toHaveLength(14)
  })
})

describe('Badges — raridades', () => {
  const RARITY: Record<string, string> = {
    first_mission: 'bronze',
    streak_7: 'bronze',
    streak_30: 'silver',
    streak_100: 'gold',
    streak_267: 'diamond',
    xp_1000: 'bronze',
    xp_5000: 'silver',
    xp_10000: 'gold',
    level_3: 'bronze',
    level_5: 'gold',
    autonomy_50: 'silver',
    autonomy_100: 'diamond',
    missions_10: 'bronze',
    missions_36: 'diamond',
  }

  it('badges de streak tem raridades crescentes', () => {
    expect(RARITY['streak_7']).toBe('bronze')
    expect(RARITY['streak_30']).toBe('silver')
    expect(RARITY['streak_100']).toBe('gold')
    expect(RARITY['streak_267']).toBe('diamond')
  })

  it('badge de conclusao total eh diamond', () => {
    expect(RARITY['missions_36']).toBe('diamond')
    expect(RARITY['autonomy_100']).toBe('diamond')
  })
})
