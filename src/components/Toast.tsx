'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

const MESSAGES: Record<string, { text: string; icon: string; color: string }> = {
  submitted: { text: 'Entrega enviada! Aguardando avaliação do mentor.', icon: '📤', color: 'bg-blue-600' },
  approved: { text: 'Missão aprovada! XP creditado.', icon: '✅', color: 'bg-green-600' },
  linked: { text: 'Teen vinculado com sucesso!', icon: '🔗', color: 'bg-teen-purple' },
  updated: { text: 'Senha atualizada com sucesso!', icon: '🔐', color: 'bg-level-up' },
}

export default function Toast() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [msg, setMsg] = useState<{ text: string; icon: string; color: string } | null>(null)

  useEffect(() => {
    const key = Array.from(searchParams.keys()).find(k => MESSAGES[k])
    if (key) {
      setMsg(MESSAGES[key])
      setVisible(true)
      // Remove o query param sem reload
      const params = new URLSearchParams(searchParams.toString())
      params.delete(key)
      router.replace(`${pathname}${params.size ? '?' + params.toString() : ''}`, { scroll: false })
      setTimeout(() => setVisible(false), 4000)
    }
  }, [searchParams])

  if (!visible || !msg) return null

  return (
    <div className={`fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 ${msg.color} text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-fade-in whitespace-nowrap`}>
      <span className="text-lg">{msg.icon}</span>
      {msg.text}
    </div>
  )
}
