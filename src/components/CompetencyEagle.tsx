/**
 * CompetencyEagle — 12 variações da aguiazinha, uma por competência.
 * Cada aguiazinha mantém a estrutura base mas tem:
 *   – paleta de cores própria (asas, corpo)
 *   – símbolo no peito representando o tema
 *
 * IDs correspondem à ordem de inserção na migration 004:
 *   13-24 Dimensão Comportamental (CC01-CC12)
 */

interface Theme {
  wing1: string // asa externa (mais escura)
  wing2: string // asa média
  wing3: string // asa interna (mais clara)
  body: string // corpo/peito
  crest: string // crista
  label: string // cor do label de fundo
}

// ── Paletas das 12 competências comportamentais ──────────────────────────────

const THEMES: Record<number, Theme> = {
  // Comportamental
  13: {
    wing1: '#7C2D12',
    wing2: '#EA580C',
    wing3: '#FB923C',
    body: '#EA580C',
    crest: '#7C2D12',
    label: '#431407',
  }, // Iniciativa    — laranja-fogo
  14: {
    wing1: '#7F1D1D',
    wing2: '#B91C1C',
    wing3: '#EF4444',
    body: '#B91C1C',
    crest: '#7F1D1D',
    label: '#450A0A',
  }, // Persistência  — vermelho forte
  15: {
    wing1: '#78350F',
    wing2: '#D97706',
    wing3: '#FCD34D',
    body: '#D97706',
    crest: '#78350F',
    label: '#451A03',
  }, // Coragem       — ouro-leão
  16: {
    wing1: '#713F12',
    wing2: '#F59E0B',
    wing3: '#FDE68A',
    body: '#F59E0B',
    crest: '#713F12',
    label: '#451A03',
  }, // Qualidade     — âmbar brilhante
  17: {
    wing1: '#1E3A8A',
    wing2: '#2563EB',
    wing3: '#BFDBFE',
    body: '#2563EB',
    crest: '#1E3A8A',
    label: '#1E3A8A',
  }, // Comprometimento— azul cobalto
  18: {
    wing1: '#0C4A6E',
    wing2: '#0369A1',
    wing3: '#7DD3FC',
    body: '#0369A1',
    crest: '#0C4A6E',
    label: '#082F49',
  }, // Pesquisa      — azul oceano
  19: {
    wing1: '#881337',
    wing2: '#E11D48',
    wing3: '#FDA4AF',
    body: '#E11D48',
    crest: '#881337',
    label: '#4C0519',
  }, // Metas         — rosa-fúcsia
  20: {
    wing1: '#1E3A5F',
    wing2: '#3B82F6',
    wing3: '#BAE6FD',
    body: '#3B82F6',
    crest: '#1E3A5F',
    label: '#1D4ED8',
  }, // Planejamento  — azul céu
  21: {
    wing1: '#022C22',
    wing2: '#059669',
    wing3: '#6EE7B7',
    body: '#059669',
    crest: '#022C22',
    label: '#064E3B',
  }, // Networking    — esmeralda
  22: {
    wing1: '#1E3A5F',
    wing2: '#0284C7',
    wing3: '#7DD3FC',
    body: '#0284C7',
    crest: '#1E3A5F',
    label: '#0C4A6E',
  }, // Autoconfiança — safira
  23: {
    wing1: '#2E1065',
    wing2: '#7C3AED',
    wing3: '#C4B5FD',
    body: '#7C3AED',
    crest: '#2E1065',
    label: '#1D0042',
  }, // Autorresponsab.— índigo
  24: {
    wing1: '#0C0F2E',
    wing2: '#1D4ED8',
    wing3: '#93C5FD',
    body: '#1D4ED8',
    crest: '#0C0F2E',
    label: '#172554',
  }, // Visão         — azul noite
}

// ── Símbolos do peito (SVG paths centrados em 60,80 ±10) ─────────────────────

function ChestSymbol({ id }: { id: number }) {
  const w = 'white'
  const s = {
    stroke: w,
    strokeWidth: '1.8',
    fill: 'none',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (id) {
    case 13: // Iniciativa — foguete
      return (
        <>
          <path d="M60 70 L65 82 L63 82 L63 88 L57 88 L57 82 L55 82 Z" fill={w} opacity="0.9" />
          <ellipse cx="60" cy="73" rx="3" ry="4" fill={w} opacity="0.9" />
          <path d="M53 86 Q51 90 54 91 L57 88" fill={w} opacity="0.7" />
          <path d="M67 86 Q69 90 66 91 L63 88" fill={w} opacity="0.7" />
        </>
      )
    case 14: // Persistência — seta para cima (força)
      return (
        <>
          <path d="M60 70 L53 79 L57 79 L57 90 L63 90 L63 79 L67 79 Z" fill={w} opacity="0.9" />
        </>
      )
    case 15: // Coragem — escudo
      return (
        <>
          <path
            d="M52 73 L60 71 L68 73 L68 82 Q68 88 60 91 Q52 88 52 82 Z"
            fill={w}
            opacity="0.9"
          />
          <path
            d="M56 80 L59 83 L64 77"
            stroke={THEMES[15].wing1}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </>
      )
    case 16: // Qualidade — estrela (5 pontas)
      return (
        <polygon
          points="60,71 62.5,77.5 69,77.5 64,81.5 66,88 60,84 54,88 56,81.5 51,77.5 57.5,77.5"
          fill={w}
          opacity="0.9"
        />
      )
    case 17: // Comprometimento — troféu
      return (
        <>
          <path d="M54 72 L54 80 Q54 86 60 87 Q66 86 66 80 L66 72 Z" fill={w} opacity="0.9" />
          <path d="M54 74 Q49 74 49 79 Q49 84 54 84" {...s} opacity="0.8" />
          <path d="M66 74 Q71 74 71 79 Q71 84 66 84" {...s} opacity="0.8" />
          <rect x="56" y="87" width="8" height="2.5" fill={w} opacity="0.9" />
          <rect x="53" y="89.5" width="14" height="2" fill={w} opacity="0.9" />
        </>
      )
    case 18: // Pesquisa — lupa
      return (
        <>
          <circle cx="57" cy="77" r="7" {...s} opacity="0.9" />
          <line
            x1="62"
            y1="82"
            x2="69"
            y2="89"
            stroke={w}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </>
      )
    case 19: // Metas — alvo com seta
      return (
        <>
          <circle cx="60" cy="80" r="9" {...s} opacity="0.9" />
          <circle cx="60" cy="80" r="5" {...s} opacity="0.9" />
          <circle cx="60" cy="80" r="2" fill={w} opacity="0.9" />
          <path d="M65 70 L67 76 L61 74 Z" fill={w} opacity="0.9" />
          <line x1="60" y1="80" x2="65" y2="72" stroke={w} strokeWidth="1.5" />
        </>
      )
    case 20: // Planejamento — checklist
      return (
        <>
          <rect
            x="51"
            y="71"
            width="18"
            height="20"
            rx="2"
            fill={w}
            opacity="0.15"
            stroke={w}
            strokeWidth="1.5"
          />
          <line
            x1="56"
            y1="76"
            x2="65"
            y2="76"
            stroke={w}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <line
            x1="56"
            y1="80"
            x2="65"
            y2="80"
            stroke={w}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <line
            x1="56"
            y1="84"
            x2="62"
            y2="84"
            stroke={w}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M53 76 L54.5 77.5 L57 74.5"
            stroke={w}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M53 80 L54.5 81.5 L57 78.5"
            stroke={w}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )
    case 21: // Networking — três nós conectados
      return (
        <>
          <circle cx="60" cy="72" r="4" fill={w} opacity="0.9" />
          <circle cx="51" cy="86" r="4" fill={w} opacity="0.9" />
          <circle cx="69" cy="86" r="4" fill={w} opacity="0.9" />
          <line x1="60" y1="76" x2="53" y2="83" stroke={w} strokeWidth="1.5" />
          <line x1="60" y1="76" x2="67" y2="83" stroke={w} strokeWidth="1.5" />
          <line x1="55" y1="86" x2="65" y2="86" stroke={w} strokeWidth="1.5" />
        </>
      )
    case 22: // Autoconfiança — diamante
      return <path d="M60 70 L68 78 L60 90 L52 78 Z" fill={w} opacity="0.9" />
    case 23: // Autorresponsabilidade — balança
      return (
        <>
          <line x1="60" y1="71" x2="60" y2="89" stroke={w} strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="75" x2="70" y2="75" stroke={w} strokeWidth="2" strokeLinecap="round" />
          <path d="M50 75 L47 83 L53 83 Z" fill={w} opacity="0.9" />
          <path d="M70 75 L67 83 L73 83 Z" fill={w} opacity="0.9" />
          <rect x="56" y="88" width="8" height="2" fill={w} opacity="0.9" />
        </>
      )
    case 24: // Visão — olho
      return (
        <>
          <path d="M51 80 Q60 70 69 80 Q60 90 51 80 Z" fill={w} opacity="0.9" />
          <circle cx="60" cy="80" r="3.5" fill={THEMES[24].wing1} opacity="0.9" />
          <circle cx="61" cy="78.5" r="1.2" fill={w} opacity="0.7" />
        </>
      )
    default:
      return (
        <polygon
          points="60,72 62.5,78 68,78 63.5,81.5 65.5,87 60,83.5 54.5,87 56.5,81.5 52,78 57.5,78"
          fill={w}
          opacity="0.9"
        />
      )
  }
}

// ── Componente principal ──────────────────────────────────────────────────────

interface Props {
  competencyId: number
  competencyName: string
  size?: number
}

export default function CompetencyEagle({ competencyId, competencyName, size = 80 }: Props) {
  const t = THEMES[competencyId] ?? THEMES[13]
  const h = Math.round(size * 1.2)

  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        width={size}
        height={h}
        viewBox="0 0 120 144"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sombra */}
        <ellipse cx="60" cy="138" rx="22" ry="5" fill="#000" opacity="0.15" />

        {/* Asa esquerda */}
        <path d="M37 68 C18 56 6 38 15 24 C19 17 28 21 33 29 C37 34 37 50 37 68Z" fill={t.wing1} />
        <path d="M37 68 C21 60 13 46 20 33 C23 27 30 30 34 37 C36 42 37 54 37 68Z" fill={t.wing2} />
        <path d="M37 68 C26 62 20 52 25 42 C27 37 33 39 35 45 C36 49 37 58 37 68Z" fill={t.wing3} />

        {/* Asa direita */}
        <path
          d="M83 68 C102 56 114 38 105 24 C101 17 92 21 87 29 C83 34 83 50 83 68Z"
          fill={t.wing1}
        />
        <path
          d="M83 68 C99 60 107 46 100 33 C97 27 90 30 86 37 C84 42 83 54 83 68Z"
          fill={t.wing2}
        />
        <path
          d="M83 68 C94 62 100 52 95 42 C93 37 87 39 85 45 C84 49 83 58 83 68Z"
          fill={t.wing3}
        />

        {/* Cauda */}
        <path d="M50 95 L60 112 L70 95Z" fill={t.wing1} />
        <path d="M44 93 L55 108 L60 95Z" fill={t.wing2} />
        <path d="M76 93 L65 108 L60 95Z" fill={t.wing2} />

        {/* Corpo */}
        <ellipse cx="60" cy="76" rx="23" ry="25" fill={t.body} />
        <ellipse cx="60" cy="84" rx="14" ry="16" fill="rgba(255,255,255,0.15)" />

        {/* Símbolo do peito */}
        <ChestSymbol id={competencyId} />

        {/* Pescoço */}
        <ellipse cx="60" cy="50" rx="12" ry="8" fill={t.body} />

        {/* Cabeça */}
        <circle cx="60" cy="40" r="19" fill={t.body} />
        <ellipse cx="60" cy="40" rx="14.5" ry="14" fill="white" />

        {/* Crista */}
        <path d="M51 27 L48 16 L54 26" fill={t.crest} />
        <path d="M60 25 L60 13 L63 24" fill={t.wing2} />
        <path d="M69 27 L72 16 L66 26" fill={t.crest} />
        <path d="M55 26 L54 18 L58 25" fill={t.wing3} />
        <path d="M65 26 L66 18 L62 25" fill={t.wing3} />

        {/* Olhos */}
        <circle cx="53.5" cy="37.5" r="5" fill="#1A1A2E" />
        <circle cx="66.5" cy="37.5" r="5" fill="#1A1A2E" />
        <circle cx="55" cy="35.8" r="1.8" fill="white" />
        <circle cx="68" cy="35.8" r="1.8" fill="white" />
        <path
          d="M49 32 Q53.5 29 58 32"
          stroke={t.wing2}
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M62 32 Q66.5 29 71 32"
          stroke={t.wing2}
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />

        {/* Bico */}
        <path d="M55 44 L60 44 L65 44 L60 53Z" fill="#F7B731" />
        <path d="M55 44 L60 48.5 L65 44 L60 44Z" fill="#E6A800" />

        {/* Bochechas */}
        <ellipse cx="48" cy="41" rx="4" ry="2.5" fill="#FF9BAD" opacity="0.5" />
        <ellipse cx="72" cy="41" rx="4" ry="2.5" fill="#FF9BAD" opacity="0.5" />

        {/* Garras */}
        <path
          d="M50 99 C46 104 43 108 41 111"
          stroke="#F7B731"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M52 100 C50 106 49 110 48 113"
          stroke="#F7B731"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M54 100 C54 106 54 110 55 113"
          stroke="#F7B731"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M70 99 C74 104 77 108 79 111"
          stroke="#F7B731"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M68 100 C70 106 71 110 72 113"
          stroke="#F7B731"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M66 100 C66 106 66 110 65 113"
          stroke="#F7B731"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Label com nome da competência */}
      <span
        className="text-[11px] font-black tracking-wide uppercase px-3 py-0.5 rounded-full text-white/90"
        style={{ backgroundColor: t.label }}
      >
        {competencyName}
      </span>
    </div>
  )
}
