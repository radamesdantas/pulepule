'use client'

import { useState, useEffect } from 'react'
import EagleMascot from './EagleMascot'

export default function SplashScreen() {
  const [fading, setFading] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 13500)
    const goneTimer = setTimeout(() => setGone(true), 15000)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(goneTimer)
    }
  }, [])

  if (gone) return null

  return (
    <div
      className={`fixed inset-0 z-50 bg-gray-950 flex flex-col items-center justify-center transition-opacity duration-[1500ms] ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <EagleMascot width={200} height={240} animate />
      <p className="text-white font-black text-3xl mt-8 font-outfit tracking-tight">Pule Pule</p>
      <p className="text-gray-500 text-sm mt-2 tracking-widest uppercase">
        carregando sua jornada...
      </p>
    </div>
  )
}
