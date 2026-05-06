import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: userId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  if (user.id === userId) {
    return NextResponse.json(
      { error: 'Não é possível excluir seu próprio usuário' },
      { status: 400 }
    )
  }

  const { error } = await supabase.rpc('admin_delete_user', { target_user_id: userId })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
