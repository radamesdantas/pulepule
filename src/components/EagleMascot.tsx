'use client'

import { useState, useEffect } from 'react'

interface EagleMascotProps {
  width?: number
  height?: number
  animate?: boolean
}

export default function EagleMascot({
  width = 90,
  height = 108,
  animate = true,
}: EagleMascotProps) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!animate) return
    const id = setInterval(() => setTick((t) => t + 1), 5000)
    return () => clearInterval(id)
  }, [animate])

  const dur = '0.85s'
  const ease = 'cubic-bezier(0.33,0,0.66,1)'
  const iter = animate ? '2 forwards' : 'none'

  return (
    <div
      key={tick}
      style={{ width, height, position: 'relative', overflow: 'visible', display: 'inline-block' }}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 120 144"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sombra */}
        <ellipse
          cx="60"
          cy="138"
          rx="22"
          ry="5"
          fill="#000"
          opacity="0.18"
          style={{ animation: `eagle-shadow ${dur} ${ease} ${iter}`, transformOrigin: 'center' }}
        />
        {/* Corpo principal */}
        <g
          style={{
            animation: `eagle-jump ${dur} ${ease} ${iter}`,
            transformOrigin: 'center bottom',
          }}
        >
          {/* Asa esquerda */}
          <g
            style={{
              transformOrigin: '100% 50%',
              animation: `eagle-wing-l ${dur} ${ease} ${iter}`,
            }}
          >
            <path
              d="M37 68 C18 56 6 38 15 24 C19 17 28 21 33 29 C37 34 37 50 37 68Z"
              fill="rgb(59,45,151)"
            />
            <path
              d="M37 68 C21 60 13 46 20 33 C23 27 30 30 34 37 C36 42 37 54 37 68Z"
              fill="rgb(70,53,177)"
            />
            <path
              d="M37 68 C26 62 20 52 25 42 C27 37 33 39 35 45 C36 49 37 58 37 68Z"
              fill="rgb(128,115,216)"
            />
          </g>
          {/* Asa direita */}
          <g
            style={{ transformOrigin: '0% 50%', animation: `eagle-wing-r ${dur} ${ease} ${iter}` }}
          >
            <path
              d="M83 68 C102 56 114 38 105 24 C101 17 92 21 87 29 C83 34 83 50 83 68Z"
              fill="rgb(59,45,151)"
            />
            <path
              d="M83 68 C99 60 107 46 100 33 C97 27 90 30 86 37 C84 42 83 54 83 68Z"
              fill="rgb(70,53,177)"
            />
            <path
              d="M83 68 C94 62 100 52 95 42 C93 37 87 39 85 45 C84 49 83 58 83 68Z"
              fill="rgb(128,115,216)"
            />
          </g>
          {/* Cauda */}
          <g style={{ transformOrigin: '50% 0%', animation: `eagle-tail ${dur} ${ease} ${iter}` }}>
            <path d="M50 95 L60 112 L70 95Z" fill="rgb(59,45,151)" />
            <path d="M44 93 L55 108 L60 95Z" fill="rgb(70,53,177)" />
            <path d="M76 93 L65 108 L60 95Z" fill="rgb(70,53,177)" />
          </g>
          {/* Barriga */}
          <ellipse cx="60" cy="76" rx="23" ry="25" fill="#4F3CC9" />
          <ellipse cx="60" cy="84" rx="14" ry="16" fill="rgb(234,232,249)" />
          {/* Estrela no peito */}
          <polygon
            points="60,72 62.5,78 68,78 63.5,81.5 65.5,87 60,83.5 54.5,87 56.5,81.5 52,78 57.5,78"
            fill="#F7B731"
          />
          {/* Pescoço */}
          <ellipse cx="60" cy="50" rx="12" ry="8" fill="#4F3CC9" />
          {/* Cabeça */}
          <circle cx="60" cy="40" r="19" fill="#4F3CC9" />
          <ellipse cx="60" cy="40" rx="14.5" ry="14" fill="white" />
          {/* Crista */}
          <path d="M51 27 L48 16 L54 26" fill="#4F3CC9" />
          <path d="M60 25 L60 13 L63 24" fill="rgb(70,53,177)" />
          <path d="M69 27 L72 16 L66 26" fill="#4F3CC9" />
          <path d="M55 26 L54 18 L58 25" fill="rgb(167,158,228)" />
          <path d="M65 26 L66 18 L62 25" fill="rgb(167,158,228)" />
          {/* Olhos */}
          <g
            style={{
              transformOrigin: 'center center',
              animation: `eagle-blink 2.8s ease-in-out ${iter}`,
            }}
          >
            <circle cx="53.5" cy="37.5" r="5" fill="#1A1A2E" />
            <circle cx="66.5" cy="37.5" r="5" fill="#1A1A2E" />
            <circle cx="55" cy="35.8" r="1.8" fill="white" />
            <circle cx="68" cy="35.8" r="1.8" fill="white" />
            <path
              d="M49 32 Q53.5 29 58 32"
              stroke="rgb(70,53,177)"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M62 32 Q66.5 29 71 32"
              stroke="rgb(70,53,177)"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
            />
          </g>
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
        </g>
      </svg>
    </div>
  )
}
