import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const type = searchParams.get('type')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Redefinição de senha — vai para a página de atualizar senha
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/auth/update-password`)
      }

      // Confirmação de email — redireciona para onboarding ou dashboard
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const onboarded = user.user_metadata?.onboarded
        const role = user.user_metadata?.role ?? 'teen'
        if (!onboarded) return NextResponse.redirect(`${origin}/onboarding`)
        const dest = role === 'parent' ? '/parent' : role === 'mentor' ? '/mentor' : '/teen'
        return NextResponse.redirect(`${origin}${dest}`)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=confirmation_failed`)
}
