'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function CheckinTrigger({ teenId }: { teenId: string }) {
  useEffect(() => {
    const supabase = createClient()
    supabase.rpc('daily_checkin', { p_teen_id: teenId }).then(() => {
      // Checkin silencioso — não exibe nada ao usuário
    })
  }, [teenId])

  return null
}
