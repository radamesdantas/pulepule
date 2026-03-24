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
  if (!profile || profile.role !== 'mentor') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  const body = await req.formData()
  const feedback = body.get('feedback')?.toString() ?? 'Por favor, revise sua entrega.'

  // Rejeita a missão (o trigger notify_mission_update cuida das notificações)
  await supabase
    .from('teen_missions')
    .update({
      status: 'rejected',
      mentor_feedback: feedback,
    })
    .eq('id', teenMissionId)

  return NextResponse.redirect(new URL('/mentor', req.url))
}
