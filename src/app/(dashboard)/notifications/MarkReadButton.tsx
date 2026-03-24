'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function MarkReadButton({ userId }: { userId: string }) {
  const router = useRouter()

  async function markAll() {
    const supabase = createClient()
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)
    router.refresh()
  }

  return (
    <button
      onClick={markAll}
      className="text-sm text-teen-purple font-semibold hover:underline"
    >
      Marcar todas como lidas
    </button>
  )
}
