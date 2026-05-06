-- ============================================================
-- 008: Remover competências de gestão (CG01-CG12) e suas missões
-- Manter apenas 12 competências comportamentais (CC01-CC12)
-- com 36 comportamentos redistribuídos nas fases 1-4
-- ============================================================

-- 1. Limpar dados existentes
TRUNCATE public.teen_missions CASCADE;
TRUNCATE public.missions;
DELETE FROM public.competencies;
ALTER SEQUENCE competencies_id_seq RESTART WITH 1;

-- 2. Inserir 12 competências comportamentais (CC01-CC12)
-- Redistribuídas: 3 por fase, 1 por mês
INSERT INTO public.competencies (name, description, category, phase, xp_reward, icon, code) VALUES
-- Fase 1 — Meses 1-3
('Iniciativa',            'Age sem precisar ser mandado e cria oportunidades onde outros veem obstáculos',  'behavioral', 1, 100, '🚀', 'CC01'),
('Persistência',          'Não desiste diante de obstáculos e busca alternativas até encontrar o caminho',  'behavioral', 1, 100, '💪', 'CC02'),
('Coragem',               'Toma decisões difíceis com clareza, reduzindo riscos sem evitar os desafios',    'behavioral', 1, 100, '🦁', 'CC03'),
-- Fase 2 — Meses 4-6
('Qualidade',             'Entrega acima do esperado e cria sistemas para manter o padrão consistente',     'behavioral', 2, 150, '⭐', 'CC04'),
('Comprometimento',       'Assume resultados, colabora com genuinidade e prioriza relações de longo prazo', 'behavioral', 2, 150, '🏆', 'CC05'),
('Pesquisa',              'Investiga ativamente o mundo ao seu redor e busca orientação de quem sabe mais', 'behavioral', 2, 150, '🔍', 'CC06'),
-- Fase 3 — Meses 7-9
('Metas',                 'Define objetivos desafiantes, constrói visão de longo prazo e mede o progresso', 'behavioral', 3, 200, '🎯', 'CC07'),
('Planejamento',          'Divide grandes desafios em etapas e adapta planos quando o cenário muda',        'behavioral', 3, 200, '📋', 'CC08'),
('Networking',            'Constrói e cultiva relacionamentos genuínos antes de precisar deles',             'behavioral', 3, 200, '🌐', 'CC09'),
-- Fase 4 — Meses 10-12
('Autoconfiança',         'Confia no próprio julgamento e transmite segurança sem arrogância',              'behavioral', 4, 250, '💎', 'CC10'),
('Autorresponsabilidade', 'Age sem precisar de ordem, assume os resultados e mantém o grupo focado',        'behavioral', 4, 250, '⚖️', 'CC11'),
('Visão',                 'Enxerga conexões entre áreas, conecta ações ao propósito maior e antecipa',      'behavioral', 4, 250, '🔭', 'CC12');

-- ============================================================
-- 3. Inserir 36 comportamentos (3 por competência)
-- Fase 1 · Meses 1-3 · CC01-CC03 · XP 50-70
-- ============================================================

-- CC01 Iniciativa (competency_id=1) · Mês 1
INSERT INTO public.missions (title, description, example, context, phase, competency_id, xp_reward, month) VALUES
('Ajo antes de ser pedido',
 'Quando vejo que algo vai dar errado ou que uma oportunidade está surgindo, ajo antes de alguém me pedir — sem precisar que me empurrem.',
 'O prazo do trabalho se aproxima e o grupo não começou. Sem esperar o líder agir, você começa sua parte e avisa o grupo.',
 'pessoal', 1, 1, 50, 1),

('Busco melhorar meu ambiente',
 'Procuro ativamente formas de melhorar o ambiente ao meu redor — em casa, na escola, no grupo — sem esperar que alguém me mande fazer isso.',
 'A sala de estudos está bagunçada e todo mundo reclama mas ninguém faz nada. Você organiza no intervalo e sugere um sistema de manutenção.',
 'casa', 1, 1, 60, 1),

('Aproveito oportunidades incomuns',
 'Quando surge uma oportunidade fora do comum (um projeto diferente, uma conexão inesperada), reconheço e ajo rapidamente — mesmo sem ter certeza do resultado.',
 'Um executivo visita a escola. Em vez de sair rápido, você o aborda com uma pergunta relevante e troca contatos. Pode ser uma mentoria futura.',
 'pessoal', 1, 1, 70, 1),

-- CC02 Persistência (competency_id=2) · Mês 2
('Não desisto diante de obstáculos',
 'Quando enfrento dificuldades — uma matéria difícil, um conflito, uma rejeição — não desisto na primeira pedra. Busco alternativas até achar um caminho.',
 'Reprovado no primeiro processo seletivo. Em vez de desistir, você pede feedback, melhora o currículo e se inscreve em 3 outros na semana seguinte.',
 'pessoal', 1, 2, 50, 2),

('Reavalia e tenta de outro jeito',
 'Quando um plano não funciona, paro, reavalio o que aconteceu e tento de um jeito diferente — sem abandonar o objetivo.',
 'Estudou 2 horas por dia e não melhorou. Para, analisa o método, percebe que precisa de exercícios práticos — não só leitura. Muda a abordagem.',
 'pessoal', 1, 2, 60, 2),

('Dou mais do que o suficiente',
 'Quando algo é importante para mim, faço mais do que o mínimo necessário — dedico tempo e energia extras além do que a maioria faria.',
 'O trabalho pedido era 5 páginas. Você entrega 7 com gráficos e fontes extras porque o tema importa para você. Por escolha, não por obrigação.',
 'pessoal', 1, 2, 70, 2),

-- CC03 Coragem (competency_id=3) · Mês 3
('Avalio alternativas antes de decidir o difícil',
 'Antes de tomar decisões difíceis (mudar de escola, terminar uma amizade, enfrentar alguém), levanto e avalio diferentes opções — incluindo as desconfortáveis.',
 'Antes de encerrar a amizade com o Lucas, você lista alternativas: conversa direta, tempo afastado, redefinir limites. Só depois escolhe o caminho.',
 'pessoal', 1, 3, 50, 3),

('Busco reduzir o risco de errar',
 'Antes de me comprometer com algo, procuro reduzir as chances de erro — não para evitar a decisão, mas para decidir com mais clareza e segurança.',
 'Antes de se candidatar para liderar o projeto, você conversa com quem já fez isso antes e se prepara para os obstáculos mais comuns.',
 'pessoal', 1, 3, 60, 3),

('Aceito desafios que me tiram da zona de conforto',
 'Aceito desafios que me assustam um pouco — não fujo do que é difícil, mas também não me jogo em riscos desnecessários só para parecer corajoso.',
 'Te convidam para falar para 200 alunos. Você sente o frio na barriga, mas aceita — prepara bem, ensaia com antecedência e entrega.',
 'pessoal', 1, 3, 70, 3),

-- ============================================================
-- Fase 2 · Meses 4-6 · CC04-CC06 · XP 70-90
-- ============================================================

-- CC04 Qualidade (competency_id=4) · Mês 4
('Melhoro mesmo o que já está bom',
 'Melhoro continuamente meu trabalho, meus hábitos e minhas habilidades — mesmo quando o resultado já seria aceito por todos.',
 'O trabalho ficou bom. Mas antes de entregar, você relê e melhora 3 parágrafos. A diferença entre 7 e 9 está nos detalhes que a maioria ignora.',
 'escola', 2, 4, 70, 4),

('Vou além do que foi pedido',
 'Quando faço algo para alguém (um favor, um trabalho em grupo, uma ajuda em casa), busco superar o que foi combinado — faço melhor do que o mínimo esperado.',
 'Pediram para você organizar a lista de chamada. Você entrega a lista + um sistema de controle de presença que facilita as próximas reuniões.',
 'amigos', 2, 4, 80, 4),

('Tenho sistemas para garantir a qualidade',
 'Crio listas, rotinas ou checagens para garantir que entrego com qualidade — não dependo só de memória ou boa vontade do momento.',
 'Antes de entregar qualquer trabalho, você passa por um checklist: ortografia, fontes, coerência com o que foi pedido, formatação.',
 'pessoal', 2, 4, 90, 4),

-- CC05 Comprometimento (competency_id=5) · Mês 5
('Assumo meus resultados sem jogar culpa',
 'Quando algo dá errado na minha vida, assumo minha parte da responsabilidade — não fico culpando os outros, o sistema ou a sorte.',
 'Tirou nota baixa na prova. Em vez de dizer "a prova foi difícil demais", você diz: "Não estudei o conteúdo certo. Na próxima vou revisar com o professor antes."',
 'pessoal', 2, 5, 70, 5),

('Trabalho junto quando o coletivo é melhor',
 'Prefiro trabalhar em grupo quando o resultado coletivo seria melhor do que o individual — não insisto em fazer sozinho só para controlar tudo.',
 'Você poderia fazer o projeto sozinho em 3 dias. Mas em grupo com mais 3 pessoas ficaria melhor. Você escolhe o grupo mesmo perdendo o controle total.',
 'amigos', 2, 5, 80, 5),

('Priorizo o relacionamento ao invés de ganhos imediatos',
 'Coloco o relacionamento de longo prazo acima de uma vantagem de curto prazo — não abro mão da confiança de alguém por um ganho imediato.',
 'Você poderia ganhar o debate humilhando o oponente. Mas ele é seu amigo. Você vence com argumentos, sem destruir a relação.',
 'amigos', 2, 5, 90, 5),

-- CC06 Pesquisa (competency_id=6) · Mês 6
('Investigo meu mundo pessoalmente',
 'Busco entender meu ambiente de forma ativa — converso com pessoas diferentes, leio, assisto, ouço. Não fico esperando a informação chegar até mim.',
 'Antes de escolher uma carreira, você conversa com 5 profissionais da área, lê 2 livros e assiste entrevistas. Decisão baseada em pesquisa real.',
 'pessoal', 2, 6, 70, 6),

('Procuro sempre formas novas de fazer',
 'Investigo ativamente como melhorar o que faço — busco referências, experimento jeitos novos, aprendo com quem é diferente de mim.',
 'Seu método de estudo parou de funcionar. Em vez de insistir, você pesquisa técnicas como Pomodoro e flashcards e testa por 2 semanas.',
 'pessoal', 2, 6, 80, 6),

('Busco orientação de quem sabe mais',
 'Quando preciso tomar decisões importantes, procuro a orientação de alguém com mais experiência — não acho que já sei tudo sobre o assunto.',
 'Antes de abrir seu primeiro empreendimento, você procura um mentor com experiência. Vai com perguntas específicas e anota tudo.',
 'pessoal', 2, 6, 90, 6),

-- ============================================================
-- Fase 3 · Meses 7-9 · CC07-CC09 · XP 90-110
-- ============================================================

-- CC07 Metas (competency_id=7) · Mês 7
('Persigo objetivos desafiantes',
 'Tenho objetivos pessoais que me exigem esforço real — não me contento com o mínimo para passar ou cumprir o combinado.',
 'Em vez de mirar a nota mínima para passar, você define 8,5 como objetivo e cria um plano para chegar lá.',
 'pessoal', 3, 7, 90, 7),

('Tenho visão clara do que quero construir',
 'Tenho uma imagem clara de onde quero estar em 3 a 5 anos — para minha vida, meus estudos, minhas relações e minha contribuição para a família e o mundo.',
 'Você escreve sua visão de vida em 5 anos: onde quer estar profissionalmente, que tipo de líder quer ser, como quer contribuir para a empresa da família.',
 'pessoal', 3, 7, 100, 7),

('Sei como vou medir se cheguei lá',
 'Quando me proponho algo, sei exatamente como vou medir se consegui ou não — não fico com objetivos vagos como "quero melhorar".',
 '"Quero melhorar em inglês" vira: "Vou ser aprovado no B2 First até dezembro, estudando 1 hora por dia." Objetivo com número, prazo e método.',
 'pessoal', 3, 7, 110, 7),

-- CC08 Planejamento (competency_id=8) · Mês 8
('Enfrento grandes desafios por etapas',
 'Diante de desafios grandes (uma prova difícil, um projeto longo, uma meta ambiciosa), divido em etapas menores em vez de tentar resolver tudo de uma vez.',
 'Tem uma apresentação em 3 semanas. Semana 1: pesquisa. Semana 2: estrutura. Semana 3: ensaios. Divide e o problema some.',
 'pessoal', 3, 8, 90, 8),

('Adapto meus planos quando o cenário muda',
 'Quando as circunstâncias mudam (cancelamento de planos, resultado inesperado, mudança de situação), adapto meus planos rapidamente sem entrar em colapso.',
 'A data da prova mudou e bagunçou sua semana. Em vez de entrar em pânico, você redistribui o cronograma em 20 minutos e segue em frente.',
 'pessoal', 3, 8, 100, 8),

('Considero recursos disponíveis nos meus planos',
 'Ao planejar algo, levo em conta o que tenho disponível (tempo, dinheiro, energia) — não faço planos que dependem de recursos que não tenho.',
 'Quer estudar fora. Antes de se empolgar, calcula: quanto custa, quanto você tem, quanto tempo leva para juntar. O plano só avança se os números fecham.',
 'pessoal', 3, 8, 110, 8),

-- CC09 Networking (competency_id=9) · Mês 9
('Construo alianças para meus projetos',
 'Quando tenho um projeto ou objetivo, penso em quem pode me apoiar e crio estratégias para conquistar esse apoio — não espero que as pessoas apareçam sozinhas.',
 'Para seu projeto, você mapeia: professor especialista, colega designer, amigo empresário. Aborda cada um com propósito específico.',
 'amigos', 3, 9, 90, 9),

('Sei quem são as pessoas-chave e me relaciono com elas',
 'Identifico quem são as pessoas influentes nos ambientes que frequento e cultivo relacionamentos genuínos com elas — não por interesse imediato, mas por respeito mútuo.',
 'Você identifica os alunos que influenciam a turma, o professor mais conectado com oportunidades e o coordenador que abre portas. Constrói relações genuínas.',
 'amigos', 3, 9, 100, 9),

('Invisto em relacionamentos antes de precisar deles',
 'Mantenho relacionamentos com pessoas de diferentes áreas e grupos — invisto nessas conexões antes de precisar delas, não apenas quando quero algo.',
 'Você mantém contato com ex-professores e antigos líderes de projetos. Quando surge uma oportunidade, sua rede já existe.',
 'amigos', 3, 9, 110, 9),

-- ============================================================
-- Fase 4 · Meses 10-12 · CC10-CC12 · XP 110-150
-- ============================================================

-- CC10 Autoconfiança (competency_id=10) · Mês 10
('Confio no meu próprio julgamento',
 'Confio nas minhas opiniões mesmo quando diferem da maioria — defendo minha posição com argumentos, não cedo só porque todo mundo pensa diferente.',
 'Todo o grupo quer a solução rápida, mas você vê um risco que eles ignoram. Apresenta os dados e defende sua posição com calma.',
 'pessoal', 4, 10, 110, 10),

('Mantenho o otimismo diante de críticas',
 'Quando recebo críticas ou enfrento oposição, mantenho-me determinado e otimista — sem ficar paralisado ou amargo pela rejeição.',
 'Seu projeto foi rejeitado. Em vez de desanimar, você pede feedback específico, melhora o que foi apontado e reapresenta na semana seguinte.',
 'pessoal', 4, 10, 130, 10),

('Transmito segurança para as pessoas ao meu redor',
 'Minha postura transmite confiança para as pessoas ao meu redor — quando estou presente, os outros se sentem mais seguros, não mais ansiosos.',
 'Na véspera da apresentação, o grupo está em pânico. Você mantém a calma, diz "estamos prontos, revisamos tudo" — o clima muda.',
 'amigos', 4, 10, 150, 10),

-- CC11 Autorresponsabilidade (competency_id=11) · Mês 11
('Vejo o problema e ajo sem precisar de ordem',
 'Quando identifico um problema ou oportunidade na minha vida ou no meu grupo, tomo a iniciativa de agir — sem esperar que alguém me diga o que fazer.',
 'A turma está sem monitor para cálculo. Você identifica o problema, fala com o professor e se oferece para organizar um grupo de estudos.',
 'amigos', 4, 11, 110, 11),

('Envolvo o grupo e assumo os resultados',
 'Quando lidero algo, envolvo todos na construção da solução e assumo os resultados — sejam bons ou ruins — sem culpar quem me ajudou.',
 'O projeto que você liderou ficou abaixo do esperado. Em vez de culpar o grupo, você diz: "O resultado foi minha responsabilidade — deveria ter ajustado antes."',
 'amigos', 4, 11, 130, 11),

('Mantenho o grupo focado mesmo sob pressão',
 'Quando o grupo entra em pânico, se dispersa ou perde o foco, ajudo a manter a direção — sem me desesperar junto com os outros.',
 'Faltam 2 horas para a apresentação e o grupo entrou em colapso. Você lista o que ainda dá para fazer, divide tarefas e retoma o ritmo.',
 'amigos', 4, 11, 150, 11),

-- CC12 Visão (competency_id=12) · Mês 12
('Enxergo como um problema num lugar afeta outro',
 'Quando algo vai mal numa área da minha vida (escola, família, amizades), percebo como isso está conectado a outras áreas — e ajo de forma integrada.',
 'Suas notas caíram. Investiga e descobre que conflito com amigos está consumindo sua energia mental. Resolve o relacionamento, as notas sobem.',
 'pessoal', 4, 12, 110, 12),

('Conecto o trabalho do grupo ao propósito maior',
 'Explico para o meu grupo por que o que estamos fazendo importa — o "para quê" além do "o quê", conectando as tarefas a um propósito maior.',
 '"Por que estamos fazendo essa pesquisa?" — "Porque um dia podemos liderar a empresa da família. Essa pesquisa é nosso primeiro passo."',
 'amigos', 4, 12, 130, 12),

('Uso informações externas para antecipar decisões',
 'Uso o que aprendo em diferentes contextos (leituras, conversas, experiências) para antecipar decisões na minha própria vida — não fico esperando o problema chegar.',
 'Lê que o mercado valoriza soft skills mais que diplomas. Antecipa: começa a desenvolver liderança e comunicação agora, não espera o mercado exigir.',
 'pessoal', 4, 12, 150, 12);
