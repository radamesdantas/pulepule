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

  // Busca a missão para saber o XP
  const { data: tm } = await supabase
    .from('teen_missions')
    .select('*, mission:missions(xp_reward, competency_id)')
    .eq('id', teenMissionId)
    .single()

  if (!tm) return NextResponse.json({ error: 'Missão não encontrada' }, { status: 404 })

  const mission = tm.mission as { xp_reward: number; competency_id: number } | null
  const xpReward = mission?.xp_reward ?? 50

  // Aprova a missão (o trigger notify_mission_update cuida das notificações)
  await supabase
    .from('teen_missions')
    .update({ status: 'approved', completed_at: new Date().toISOString() })
    .eq('id', teenMissionId)

  // Adiciona XP ao teen
  const { data: currentXp } = await supabase
    .from('teen_xp')
    .select('total_xp, current_level, autonomy_index')
    .eq('teen_id', tm.teen_id)
    .single()

  if (currentXp) {
    const newTotal = (currentXp.total_xp ?? 0) + xpReward
    const newLevel = Math.floor(newTotal / 500) + 1
    const newAutonomy = Math.min(100, (currentXp.autonomy_index ?? 0) + 2)

    await supabase
      .from('teen_xp')
      .update({
        total_xp: newTotal,
        current_level: newLevel,
        autonomy_index: newAutonomy,
        updated_at: new Date().toISOString(),
      })
      .eq('teen_id', tm.teen_id)
  }

  return NextResponse.redirect(new URL('/mentor', req.url), 303)
}
