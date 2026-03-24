'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

const FILTERS = [
  { value: 'all', label: 'Todas' },
  { value: 'available', label: 'Disponíveis' },
  { value: 'in_progress', label: 'Em progresso' },
  { value: 'submitted', label: 'Enviadas' },
  { value: 'approved', label: 'Concluídas' },
]

export default function MissionFilter({ current }: { current: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function setFilter(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('status')
    } else {
      params.set('status', value)
    }
    router.push(`${pathname}${params.size ? '?' + params.toString() : ''}`)
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => setFilter(f.value)}
          className={`shrink-0 text-sm font-semibold px-4 py-1.5 rounded-full transition-all ${
            current === f.value
              ? 'bg-teen-purple text-white shadow-sm shadow-teen-purple/30'
              : 'bg-white text-gray-500 border border-gray-200 hover:border-teen-purple/40'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
