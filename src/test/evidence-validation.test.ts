import { describe, it, expect } from 'vitest'

// Lógica de validação extraída do BehaviorModal

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MIN_DESCRIPTION_LENGTH = 20

function validateDescription(description: string): string | null {
  if (description.trim().length < MIN_DESCRIPTION_LENGTH) {
    return 'Descreva com pelo menos 20 caracteres.'
  }
  return null
}

function validateFileSize(sizeBytes: number): string | null {
  if (sizeBytes > MAX_FILE_SIZE) {
    return 'Arquivo muito grande. Max 10MB.'
  }
  return null
}

// ── Validação de descrição ────────────────────────────────────────────────────

describe('validateDescription', () => {
  it('descrição vazia → erro', () => {
    expect(validateDescription('')).toBe('Descreva com pelo menos 20 caracteres.')
  })

  it('descrição curta (< 20 chars) → erro', () => {
    expect(validateDescription('texto curto')).toBe('Descreva com pelo menos 20 caracteres.')
  })

  it('exatamente 19 chars → erro', () => {
    expect(validateDescription('a'.repeat(19))).toBe('Descreva com pelo menos 20 caracteres.')
  })

  it('exatamente 20 chars → válido', () => {
    expect(validateDescription('a'.repeat(20))).toBeNull()
  })

  it('mais de 20 chars → válido', () => {
    expect(
      validateDescription('Pratiquei liderança na escola organizando um grupo de estudo')
    ).toBeNull()
  })

  it('espaços não contam para o mínimo (trim)', () => {
    expect(validateDescription('   ' + 'a'.repeat(19) + '   ')).toBe(
      'Descreva com pelo menos 20 caracteres.'
    )
  })

  it('espaços + 20 chars reais → válido', () => {
    expect(validateDescription('   ' + 'a'.repeat(20) + '   ')).toBeNull()
  })
})

// ── Validação de arquivo ──────────────────────────────────────────────────────

describe('validateFileSize', () => {
  it('arquivo vazio (0 bytes) → válido', () => {
    expect(validateFileSize(0)).toBeNull()
  })

  it('arquivo de 1MB → válido', () => {
    expect(validateFileSize(1 * 1024 * 1024)).toBeNull()
  })

  it('arquivo de 9.9MB → válido', () => {
    expect(validateFileSize(9.9 * 1024 * 1024)).toBeNull()
  })

  it('arquivo exatamente 10MB → válido (limite inclusive)', () => {
    expect(validateFileSize(10 * 1024 * 1024)).toBeNull()
  })

  it('arquivo de 10MB + 1 byte → erro', () => {
    expect(validateFileSize(10 * 1024 * 1024 + 1)).toBe('Arquivo muito grande. Max 10MB.')
  })

  it('arquivo de 50MB → erro', () => {
    expect(validateFileSize(50 * 1024 * 1024)).toBe('Arquivo muito grande. Max 10MB.')
  })
})

// ── Validação combinada (fluxo real do modal) ─────────────────────────────────

describe('fluxo de submissão de evidência', () => {
  it('rejeita sem descrição mesmo com arquivo', () => {
    const descError = validateDescription('')
    expect(descError).not.toBeNull()
  })

  it('aceita com descrição válida sem arquivo (arquivo é opcional)', () => {
    const descError = validateDescription('Organizei uma reunião de liderança na escola')
    expect(descError).toBeNull()
    // arquivo = null → permitido
  })

  it('rejeita com arquivo grande mesmo com descrição válida', () => {
    const descError = validateDescription('Descrição suficientemente longa aqui')
    const fileError = validateFileSize(20 * 1024 * 1024)
    expect(descError).toBeNull()
    expect(fileError).not.toBeNull()
  })
})
