import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

const CONTEXT_EXAMPLES: Record<string, string> = {
  escola:
    'Liderei meu grupo no trabalho de ciências. Dividi as tarefas, criei um cronograma e apresentamos o melhor trabalho da turma.',
  familia:
    'Organizei uma reunião familiar no domingo para discutir as tarefas da semana. Cada pessoa escolheu sua responsabilidade e montamos um quadro na geladeira.',
  amigos:
    'Com a Ana, que é direta, fui reto ao ponto. Com o Lucas, que é mais sensível, comecei perguntando como ele estava antes de falar o que precisava.',
  casa: 'Organizei as rotinas domésticas da semana com minha família. Cada um escolheu sua responsabilidade e combinamos como acompanhar o progresso.',
  pessoal:
    'Defini um objetivo claro para o mês, criei um plano com etapas e acompanhei meu progresso semanalmente até concluir.',
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: missionId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  // Só bloqueia se soubermos EXPLICITAMENTE que não é teen (mentor/pai)
  // Se profile for null (falha de RLS ou sessão), deixa passar — o check de teen_mission garante autorização
  if (profile && profile.role !== 'teen') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  const body = await req.json()
  const narration: string = body.narration ?? ''
  if (narration.trim().length < 20) {
    return NextResponse.json({ error: 'Narração muito curta.' }, { status: 400 })
  }

  // Busca dados da missão (inclui example para usar no prompt)
  const { data: mission } = await supabase
    .from('missions')
    .select('title, description, context, xp_reward, example')
    .eq('id', missionId)
    .single()
  if (!mission) return NextResponse.json({ error: 'Missão não encontrada' }, { status: 404 })

  // Verifica que a teen_mission está in_progress
  const { data: tm } = await supabase
    .from('teen_missions')
    .select('id, status')
    .eq('teen_id', user.id)
    .eq('mission_id', missionId)
    .single()
  if (!tm || tm.status !== 'in_progress') {
    return NextResponse.json({ error: 'Missão não está em progresso' }, { status: 400 })
  }

  // Chama Claude Haiku para validar a narração
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  // Usa o exemplo específico da missão; fallback para o mapa genérico por contexto
  const missionExample = (mission as { example?: string | null }).example
  const contextExample = missionExample || CONTEXT_EXAMPLES[mission.context] || ''

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: `Você avalia narrativas de adolescentes (13-18 anos) em um programa de desenvolvimento de liderança. Seja encorajador e generoso: aprove sempre que o teen demonstrar que FEZ algo relacionado à missão, mesmo que a narrativa seja simples.

Missão: ${mission.title}
O que deveria ser feito: ${mission.description}
${contextExample ? `Exemplo de como poderia ser feito: ${contextExample}` : ''}

Narrativa do participante:
"${narration.trim()}"

Aprove se a narrativa:
- Descreve algo que o participante realmente fez (não só planejou)
- Tem relação com o tema da missão (mesmo que parcial)
- Tem pelo menos 2 frases com algum detalhe

Rejeite apenas se for claramente inventado, completamente fora do tema ou tão vago que não dá para entender o que foi feito.

Responda APENAS com JSON válido, sem texto adicional:
{"approved": true, "feedback": "Parabéns! [elogio específico e motivador em 1 frase]"}
ou
{"approved": false, "feedback": "[dica clara e gentil do que melhorar, máximo 2 frases]"}`,
      },
    ],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : '{}'

  let approved = false
  let feedback = 'Tente detalhar melhor o que você fez e como fez.'

  try {
    const parsed = JSON.parse(raw)
    approved = Boolean(parsed.approved)
    feedback = String(parsed.feedback ?? feedback)
  } catch {
    // Se o parse falhar, nega com feedback padrão
  }

  if (approved) {
    // Aprova diretamente e concede XP
    await supabase
      .from('teen_missions')
      .update({
        status: 'approved',
        evidence_description: narration.trim(),
        completed_at: new Date().toISOString(),
      })
      .eq('id', tm.id)

    const { data: currentXp } = await supabase
      .from('teen_xp')
      .select('total_xp, current_level, autonomy_index')
      .eq('teen_id', user.id)
      .single()

    if (currentXp) {
      const newTotal = (currentXp.total_xp ?? 0) + mission.xp_reward
      const newLevel = Math.floor(newTotal / 500) + 1
      const newAutonomy = Math.min(100, (currentXp.autonomy_index ?? 0) + 2)

      await supabase
        .from('teen_xp')
        .update({
          total_xp: newTotal,
          current_level: newLevel,
          autonomy_index: newAutonomy,
          updated_at: new Date().toISOString(),
        })
        .eq('teen_id', user.id)
    }
  } else {
    // Salva a narração rejeitada para histórico mas mantém in_progress
    await supabase
      .from('teen_missions')
      .update({ evidence_description: narration.trim() })
      .eq('id', tm.id)
  }

  return NextResponse.json({
    approved,
    feedback,
    xpReward: approved ? mission.xp_reward : 0,
  })
}
