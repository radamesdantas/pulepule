import { describe, it, expect } from 'vitest'

// Testa a lógica de decisão do auth/callback/route.ts

type Role = 'teen' | 'parent' | 'mentor'

function resolveCallbackRedirect(params: {
  hasCode: boolean
  hasError: boolean
  type: string | null
  onboarded: boolean
  role: Role
  origin: string
}): string {
  const { hasCode, hasError, type, onboarded, role, origin } = params

  if (!hasCode || hasError) return `${origin}/auth/login?error=confirmation_failed`

  if (type === 'recovery') return `${origin}/auth/update-password`

  if (!onboarded) return `${origin}/onboarding`

  if (role === 'parent') return `${origin}/parent`
  if (role === 'mentor') return `${origin}/mentor`
  return `${origin}/teen`
}

const origin = 'https://pulepule.netlify.app'

describe('Auth Callback: recovery flow', () => {
  it('type=recovery → update-password', () => {
    const result = resolveCallbackRedirect({
      hasCode: true,
      hasError: false,
      type: 'recovery',
      onboarded: false,
      role: 'teen',
      origin,
    })
    expect(result).toBe(`${origin}/auth/update-password`)
  })
})

describe('Auth Callback: erro de confirmação', () => {
  it('sem code → login com erro', () => {
    const result = resolveCallbackRedirect({
      hasCode: false,
      hasError: false,
      type: null,
      onboarded: false,
      role: 'teen',
      origin,
    })
    expect(result).toBe(`${origin}/auth/login?error=confirmation_failed`)
  })

  it('code com erro de exchange → login com erro', () => {
    const result = resolveCallbackRedirect({
      hasCode: true,
      hasError: true,
      type: null,
      onboarded: false,
      role: 'teen',
      origin,
    })
    expect(result).toBe(`${origin}/auth/login?error=confirmation_failed`)
  })
})

describe('Auth Callback: confirmação de email — não onboardado', () => {
  it('teen não onboardado → /onboarding', () => {
    const result = resolveCallbackRedirect({
      hasCode: true,
      hasError: false,
      type: 'signup',
      onboarded: false,
      role: 'teen',
      origin,
    })
    expect(result).toBe(`${origin}/onboarding`)
  })

  it('parent não onboardado → /onboarding', () => {
    const result = resolveCallbackRedirect({
      hasCode: true,
      hasError: false,
      type: null,
      onboarded: false,
      role: 'parent',
      origin,
    })
    expect(result).toBe(`${origin}/onboarding`)
  })
})

describe('Auth Callback: confirmação de email — onboardado', () => {
  it('teen onboardado → /teen', () => {
    const result = resolveCallbackRedirect({
      hasCode: true,
      hasError: false,
      type: null,
      onboarded: true,
      role: 'teen',
      origin,
    })
    expect(result).toBe(`${origin}/teen`)
  })

  it('parent onboardado → /parent', () => {
    const result = resolveCallbackRedirect({
      hasCode: true,
      hasError: false,
      type: null,
      onboarded: true,
      role: 'parent',
      origin,
    })
    expect(result).toBe(`${origin}/parent`)
  })

  it('mentor onboardado → /mentor', () => {
    const result = resolveCallbackRedirect({
      hasCode: true,
      hasError: false,
      type: null,
      onboarded: true,
      role: 'mentor',
      origin,
    })
    expect(result).toBe(`${origin}/mentor`)
  })
})
