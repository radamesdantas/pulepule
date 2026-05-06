import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PATHS = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/reset-password',
  '/auth/update-password',
  '/auth/callback',
]

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith('/auth/'))

  // Não autenticado tentando acessar rota protegida
  if (!user && !isPublic) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Admin tentando acessar rota não-admin → redireciona para /admin
  if (user && user.user_metadata?.role === 'admin' && !pathname.startsWith('/admin') && !isPublic) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Não-admin tentando acessar /admin/* → redireciona para seu dashboard
  if (user && pathname.startsWith('/admin') && user.user_metadata?.role !== 'admin') {
    const role = user.user_metadata?.role ?? 'teen'
    const dest = role === 'parent' ? '/parent' : role === 'mentor' ? '/mentor' : '/teen'
    return NextResponse.redirect(new URL(dest, request.url))
  }

  // Autenticado tentando acessar login/signup → redireciona para dashboard
  if (user && (pathname === '/auth/login' || pathname === '/auth/signup')) {
    const role = user.user_metadata?.role ?? 'teen'
    if (role === 'admin') return NextResponse.redirect(new URL('/admin', request.url))
    const onboarded = user.user_metadata?.onboarded
    if (!onboarded) return NextResponse.redirect(new URL('/onboarding', request.url))
    const dest = role === 'parent' ? '/parent' : role === 'mentor' ? '/mentor' : '/teen'
    return NextResponse.redirect(new URL(dest, request.url))
  }

  // Autenticado já fez onboarding, tentando acessar /onboarding novamente
  if (user && pathname === '/onboarding' && user.user_metadata?.onboarded) {
    const role = user.user_metadata?.role ?? 'teen'
    const dest = role === 'parent' ? '/parent' : role === 'mentor' ? '/mentor' : '/teen'
    return NextResponse.redirect(new URL(dest, request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
