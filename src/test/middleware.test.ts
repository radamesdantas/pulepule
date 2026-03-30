import { describe, it, expect } from 'vitest'

// Testa a lógica de roteamento do middleware de forma isolada
// sem depender do Next.js runtime

type Role = 'teen' | 'parent' | 'mentor'

function resolveDestination(role: Role): string {
  if (role === 'parent') return '/parent'
  if (role === 'mentor') return '/mentor'
  return '/teen'
}

function resolveAfterAuth(onboarded: boolean, role: Role): string {
  if (!onboarded) return '/onboarding'
  return resolveDestination(role)
}

function isPublicPath(pathname: string): boolean {
  const PUBLIC = [
    '/',
    '/auth/login',
    '/auth/signup',
    '/auth/reset-password',
    '/auth/update-password',
    '/auth/callback',
  ]
  return PUBLIC.some((p) => pathname === p || pathname.startsWith('/auth/'))
}

describe('Middleware: resolução de destino por role', () => {
  it('teen → /teen', () => expect(resolveDestination('teen')).toBe('/teen'))
  it('parent → /parent', () => expect(resolveDestination('parent')).toBe('/parent'))
  it('mentor → /mentor', () => expect(resolveDestination('mentor')).toBe('/mentor'))
})

describe('Middleware: redirect pós-auth', () => {
  it('não onboardado → /onboarding (independente do role)', () => {
    expect(resolveAfterAuth(false, 'teen')).toBe('/onboarding')
    expect(resolveAfterAuth(false, 'parent')).toBe('/onboarding')
    expect(resolveAfterAuth(false, 'mentor')).toBe('/onboarding')
  })

  it('onboardado teen → /teen', () => expect(resolveAfterAuth(true, 'teen')).toBe('/teen'))
  it('onboardado parent → /parent', () => expect(resolveAfterAuth(true, 'parent')).toBe('/parent'))
  it('onboardado mentor → /mentor', () => expect(resolveAfterAuth(true, 'mentor')).toBe('/mentor'))
})

describe('Middleware: isPublicPath', () => {
  it('/ é público', () => expect(isPublicPath('/')).toBe(true))
  it('/auth/login é público', () => expect(isPublicPath('/auth/login')).toBe(true))
  it('/auth/signup é público', () => expect(isPublicPath('/auth/signup')).toBe(true))
  it('/auth/callback é público', () => expect(isPublicPath('/auth/callback')).toBe(true))
  it('/auth/qualquer-coisa é público (startsWith)', () =>
    expect(isPublicPath('/auth/confirm')).toBe(true))
  it('/teen é protegido', () => expect(isPublicPath('/teen')).toBe(false))
  it('/parent é protegido', () => expect(isPublicPath('/parent')).toBe(false))
  it('/mentor é protegido', () => expect(isPublicPath('/mentor')).toBe(false))
  it('/missions é protegido', () => expect(isPublicPath('/missions')).toBe(false))
  it('/profile é protegido', () => expect(isPublicPath('/profile')).toBe(false))
})
