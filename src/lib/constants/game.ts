// Nomes de nível — usados em TeenGame, leaderboard, parent, report
export const LEVEL_NAMES = [
  'Explorador', // 1
  'Aprendiz', // 2
  'Guerreiro', // 3
  'Herói', // 4
  'Campeão', // 5
  'Veterano', // 6
  'Mestre', // 7
  'Guardião', // 8
  'Lenda', // 9
  'Ícone', // 10
  'Fenômeno', // 11
  'Águia Real', // 12
]

// Rótulos canônicos das 4 fases — índice 0 reservado (fases contam de 1)
export const PHASE_LABELS = ['', 'Descoberta', 'Desenvolvimento', 'Liderança', 'Legado'] as const

// Marcos de streak exibidos na barra de progresso
export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100, 180, 267]

export const XP_PER_LEVEL = 500

export function calculateLevel(totalXp: number): number {
  return Math.floor(totalXp / XP_PER_LEVEL) + 1
}

export function getLevelName(level: number): string {
  return LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)]
}
