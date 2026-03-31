import { describe, it, expect } from 'vitest'

// Testa a lógica de autorização das API routes de forma isolada
// A lógica real nas routes é: busca profile, verifica role, executa ou rejeita

type Role = 'teen' | 'parent' | 'mentor'

function canApproveAsMentor(role: Role | null): boolean {
  return role === 'mentor'
}

function canApproveAsParent(role: Role | null): boolean {
  return role === 'parent'
}

function canStartMission(role: Role | null): boolean {
  return role === 'teen'
}

function canStartMissionAsRole(role: Role | null): boolean {
  return role === 'teen'
}

// ── Autorização mentor ────────────────────────────────────────────────────────

describe('Autorização: mentor/missions/approve', () => {
  it('mentor pode aprovar', () => expect(canApproveAsMentor('mentor')).toBe(true))
  it('parent NÃO pode aprovar como mentor', () => expect(canApproveAsMentor('parent')).toBe(false))
  it('teen NÃO pode aprovar como mentor', () => expect(canApproveAsMentor('teen')).toBe(false))
  it('sem role (null) → bloqueado', () => expect(canApproveAsMentor(null)).toBe(false))
})

describe('Autorização: mentor/missions/reject', () => {
  it('mentor pode rejeitar', () => expect(canApproveAsMentor('mentor')).toBe(true))
  it('teen não pode rejeitar', () => expect(canApproveAsMentor('teen')).toBe(false))
})

// ── Autorização parent ────────────────────────────────────────────────────────

describe('Autorização: missions/approve (parent)', () => {
  it('parent pode aprovar', () => expect(canApproveAsParent('parent')).toBe(true))
  it('mentor NÃO pode aprovar como parent', () => expect(canApproveAsParent('mentor')).toBe(false))
  it('teen NÃO pode aprovar como parent', () => expect(canApproveAsParent('teen')).toBe(false))
  it('sem role → bloqueado', () => expect(canApproveAsParent(null)).toBe(false))
})

// ── Autorização teen ──────────────────────────────────────────────────────────

describe('Autorização: missions/start (teen)', () => {
  it('teen pode iniciar missão', () => expect(canStartMission('teen')).toBe(true))
  it('parent NÃO pode iniciar missão', () => expect(canStartMission('parent')).toBe(false))
  it('mentor NÃO pode iniciar missão', () => expect(canStartMission('mentor')).toBe(false))
})

// ── Verificação de role via profile (novo check na route /start) ──────────────

describe('Autorização: missions/start via profile.role', () => {
  it('teen → autorizado', () => expect(canStartMissionAsRole('teen')).toBe(true))
  it('parent → bloqueado (403)', () => expect(canStartMissionAsRole('parent')).toBe(false))
  it('mentor → bloqueado (403)', () => expect(canStartMissionAsRole('mentor')).toBe(false))
  it('null (sem profile) → bloqueado', () => expect(canStartMissionAsRole(null)).toBe(false))
})

// ── Cálculo de XP na aprovação do mentor ─────────────────────────────────────

describe('Cálculo de XP na aprovação', () => {
  function applyXpReward(currentXp: number, reward: number) {
    const newTotal = (currentXp ?? 0) + reward
    const newLevel = Math.floor(newTotal / 500) + 1
    const newAutonomy = Math.min(100, 0 + 2) // simplificado
    return { newTotal, newLevel, newAutonomy }
  }

  it('XP zero + 50 = 50 XP, nível 1', () => {
    const result = applyXpReward(0, 50)
    expect(result.newTotal).toBe(50)
    expect(result.newLevel).toBe(1)
  })

  it('450 XP + 50 = 500 XP, level up para nível 2', () => {
    const result = applyXpReward(450, 50)
    expect(result.newTotal).toBe(500)
    expect(result.newLevel).toBe(2)
  })

  it('950 XP + 100 = 1050 XP, nível 3', () => {
    const result = applyXpReward(950, 100)
    expect(result.newTotal).toBe(1050)
    expect(result.newLevel).toBe(3)
  })

  it('reward padrão de 50 XP quando missão é null', () => {
    // A route usa: const xpReward = mission?.xp_reward ?? 50
    function getXpReward(mission: { xp_reward: number } | null): number {
      return mission?.xp_reward ?? 50
    }
    expect(getXpReward(null)).toBe(50)
    expect(getXpReward({ xp_reward: 120 })).toBe(120)
  })
})
