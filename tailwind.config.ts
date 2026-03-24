import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'teen-purple': '#8b5cf6',
        'parent-blue': '#3b82f6',
        'parent-blue-dark': '#2563eb',
        'xp-gold': '#f59e0b',
        'level-up': '#10b981',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
