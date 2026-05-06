import { describe, it, expect } from 'vitest'

// Helpers de validacao de reunioes familiares

function validateMeeting(input: {
  meeting_type: string
  meeting_date: string
  duration_minutes: number
}): { valid: boolean; error?: string } {
  if (!['weekly', 'monthly'].includes(input.meeting_type)) {
    return { valid: false, error: 'Tipo invalido' }
  }
  const date = new Date(input.meeting_date)
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Data invalida' }
  }
  if (date > new Date()) {
    return { valid: false, error: 'Data futura nao permitida' }
  }
  if (input.duration_minutes <= 0) {
    return { valid: false, error: 'Duracao deve ser positiva' }
  }
  return { valid: true }
}

function getRecommendedDuration(type: 'weekly' | 'monthly'): number {
  return type === 'weekly' ? 30 : 180
}

describe('Family Meetings — validacao', () => {
  it('aceita reuniao semanal valida', () => {
    const result = validateMeeting({
      meeting_type: 'weekly',
      meeting_date: '2026-04-01',
      duration_minutes: 30,
    })
    expect(result.valid).toBe(true)
  })

  it('aceita reuniao mensal valida', () => {
    const result = validateMeeting({
      meeting_type: 'monthly',
      meeting_date: '2026-04-01',
      duration_minutes: 180,
    })
    expect(result.valid).toBe(true)
  })

  it('rejeita tipo invalido', () => {
    const result = validateMeeting({
      meeting_type: 'daily',
      meeting_date: '2026-04-01',
      duration_minutes: 30,
    })
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Tipo invalido')
  })

  it('rejeita data futura', () => {
    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)
    const result = validateMeeting({
      meeting_type: 'weekly',
      meeting_date: futureDate.toISOString().split('T')[0],
      duration_minutes: 30,
    })
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Data futura nao permitida')
  })

  it('rejeita duracao zero', () => {
    const result = validateMeeting({
      meeting_type: 'weekly',
      meeting_date: '2026-04-01',
      duration_minutes: 0,
    })
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Duracao deve ser positiva')
  })

  it('rejeita duracao negativa', () => {
    const result = validateMeeting({
      meeting_type: 'monthly',
      meeting_date: '2026-04-01',
      duration_minutes: -10,
    })
    expect(result.valid).toBe(false)
  })
})

describe('Family Meetings — duracao recomendada', () => {
  it('reuniao semanal recomenda 30 minutos', () => {
    expect(getRecommendedDuration('weekly')).toBe(30)
  })

  it('reuniao mensal recomenda 180 minutos (3 horas)', () => {
    expect(getRecommendedDuration('monthly')).toBe(180)
  })
})
