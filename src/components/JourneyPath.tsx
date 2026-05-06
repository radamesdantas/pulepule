'use client'

import CompetencyEagle from '@/components/CompetencyEagle'

interface Behavior {
  id: string
  number: number
  total: number
  title: string
  competencyName: string
  competencyIcon: string
  competencyCode: string
  status: 'locked' | 'available' | 'in_progress' | 'completed'
  xpReward: number
  index: number
}

function NodeConnector({ completed }: { completed?: boolean }) {
  return (
    <div
      className={`w-px h-8 mx-auto ${
        completed
          ? 'bg-gradient-to-b from-level-up/60 to-level-up/20'
          : 'bg-gradient-to-b from-teen-purple/40 to-teen-purple/10'
      }`}
    />
  )
}

interface Props {
  behaviors: Behavior[]
  onSelectBehavior: (id: string) => void
}

export default function JourneyPath({ behaviors, onSelectBehavior }: Props) {
  // Agrupa por competência
  const groups: {
    competencyName: string
    competencyIcon: string
    competencyCode: string
    items: Behavior[]
  }[] = []

  behaviors.forEach((b) => {
    const last = groups[groups.length - 1]
    if (last && last.competencyCode === b.competencyCode) {
      last.items.push(b)
    } else {
      groups.push({
        competencyName: b.competencyName,
        competencyIcon: b.competencyIcon,
        competencyCode: b.competencyCode,
        items: [b],
      })
    }
  })

  // Posições snake para os nós (sem left/right extremo — espaço reservado para a águia)
  const positions = ['center', 'right', 'center', 'left'] as const
  let globalIndex = 0

  return (
    <div className="relative py-4">
      {groups.map((group, groupIndex) => {
        // ID numérico da competência extraído do competencyCode ("behavioral-3" → 3)
        const competencyId = parseInt(group.competencyCode.split('-')[1] ?? '1', 10)

        // Águia alterna: grupos pares → esquerda, ímpares → direita
        const eagleSide = groupIndex % 2 === 0 ? 'left' : 'right'

        // Captura os índices dos nós deste grupo antes de iterar
        const groupStartIndex = globalIndex

        const nodeElements = group.items.map((behavior, itemIndex) => {
          const pos = positions[globalIndex % positions.length]
          globalIndex++

          // Alinhamento do nó — deixa espaço do lado onde a águia vai ficar
          const alignment =
            pos === 'left'
              ? 'mr-auto ml-20' // distante da borda esquerda (onde pode ter águia)
              : pos === 'right'
                ? 'ml-auto mr-20' // distante da borda direita
                : 'mx-auto'

          return (
            <div key={behavior.id} className="flex flex-col items-center">
              <div className={`flex flex-col items-center w-fit ${alignment}`}>
                {/* Nó */}
                <button
                  onClick={() => behavior.status !== 'locked' && onSelectBehavior(behavior.id)}
                  disabled={behavior.status === 'locked'}
                  className={`relative w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all shadow-lg ${
                    behavior.status === 'completed'
                      ? 'bg-level-up text-white shadow-level-up/30'
                      : behavior.status === 'in_progress'
                        ? 'bg-parent-blue text-white shadow-parent-blue/30 ring-4 ring-parent-blue/30 animate-pulse'
                        : behavior.status === 'available'
                          ? 'bg-teen-purple text-white shadow-teen-purple/40 hover:scale-110 cursor-pointer ring-4 ring-teen-purple/20'
                          : 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-40 border border-gray-700'
                  }`}
                >
                  {behavior.status === 'completed' ? (
                    <>
                      <span className="text-white text-xl leading-none">✓</span>
                      <span className="text-white/70 text-[10px] font-black leading-none mt-0.5">
                        #{behavior.number}
                      </span>
                    </>
                  ) : behavior.status === 'locked' ? (
                    <>
                      <span className="text-gray-500 text-base leading-none">🔒</span>
                      <span className="text-gray-600 text-[10px] font-black leading-none mt-0.5">
                        #{behavior.number}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-white font-black text-base leading-none">
                        {behavior.number}
                      </span>
                      <span className="text-white/70 text-base leading-none">
                        {behavior.competencyIcon}
                      </span>
                    </>
                  )}
                </button>

                {/* Título */}
                <p
                  className={`text-xs mt-2 text-center max-w-[100px] leading-tight ${
                    behavior.status === 'locked' ? 'text-gray-600' : 'text-gray-300'
                  }`}
                >
                  {behavior.title}
                </p>
              </div>

              {/* Conector (exceto no último do grupo) */}
              {itemIndex < group.items.length - 1 && (
                <NodeConnector completed={behavior.status === 'completed'} />
              )}
            </div>
          )
        })

        // Suprimir warning de variável não usada
        void groupStartIndex

        return (
          <div key={group.competencyCode} className="relative mb-6 mt-10 first:mt-2">
            {/* Aguiazinha temática — posicionada ao lado do caminho, no centro vertical do grupo */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 z-10 ${
                eagleSide === 'left' ? 'left-0' : 'right-0'
              }`}
            >
              <CompetencyEagle
                competencyId={competencyId}
                competencyName={group.competencyName}
                size={80}
              />
            </div>

            {/* Linha divisória */}
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="h-px bg-gray-800 flex-1" />
              <span className="text-gray-500 text-[10px] font-semibold tracking-widest uppercase">
                {group.competencyName}
              </span>
              <div className="h-px bg-gray-800 flex-1" />
            </div>

            {/* Nós dos comportamentos */}
            <div className="flex flex-col">{nodeElements}</div>
          </div>
        )
      })}
    </div>
  )
}
