import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: missionId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/auth/login', _req.url))

  const { error } = await supabase
    .from('teen_missions')
    .upsert({
      teen_id: user.id,
      mission_id: missionId,
      status: 'in_progress',
    }, { onConflict: 'teen_id,mission_id' })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.redirect(new URL('/missions', _req.url))
}
