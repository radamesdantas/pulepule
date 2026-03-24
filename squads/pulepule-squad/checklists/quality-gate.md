# Quality Gate — Pule Pule

## Build
- [ ] `npm run build` passa sem erros
- [ ] Zero warnings de TypeScript
- [ ] Zero warnings de Next.js no build

## Banco de Dados
- [ ] Todas as tabelas existem no Supabase
- [ ] RLS habilitado em todas as tabelas
- [ ] Funções PL/pgSQL operacionais
- [ ] Triggers ativos na teen_missions
- [ ] 48 missões seedadas
- [ ] 24 competências seedadas

## Fluxos Críticos
- [ ] Signup (teen/parent/mentor) → onboarding → dashboard
- [ ] Teen: iniciar missão → submeter entrega → aguardar aprovação
- [ ] Mentor: ver fila → aprovar → notificação enviada ao teen
- [ ] Mentor: rejeitar com feedback → notificação enviada ao teen
- [ ] Parent: vincular teen → ver stats → aprovar missão
- [ ] Streak diário: daily_checkin incrementa corretamente
- [ ] Avanço de fase: 8 missões aprovadas → current_phase sobe
- [ ] Badge: primeira missão aprovada → badge concedido + notificação
- [ ] Reset de senha: email enviado → link funciona → senha atualizada

## Deploy
- [ ] Variáveis de ambiente configuradas no Netlify
- [ ] Deploy production bem-sucedido
- [ ] URL https://pulepule.netlify.app respondendo
