import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Groq from 'groq-sdk'

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

  // Busca ou cria o registro de teen_mission (auto-start se ainda não iniciou)
  const { data: tmExisting } = await supabase
    .from('teen_missions')
    .select('id, status')
    .eq('teen_id', user.id)
    .eq('mission_id', missionId)
    .single()

  // Já aprovado — não precisa validar de novo
  if (tmExisting?.status === 'approved') {
    return NextResponse.json({ error: 'Comportamento já foi aprovado.' }, { status: 400 })
  }

  // Se não existe ou está available, cria/atualiza para in_progress automaticamente
  if (!tmExisting || tmExisting.status === 'available') {
    const { error: upsertErr } = await supabase
      .from('teen_missions')
      .upsert(
        { teen_id: user.id, mission_id: missionId, status: 'in_progress' },
        { onConflict: 'teen_id,mission_id' }
      )
    if (upsertErr) {
      return NextResponse.json(
        { error: 'Erro ao iniciar missão. Tente novamente.' },
        { status: 500 }
      )
    }
  }

  // Re-busca para pegar o id atualizado
  const { data: tm } = await supabase
    .from('teen_missions')
    .select('id, status')
    .eq('teen_id', user.id)
    .eq('mission_id', missionId)
    .single()
  if (!tm) {
    return NextResponse.json({ error: 'Erro ao registrar missão.' }, { status: 500 })
  }

  // Chama Groq (Llama) para validar a narração
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  // Usa o exemplo específico da missão; fallback para o mapa genérico por contexto
  const missionExample = (mission as { example?: string | null }).example
  const contextExample = missionExample || CONTEXT_EXAMPLES[mission.context] || ''

  const prompt = `Você avalia narrativas de adolescentes (13-18 anos) em um programa de desenvolvimento de liderança.

=== REFERÊNCIA DA MISSÃO ===
Título: ${mission.title}
O que fazer: ${mission.description}
${contextExample ? `Exemplo prático (como deveria ser feito): ${contextExample}` : ''}

=== NARRATIVA DO PARTICIPANTE ===
"${narration.trim()}"

=== CRITÉRIOS DE AVALIAÇÃO ===
Compare a narrativa com os dois campos de referência acima ("O que fazer" e "Exemplo prático").

APROVE somente se:
1. O participante descreveu uma ação REAL que ele fez (não apenas planejou)
2. O comportamento descrito é COERENTE com "O que fazer" — mesma direção, mesmo princípio
3. Se houver "Exemplo prático", a narrativa segue a mesma lógica do exemplo (pode ser diferente em detalhes, mas não pode contradizer o espírito do exemplo)
4. Tem pelo menos 2 frases com detalhes concretos

REJEITE se:
- A narrativa contradiz "O que fazer" (ex: missão pede adaptar comunicação por pessoa, teen descreve tratando todos igual)
- A narrativa inverte a lógica do "Exemplo prático" (ex: exemplo mostra ser direto com quem é direto, teen descreve o oposto)
- For claramente inventado, fora do tema ou vago demais para avaliar

Aprovar comportamento errado não ajuda o jovem a crescer. Seja preciso na avaliação e gentil no feedback.

Responda APENAS com JSON válido, sem markdown, sem texto adicional:
{"approved": true, "feedback": "Parabéns! [elogio específico em 1 frase]"}
ou
{"approved": false, "feedback": "[explique em 1-2 frases o que está errado e como corrigir]"}`

  let raw: string
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 300,
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }],
    })
    raw = completion.choices[0]?.message?.content?.trim() ?? '{}'
  } catch (aiErr) {
    console.error('Groq API error:', aiErr instanceof Error ? aiErr.message : String(aiErr))
    return NextResponse.json(
      {
        error:
          'Serviço de validação temporariamente indisponível. Tente novamente em alguns minutos.',
      },
      { status: 503 }
    )
  }

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
