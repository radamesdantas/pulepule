import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: teenMissionId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/auth/login', req.url))

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'parent') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  const { error } = await supabase
    .from('teen_missions')
    .update({ parent_approved: true })
    .eq('id', teenMissionId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.redirect(new URL('/parent', req.url))
}
