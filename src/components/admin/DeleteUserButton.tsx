'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function DeleteUserButton({ userId, userName }: { userId: string; userName: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`Excluir "${userName}"? Esta ação não pode ser desfeita.`)) return
    setLoading(true)
    const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    } else {
      const data = await res.json()
      alert(data.error ?? 'Erro ao excluir usuário')
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs text-red-500 hover:text-red-400 hover:bg-red-500/10 px-2 py-1 rounded transition-colors disabled:opacity-50"
    >
      {loading ? '...' : 'Excluir'}
    </button>
  )
}
