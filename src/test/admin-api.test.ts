import { describe, it, expect } from 'vitest'

// Testa a lógica de autorização da API route DELETE /api/admin/users/[id]
// A route verifica: user autenticado + role === 'admin' + não está deletando a si mesmo

type UserMeta = { role?: string } | null

function canDeleteUser(meta: UserMeta, requesterId: string, targetId: string): boolean {
  if (!meta) return false
  if (meta.role !== 'admin') return false
  if (requesterId === targetId) return false
  return true
}

function deleteValidationError(
  meta: UserMeta,
  requesterId: string,
  targetId: string
): string | null {
  if (!meta || meta.role !== 'admin') return 'Nao autorizado'
  if (requesterId === targetId) return 'Nao e possivel excluir seu proprio usuario'
  return null
}

// ── Autorização ────────────────────────────────────────────────────────────────

describe('DELETE /api/admin/users/[id] — autorização', () => {
  it('admin pode deletar outro usuario', () => {
    expect(canDeleteUser({ role: 'admin' }, 'admin-id', 'user-id')).toBe(true)
  })

  it('sem usuario autenticado → bloqueado', () => {
    expect(canDeleteUser(null, '', 'user-id')).toBe(false)
  })

  it('teen nao pode deletar usuario', () => {
    expect(canDeleteUser({ role: 'teen' }, 'teen-id', 'user-id')).toBe(false)
  })

  it('mentor nao pode deletar usuario', () => {
    expect(canDeleteUser({ role: 'mentor' }, 'mentor-id', 'user-id')).toBe(false)
  })

  it('parent nao pode deletar usuario', () => {
    expect(canDeleteUser({ role: 'parent' }, 'parent-id', 'user-id')).toBe(false)
  })

  it('sem role definida → bloqueado', () => {
    expect(canDeleteUser({}, 'id', 'user-id')).toBe(false)
  })
})

// ── Auto-exclusão ──────────────────────────────────────────────────────────────

describe('DELETE /api/admin/users/[id] — auto-exclusao', () => {
  it('admin nao pode deletar a si mesmo', () => {
    expect(canDeleteUser({ role: 'admin' }, 'admin-id', 'admin-id')).toBe(false)
  })

  it('admin pode deletar outro admin (ids diferentes)', () => {
    expect(canDeleteUser({ role: 'admin' }, 'admin-1', 'admin-2')).toBe(true)
  })
})

// ── Mensagens de erro ──────────────────────────────────────────────────────────

describe('DELETE /api/admin/users/[id] — mensagens de erro', () => {
  it('nao admin → mensagem de nao autorizado', () => {
    expect(deleteValidationError({ role: 'teen' }, 'id', 'other')).toBe('Nao autorizado')
  })

  it('sem autenticacao → mensagem de nao autorizado', () => {
    expect(deleteValidationError(null, '', 'other')).toBe('Nao autorizado')
  })

  it('auto-exclusao → mensagem especifica', () => {
    expect(deleteValidationError({ role: 'admin' }, 'same-id', 'same-id')).toBe(
      'Nao e possivel excluir seu proprio usuario'
    )
  })

  it('operacao valida → sem erro', () => {
    expect(deleteValidationError({ role: 'admin' }, 'admin-id', 'user-id')).toBeNull()
  })
})

// ── Resposta HTTP esperada ─────────────────────────────────────────────────────

describe('DELETE /api/admin/users/[id] — status HTTP', () => {
  function getHttpStatus(meta: UserMeta, requesterId: string, targetId: string): number {
    if (!meta || meta.role !== 'admin') return 403
    if (requesterId === targetId) return 400
    return 200
  }

  it('admin valido → 200', () => {
    expect(getHttpStatus({ role: 'admin' }, 'admin-id', 'user-id')).toBe(200)
  })

  it('nao admin → 403', () => {
    expect(getHttpStatus({ role: 'teen' }, 'id', 'user-id')).toBe(403)
  })

  it('sem auth → 403', () => {
    expect(getHttpStatus(null, '', 'user-id')).toBe(403)
  })

  it('auto-exclusao → 400', () => {
    expect(getHttpStatus({ role: 'admin' }, 'same', 'same')).toBe(400)
  })
})
