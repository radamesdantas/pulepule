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

  // RLS garante que parent só atualiza missões dos seus teens
  // count: 'exact' permite verificar se o update realmente afetou linhas
  const { count, error } = await supabase
    .from('teen_missions')
    .update({ parent_approved: true }, { count: 'exact' })
    .eq('id', teenMissionId)

  if (error || count === 0) {
    return NextResponse.json({ error: 'Missão não encontrada ou não autorizado' }, { status: 404 })
  }

  return NextResponse.redirect(new URL('/parent', req.url))
}
