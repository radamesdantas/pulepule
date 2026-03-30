import Link from 'next/link'
import EagleMascot from '@/components/EagleMascot'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 overflow-hidden">
      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 relative flex items-center justify-center">
          <div className="flex items-center gap-1.5">
            <EagleMascot width={34} height={40.8} />
            <span className="font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-teen-purple to-parent-blue font-outfit">
              Pule Pule
            </span>
          </div>
          <div className="absolute right-4 flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-gray-400 hover:text-teen-purple transition-colors hidden sm:block"
            >
              Entrar
            </Link>
            <Link
              href="/auth/signup"
              className="bg-gradient-to-r from-teen-purple to-parent-blue text-white text-sm font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-all"
            >
              Começar
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="pt-20 min-h-screen flex flex-col">
        <div className="flex-1 bg-gray-950 relative overflow-hidden flex items-center border-b border-gray-800">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-teen-purple/8 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-parent-blue/8 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 py-24 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white text-center lg:text-left">
                <div className="flex justify-center mb-6 lg:hidden">
                  <EagleMascot width={130} height={156} />
                </div>

                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-sm font-medium">
                  🦅 Plataforma de Liderança para Jovens Protagonistas
                </div>

                <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 tracking-display font-outfit">
                  Chegou a hora de
                  <br />
                  <span className="text-xp-gold">pular do ninho.</span> 🦅
                </h1>

                <p className="text-xl text-white/80 mb-8 max-w-lg mx-auto lg:mx-0">
                  Jornada de <strong>12 meses</strong> que transforma jovens e adolescentes em
                  líderes empreendedores — com gamificação, mentoria e missões reais.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center justify-center gap-2 bg-white text-teen-purple font-black text-lg px-8 py-4 rounded-2xl hover:bg-white/90 transition-all shadow-2xl active:scale-95"
                  >
                    Começar Agora 🚀
                  </Link>
                  <Link
                    href="#como-funciona"
                    className="inline-flex items-center justify-center gap-2 bg-white/15 backdrop-blur-sm text-white font-bold text-lg px-8 py-4 rounded-2xl hover:bg-white/25 transition-all"
                  >
                    Saiba mais
                  </Link>
                </div>

                {/* Badges de gamificação */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-8">
                  {['⚡ +120 XP', '✅ Voo concluído!', '🔥 Nível 5', '🏅 Badge desbloqueado!'].map(
                    (s) => (
                      <div
                        key={s}
                        className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium"
                      >
                        {s}
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="hidden lg:flex flex-col items-center gap-6">
                <EagleMascot width={260} height={312} />
                {/* Estatísticas */}
                <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                  {[
                    { n: '24', label: 'Competências' },
                    { n: '160+', label: 'Badges' },
                    { n: '12', label: 'Meses' },
                    { n: '120+', label: 'Atividades' },
                  ].map(({ n, label }) => (
                    <div
                      key={label}
                      className="bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 text-center"
                    >
                      <div className="text-2xl font-black text-xp-gold font-outfit tracking-display">
                        {n}
                      </div>
                      <div className="text-xs text-white/70 font-medium">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PARA QUEM É ────────────────────────────────────────── */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🧑‍🎓',
                title: 'Jovens Protagonistas',
                desc: 'Que querem descobrir seu propósito, desenvolver liderança e sair do ninho com confiança.',
              },
              {
                icon: '👨‍👩‍👧',
                title: 'Pais & Responsáveis',
                desc: 'Que buscam desenvolvimento integral para seus filhos, com acompanhamento real e relatórios mensais detalhados.',
              },
              {
                icon: '🧭',
                title: 'Mentores',
                desc: 'Que querem impactar jovens e adolescentes com missões práticas, validação de entregas e crescimento mensurável.',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-gray-800 rounded-3xl p-6 border border-gray-700">
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="font-black text-white mb-2 font-outfit">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4 tracking-display font-outfit">
              Tudo que você precisa para o seu Voo
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Uma plataforma completa que combina gamificação, mentoria especializada e missões
              reais para formar os próximos líderes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              gradient="from-teen-purple/10 to-purple-100"
              icon="🎮"
              title="Gamificação Real"
              description="Sistema de XP, níveis e badges que tornam o desenvolvimento pessoal viciante e divertido."
              items={[
                {
                  icon: '⚡',
                  title: 'Sistema de XP',
                  desc: 'Cada missão completada ganha pontos. Suba de nível e desbloqueie novos desafios.',
                },
                {
                  icon: '🏅',
                  title: '160+ Badges & Conquistas',
                  desc: 'Bronze, Silver, Gold e Diamond. Colecione conquistas que comprovam seu crescimento.',
                },
                {
                  icon: '🔥',
                  title: 'Streaks Diários',
                  desc: 'Mantenha sua sequência ativa por 7, 30, 100 ou até 267 dias e ganhe bônus especiais.',
                },
              ]}
            />
            <FeatureCard
              gradient="from-parent-blue/10 to-blue-100"
              icon="🧠"
              title="Mentoria Especializada"
              description="Mentores avaliam suas entregas e celebram cada conquista ao longo dos 12 meses."
              items={[
                {
                  icon: '✅',
                  title: 'Validação de Entregas',
                  desc: 'Cada missão é avaliada e confirmada por um mentor real.',
                },
                {
                  icon: '📊',
                  title: 'Índice de Autonomia',
                  desc: 'Acompanhe seu crescimento de 0% a 100% de autonomia ao longo da jornada.',
                },
                {
                  icon: '📋',
                  title: 'Relatórios Mensais',
                  desc: '14-15 páginas documentando seu progresso — competências, conquistas e próximos passos.',
                },
              ]}
            />
            <FeatureCard
              gradient="from-xp-gold/10 to-amber-100"
              icon="🚀"
              title="Missões Reais"
              description="Atividades práticas em 4 contextos: Família, Escola, Comunidade e Empresa."
              items={[
                {
                  icon: '👨‍👩‍👧',
                  title: 'Engajamento Parental',
                  desc: 'Dashboard exclusivo para pais acompanharem o progresso e aprovarem entregas.',
                },
                {
                  icon: '🌟',
                  title: '24 Competências',
                  desc: '12 de Gestão + 12 Comportamentais desenvolvidas ao longo de 12 meses.',
                },
                {
                  icon: '🎓',
                  title: 'Apresentação Final',
                  desc: 'Cerimônia de 120 minutos celebrando a transformação completa do jovem e adolescente líder.',
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── JORNADA 12 MESES ───────────────────────────────────── */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-teen-purple/10 text-teen-purple rounded-full px-4 py-2 text-sm font-bold mb-4">
              🗺️ Jornada Completa
            </div>
            <h2 className="text-4xl font-black text-white mb-4 tracking-display font-outfit">
              12 meses de transformação
            </h2>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              4 fases progressivas que levam o jovem e adolescente de 0% a 100% de autonomia real.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-12">
            {[
              {
                fase: 'Fase 1',
                meses: 'Meses 1–3',
                titulo: 'Descoberta',
                cor: 'from-teen-purple to-purple-400',
                emoji: '🔍',
                desc: 'Autoconhecimento, exploração de oportunidades e fundamentos de liderança.',
              },
              {
                fase: 'Fase 2',
                meses: 'Meses 4–6',
                titulo: 'Experimentação',
                cor: 'from-parent-blue to-blue-400',
                emoji: '🧪',
                desc: 'Gestão financeira, tomada de decisão e primeiras iniciativas reais.',
              },
              {
                fase: 'Fase 3',
                meses: 'Meses 7–9',
                titulo: 'Crescimento',
                cor: 'from-level-up to-emerald-400',
                emoji: '📈',
                desc: 'Negociação, inovação, autonomia plena e networking.',
              },
              {
                fase: 'Fase 4',
                meses: 'Meses 10–12',
                titulo: 'Liderança',
                cor: 'from-xp-gold to-amber-400',
                emoji: '👑',
                desc: 'Pensamento estratégico, mentoria de outros e grande apresentação final.',
              },
            ].map(({ fase, meses, titulo, cor, emoji, desc }) => (
              <div
                key={fase}
                className="bg-gray-800 rounded-3xl overflow-hidden border border-gray-700"
              >
                <div className={`bg-gradient-to-br ${cor} p-5 text-white`}>
                  <div className="text-3xl mb-2">{emoji}</div>
                  <div className="text-xs font-bold uppercase tracking-wider opacity-80">
                    {fase} · {meses}
                  </div>
                  <div className="text-xl font-black mt-1 tracking-display font-outfit">
                    {titulo}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 24 competências */}
          <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700">
            <h3 className="font-black text-white text-xl mb-6 text-center tracking-display font-outfit">
              24 Competências Desenvolvidas
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-bold text-teen-purple uppercase tracking-wider mb-3">
                  12 Competências de Gestão
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Liderança',
                    'Comunicação',
                    'Gestão Financeira',
                    'Tomada de Decisão',
                    'Negociação',
                    'Organização',
                    'Metas',
                    'Networking',
                    'Estratégia',
                    'Inovação',
                    'Planejamento',
                    'Mentoria',
                  ].map((c) => (
                    <span
                      key={c}
                      className="bg-teen-purple/10 text-teen-purple text-xs font-semibold px-3 py-1.5 rounded-full"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-parent-blue uppercase tracking-wider mb-3">
                  12 Competências Comportamentais
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Persistência',
                    'Adaptação',
                    'Comprometimento',
                    'Criatividade',
                    'Autonomia',
                    'Riscos Calculados',
                    'Busca por Qualidade',
                    'Relacionamento',
                    'Inteligência Emocional',
                    'Visão Sistêmica',
                    'Proatividade',
                    'Caráter',
                  ].map((c) => (
                    <span
                      key={c}
                      className="bg-parent-blue/10 text-parent-blue text-xs font-semibold px-3 py-1.5 rounded-full"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ──────────────────────────────────────── */}
      <section id="como-funciona" className="py-24 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4 tracking-display font-outfit">
              Como funciona
            </h2>
            <p className="text-lg text-gray-400">Simples de começar, transformador no resultado</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                icon: '👤',
                title: 'Crie seu perfil',
                desc: 'Escolha seu avatar, configure sua conta e comece sua jornada de construção do Legado.',
              },
              {
                step: '2',
                icon: '🦅',
                title: 'Receba as missões',
                desc: 'Complete pulos dentro de cada voo — atividades práticas nos 4 contextos de aprendizagem.',
              },
              {
                step: '3',
                icon: '⚡',
                title: 'Ganhe XP e suba de nível',
                desc: 'Envie sua prova, ganhe pontos, desbloqueie badges e suba de nível a cada conquista.',
              },
              {
                step: '4',
                icon: '✅',
                title: 'Seja validado',
                desc: 'Seu mentor avalia sua entrega, os pais acompanham e seu crescimento real é confirmado.',
              },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-teen-purple to-parent-blue rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-teen-purple/30">
                  {icon}
                </div>
                <div className="text-xs font-bold text-teen-purple uppercase tracking-wider mb-2">
                  Passo {step}
                </div>
                <h3 className="font-black text-white mb-2 font-outfit">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAIS ───────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-parent-blue/15 text-parent-blue rounded-full px-4 py-2 text-sm font-bold mb-6">
                👨‍👩‍👧 Para Pais & Responsáveis
              </div>
              <h2 className="text-4xl font-black text-white mb-4 tracking-display font-outfit">
                Acompanhe tudo em 5 segundos
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                O dashboard exclusivo para pais mostra o status real do desenvolvimento do seu filho
                — de forma clara, rápida e sem enrolação.
              </p>
              <div className="space-y-4">
                {[
                  {
                    icon: '📊',
                    title: 'Índice de Autonomia',
                    desc: 'Veja a evolução de autonomia do seu filho de 0% a 100% em tempo real.',
                  },
                  {
                    icon: '🔔',
                    title: 'Aprovações Pendentes',
                    desc: 'Valide as entregas do seu filho com um toque. Máx 2 notificações por dia.',
                  },
                  {
                    icon: '📋',
                    title: 'Relatório Mensal em PDF',
                    desc: '14-15 páginas com fotos, competências desenvolvidas, conquistas e próximos passos.',
                  },
                  {
                    icon: '📅',
                    title: 'Reuniões Familiares',
                    desc: 'Reuniões semanais (30min) e mensais (3h) estruturadas para celebrar o crescimento.',
                  },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex gap-4 items-start">
                    <div className="text-2xl mt-0.5">{icon}</div>
                    <div>
                      <div className="font-bold text-white">{title}</div>
                      <div className="text-sm text-gray-400">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700">
              <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                Dashboard dos Pais
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-level-up/10 rounded-2xl">
                  <div>
                    <div className="text-sm font-bold text-white">Status Geral</div>
                    <div className="text-xs text-gray-500">Progresso da semana</div>
                  </div>
                  <span className="text-level-up font-black text-sm">✅ No caminho certo</span>
                </div>
                <div className="p-4 bg-gray-700/50 rounded-2xl">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-bold text-white">Índice de Autonomia</div>
                    <span className="text-teen-purple font-black">42%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-teen-purple to-parent-blue h-2.5 rounded-full"
                      style={{ width: '42%' }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Meta: 50% ao final do Mês 6</div>
                </div>
                <div className="flex justify-between items-center p-4 bg-xp-gold/10 rounded-2xl">
                  <div>
                    <div className="text-sm font-bold text-white">Aprovações pendentes</div>
                    <div className="text-xs text-gray-500">Entregas aguardando revisão</div>
                  </div>
                  <span className="bg-xp-gold text-white font-black text-sm w-8 h-8 flex items-center justify-center rounded-full">
                    3
                  </span>
                </div>
                <div className="p-4 bg-gray-700/50 rounded-2xl">
                  <div className="text-sm font-bold text-white mb-1">Próxima reunião familiar</div>
                  <div className="text-xs text-gray-500">Sábado, 29 de março — 9h00 (30 min)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-teen-purple via-purple-600 to-parent-blue text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <EagleMascot width={90} height={108} />
          <h2 className="text-4xl font-black mt-6 mb-4 tracking-display font-outfit">
            Pronto para pular do ninho?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Comece hoje. 12 meses depois, seu filho será um líder diferente.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-white text-teen-purple font-black text-xl px-10 py-5 rounded-2xl hover:bg-white/90 transition-all shadow-2xl active:scale-95"
          >
            Começar Agora 🚀
          </Link>
          <p className="text-white/50 text-sm mt-4">
            Gratuito para começar · Sem cartão de crédito
          </p>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="py-8 bg-gray-900 text-gray-400 text-center text-sm">
        <div className="flex items-center justify-center gap-1.5 mb-3">
          <EagleMascot width={24} height={28.8} animate={false} />
          <span className="font-black text-white font-outfit">Pule Pule</span>
        </div>
        <p className="mb-2">© 2026 Pule Pule. Todos os direitos reservados.</p>
        <div className="flex justify-center gap-4">
          <Link href="/privacidade" className="hover:text-white transition-colors">
            Privacidade
          </Link>
          <Link href="/termos" className="hover:text-white transition-colors">
            Termos
          </Link>
          <Link href="/contato" className="hover:text-white transition-colors">
            Contato
          </Link>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  gradient,
  icon,
  title,
  description,
  items,
}: {
  gradient: string
  icon: string
  title: string
  description: string
  items: { icon: string; title: string; desc: string }[]
}) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-3xl p-8">
      <div
        className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-2xl mb-5`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-black text-white mb-3 tracking-display font-outfit">{title}</h3>
      <p className="text-gray-400 mb-6 text-sm leading-relaxed">{description}</p>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.title} className="flex gap-3">
            <span className="text-xl">{item.icon}</span>
            <div>
              <div className="font-bold text-gray-200 text-sm">{item.title}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
