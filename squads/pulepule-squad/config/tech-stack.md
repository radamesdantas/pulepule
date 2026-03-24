# Tech Stack — Pule Pule

## Frontend
- Next.js 15.3.9 (App Router, SSR, Server Components)
- React 19
- TypeScript 5
- Tailwind CSS 4 (@tailwindcss/postcss)
- Fontes: Outfit (headings) + Inter (body)

## Backend
- Supabase (PostgreSQL 17 + Auth + RLS)
- @supabase/supabase-js v2 (browser)
- @supabase/ssr v0.9 (server-side)

## Deploy
- Netlify + @netlify/plugin-nextjs v5
- Project ID: 62348567-feb3-4978-b512-50a5145f0086
- URL: https://pulepule.netlify.app

## Cores Customizadas (Tailwind)
- teen-purple: #8b5cf6
- parent-blue: #3b82f6
- xp-gold: #f59e0b
- level-up: #10b981

## Padrões
- Server Components por padrão, 'use client' apenas para interatividade
- Supabase server client para SSR, browser client para forms/actions
- RLS enforça acesso no banco — não duplicar validação no app
- Triggers PL/pgSQL para efeitos colaterais (notificações, badges, fase)
