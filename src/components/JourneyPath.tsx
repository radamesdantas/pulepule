'use client'

interface Behavior {
  id: string
  title: string
  competencyName: string
  competencyIcon: string
  competencyCode: string
  status: 'locked' | 'available' | 'in_progress' | 'completed'
  xpReward: number
  index: number
}

function NodeConnector({ fromPos, toPos }: { fromPos: string; toPos: string }) {
  // Conectores visuais entre nós do caminho
  if (fromPos === toPos) {
    return <div className="w-0.5 h-8 bg-gradient-to-b from-gray-700 to-gray-800 mx-auto" />
  }
  // Diagonal: linha leve indicando mudança de lado
  return (
    <div className="relative h-8 flex items-center justify-center">
      <div className="w-0.5 h-full bg-gradient-to-b from-gray-700 to-gray-800 absolute left-1/2 -translate-x-1/2" />
    </div>
  )
}

interface Props {
  behaviors: Behavior[]
  onSelectBehavior: (id: string) => void
}

export default function JourneyPath({ behaviors, onSelectBehavior }: Props) {
  // Group by competency (every 3 behaviors)
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

  // Snake pattern positions
  const positions = ['center', 'right', 'center', 'left'] as const
  function getPosition(globalIndex: number) {
    return positions[globalIndex % positions.length]
  }

  let globalIndex = 0

  return (
    <div className="relative py-4">
      {groups.map((group) => (
        <div key={group.competencyCode}>
          {/* Competency header */}
          <div className="flex items-center justify-center gap-2 my-8 first:mt-0">
            <div className="h-px bg-gray-700 flex-1" />
            <div className="bg-gray-800 border border-gray-700 rounded-full px-4 py-2 flex items-center gap-2 shrink-0">
              <span className="text-lg">{group.competencyIcon}</span>
              <span className="text-sm font-bold text-white">{group.competencyName}</span>
            </div>
            <div className="h-px bg-gray-700 flex-1" />
          </div>

          {/* Behavior nodes */}
          <div className="flex flex-col">
            {group.items.map((behavior, itemIndex) => {
              const currentPos = getPosition(globalIndex)
              const nextPos = getPosition(globalIndex + 1)
              globalIndex++
              const alignment =
                currentPos === 'left'
                  ? 'mr-auto ml-8'
                  : currentPos === 'right'
                    ? 'ml-auto mr-8'
                    : 'mx-auto'

              return (
                <div key={behavior.id} className="flex flex-col items-center">
                  <div className={`flex flex-col items-center w-fit ${alignment}`}>
                    {/* Node */}
                    <button
                      onClick={() => behavior.status !== 'locked' && onSelectBehavior(behavior.id)}
                      disabled={behavior.status === 'locked'}
                      className={`relative w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all shadow-lg ${
                        behavior.status === 'completed'
                          ? 'bg-level-up text-white shadow-level-up/30'
                          : behavior.status === 'in_progress'
                            ? 'bg-parent-blue text-white shadow-parent-blue/30 ring-4 ring-parent-blue/30 animate-pulse'
                            : behavior.status === 'available'
                              ? 'bg-teen-purple text-white shadow-teen-purple/40 hover:scale-110 cursor-pointer ring-4 ring-teen-purple/20'
                              : 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-40 border border-gray-700'
                      }`}
                    >
                      {behavior.status === 'completed'
                        ? '✓'
                        : behavior.status === 'locked'
                          ? '🔒'
                          : behavior.competencyIcon}

                      {/* XP badge */}
                      {behavior.status !== 'locked' && (
                        <span className="absolute -bottom-1 -right-1 bg-xp-gold text-white text-[11px] font-black rounded-full px-1.5 py-0.5 shadow">
                          +{behavior.xpReward}
                        </span>
                      )}
                    </button>

                    {/* Title */}
                    <p
                      className={`text-xs mt-2 text-center max-w-[120px] leading-tight ${
                        behavior.status === 'locked' ? 'text-gray-600' : 'text-gray-300'
                      }`}
                    >
                      {behavior.title}
                    </p>
                  </div>

                  {/* Conector entre nós (exceto no último do grupo) */}
                  {itemIndex < group.items.length - 1 && (
                    <NodeConnector fromPos={currentPos} toPos={nextPos} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
