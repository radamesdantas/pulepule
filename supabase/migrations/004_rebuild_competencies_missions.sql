-- ============================================================
-- 004: Rebuild competências e missões com os 72 comportamentos
-- Fonte: Diagnostico-Adolescente-72-Comportamentos.md
-- 24 competências (CG01-CG12 + CC01-CC12) × 3 comportamentos = 72
-- ============================================================

-- 1. Limpar dados existentes
TRUNCATE public.teen_missions CASCADE;
TRUNCATE public.missions;
DELETE FROM public.competencies;
ALTER SEQUENCE competencies_id_seq RESTART WITH 1;

-- 2. Atualizar constraint de contexto
ALTER TABLE public.missions DROP CONSTRAINT IF EXISTS missions_context_check;
ALTER TABLE public.missions ADD CONSTRAINT missions_context_check
  CHECK (context IN ('escola', 'familia', 'amigos', 'casa', 'pessoal'));

-- 3. Adicionar colunas novas
ALTER TABLE public.missions ADD COLUMN IF NOT EXISTS example text;
ALTER TABLE public.competencies ADD COLUMN IF NOT EXISTS code text;

-- 4. Inserir 24 competências originais
-- id 1-12: Dimensão Gerencial | id 13-24: Dimensão Comportamental
INSERT INTO public.competencies (name, description, category, phase, xp_reward, icon, code) VALUES
('Liderança',             'Adapta o estilo de liderança conforme a maturidade de cada pessoa',           'management', 1, 100, '🌟', 'CG01'),
('Comunicação',           'Expressa posições com clareza e dá feedback sem atacar',                       'management', 1, 100, '💬', 'CG02'),
('Pessoas',               'Desenvolve intencionalmente os talentos de quem está ao seu redor',            'management', 1, 100, '👥', 'CG03'),
('Decisão',               'Decide com método mesmo sob pressão ou ambiguidade',                           'management', 1, 100, '🎯', 'CG04'),
('Finanças',              'Usa critérios financeiros para gerir seus recursos com inteligência',           'management', 1, 100, '💰', 'CG05'),
('Processos',             'Enxerga e atua sobre o fluxo de trabalho para melhorar resultados',            'management', 1, 100, '⚙️', 'CG06'),
('Negociação',            'Gera acordos de valor para ambas as partes com preparação e escuta',           'management', 2, 150, '🤝', 'CG07'),
('Mudanças',              'Lidera transformações considerando o lado humano de cada pessoa',              'management', 2, 150, '🔄', 'CG08'),
('Inovação',              'Cria condições para que boas ideias apareçam, sejam testadas e gerem resultado', 'management', 2, 150, '💡', 'CG09'),
('Resultado',             'Mantém foco no que realmente importa e filtra decisões pelos objetivos',       'management', 2, 150, '📊', 'CG10'),
('Cultura',               'Vive os valores que declara e constrói ambientes saudáveis ao seu redor',      'management', 2, 150, '🏛️', 'CG11'),
('Sucessão',              'Prepara quem pode continuar seu trabalho e não depende de si',                 'management', 2, 150, '👑', 'CG12'),
('Iniciativa',            'Age sem precisar ser mandado e cria oportunidades onde outros veem obstáculos','behavioral', 3, 150, '🚀', 'CC01'),
('Persistência',          'Não desiste diante de obstáculos e busca alternativas até encontrar o caminho','behavioral', 3, 150, '💪', 'CC02'),
('Coragem',               'Toma decisões difíceis com clareza, reduzindo riscos sem evitar os desafios',  'behavioral', 3, 150, '🦁', 'CC03'),
('Qualidade',             'Entrega acima do esperado e cria sistemas para manter o padrão consistente',   'behavioral', 3, 150, '⭐', 'CC04'),
('Comprometimento',       'Assume resultados, colabora com genuinidade e prioriza relações de longo prazo','behavioral', 3, 150, '🏆', 'CC05'),
('Pesquisa',              'Investiga ativamente o mundo ao seu redor e busca orientação de quem sabe mais','behavioral', 3, 150, '🔍', 'CC06'),
('Metas',                 'Define objetivos desafiantes, constrói visão de longo prazo e mede o progresso','behavioral', 4, 200, '🎯', 'CC07'),
('Planejamento',          'Divide grandes desafios em etapas e adapta planos quando o cenário muda',      'behavioral', 4, 200, '📋', 'CC08'),
('Networking',            'Constrói e cultiva relacionamentos genuínos antes de precisar deles',          'behavioral', 4, 200, '🌐', 'CC09'),
('Autoconfiança',         'Confia no próprio julgamento e transmite segurança sem arrogância',            'behavioral', 4, 200, '💎', 'CC10'),
('Autorresponsabilidade', 'Age sem precisar de ordem, assume os resultados e mantém o grupo focado',      'behavioral', 4, 200, '⚖️', 'CC11'),
('Visão',                 'Enxerga conexões entre áreas, conecta ações ao propósito maior e antecipa',    'behavioral', 4, 200, '🔭', 'CC12');

-- ============================================================
-- 5. Inserir 72 missões (comportamentos/pulos)
-- Fase 1 · Meses 1-3 · CG01-CG06 · XP 50-70
-- ============================================================

-- CG01 Liderança (competency_id=1) · Mês 1
INSERT INTO public.missions (title, description, example, context, phase, competency_id, xp_reward, month) VALUES
('Diagnóstico antes de pedir',
 'Antes de pedir ajuda a um amigo ou colega, verifico se ele tem o conhecimento e a disposição para aquilo — não assumo que todo mundo pode ajudar da mesma forma.',
 'Antes de pedir ao Marcos ajuda com matemática, você verifica se ele entende o assunto e tem tempo. Só depois faz o pedido certo, para a pessoa certa.',
 'escola', 1, 1, 50, 1),

('Abordagem diferente por pessoa',
 'Uso jeitos diferentes de me comunicar com pessoas diferentes — o que funciona com um amigo não é o mesmo que funciona com outro, e consigo explicar por quê.',
 'Com a Ana, que é direta, você vai reto ao ponto. Com o Lucas, que é mais sensível, começa perguntando como ele está antes de falar o que precisa.',
 'amigos', 1, 1, 60, 1),

('Ajuste na hora certa',
 'Quando percebo que alguém do grupo está travado ou foi além do que eu esperava, mudo minha postura na hora — sem precisar esperar a próxima reunião ou conversa formal.',
 'No meio da apresentação em grupo, percebe que o João travou. Sem esperar, você assume a condução e devolve o espaço a ele quando ele se recompõe.',
 'amigos', 1, 1, 70, 1),

-- CG02 Comunicação (competency_id=2) · Mês 1
('Posicionamento com fatos',
 'Quando discordo de algo em grupo (na escola, com amigos), expresso minha posição com argumentos concretos — não apenas com emoção ou porque "eu acho".',
 'Em vez de dizer "não gosto dessa ideia", você diz: "Esse prazo não vai funcionar porque temos prova na mesma semana — precisa de 2 dias a mais."',
 'escola', 1, 2, 50, 1),

('Pedidos claros e completos',
 'Quando peço algo a alguém (pais, irmãos, amigos), deixo claro o quê, como e quando preciso — para não gerar mal-entendido nem precisar repetir.',
 'Para o seu irmão: "Preciso que você ligue para o professor hoje até as 18h para confirmar o horário da reunião de amanhã às 14h."',
 'familia', 1, 2, 60, 1),

('Feedback sem atacar a pessoa',
 'Quando preciso falar sobre algo que alguém fez de errado, falo sobre a situação e o impacto — sem atacar a pessoa nem usar "você sempre" ou "você nunca".',
 '"Quando você não avisa que vai atrasar, o grupo fica esperando e perdemos meia hora." Situação + impacto, sem julgamento pessoal.',
 'amigos', 1, 2, 70, 1),

-- CG03 Pessoas (competency_id=3) · Mês 2
('Acompanho o crescimento dos outros',
 'Sei o que cada amigo próximo ou irmão quer melhorar e tenho conversas regulares para ajudar — não apenas quando eles me pedem.',
 'Você sabe que a Carla quer melhorar em inglês. Sem ela pedir, você manda um artigo interessante e pergunta como está indo o estudo dela.',
 'amigos', 1, 3, 50, 2),

('Distribuo tarefas pensando em quem vai crescer',
 'Ao dividir tarefas num grupo, penso em quem vai aprender e se desenvolver com aquilo — não apenas em quem é mais rápido ou conveniente.',
 'No trabalho em grupo, você dá a parte de pesquisa para o João (que quer melhorar nisso), mesmo sabendo que a Ana faria mais rápido.',
 'escola', 1, 3, 60, 2),

('Reconhecimento genuíno e frequente',
 'Reconheço e elogio conquistas específicas de amigos e familiares no dia a dia — não apenas em momentos grandes ou quando alguém pergunta o que achei.',
 '"Carla, você foi muito clara na explicação de hoje — percebi que você estudou de verdade." Específico, imediato, genuíno.',
 'amigos', 1, 3, 70, 2),

-- CG04 Decisão (competency_id=4) · Mês 2
('Explico meu raciocínio antes da escolha',
 'Quando tomo uma decisão importante (sobre estudos, amizades, projetos), explico os critérios que usei para escolher — antes de revelar qual foi a decisão.',
 'Ao escolher entre dois cursos, você explica: "Avaliei custo, deslocamento e oportunidades de emprego." Só depois revela qual escolheu.',
 'pessoal', 1, 4, 50, 2),

('Urgente vs. importante',
 'Separo o que é urgente (tem que resolver agora) do que é importante (muda minha vida) — e não tomo decisões de longo prazo no meio de situações de pressão imediata.',
 'A briga com o amigo parece urgente, mas a decisão de mudar de escola é importante. Você espera a situação esfriar para decidir sobre a escola.',
 'pessoal', 1, 4, 60, 2),

('Revisão pós-decisão',
 'Depois de tomar uma decisão relevante, volto a ela algumas semanas depois para ver se foi a certa — aprendo com o que acertei e com o que errei.',
 'Um mês depois de escolher o curso extracurricular, você anota: o que esperava, o que aconteceu e o que faria diferente.',
 'pessoal', 1, 4, 70, 2),

-- CG05 Finanças (competency_id=5) · Mês 3
('Penso em custo e valor antes de gastar',
 'Quando quero comprar algo ou investir tempo num projeto, analiso o custo real, o benefício que vou ter e se vale a pena — antes de decidir.',
 'Antes de comprar o tênis novo, você anota: custo = R$200, benefício = conforto, alternativa = tênis atual ainda serve. Decide aguardar.',
 'pessoal', 1, 5, 50, 3),

('Acompanho meu dinheiro proativamente',
 'Acompanho minha mesada ou dinheiro disponível e ajo preventivamente antes de ficar sem — não espero acabar tudo para ver onde errei.',
 'No meio do mês, percebe que gastou 70% da mesada. Decide não sair no fim de semana para garantir dinheiro para os compromissos restantes.',
 'pessoal', 1, 5, 60, 3),

('Priorizo conscientemente',
 'Quando tenho recursos limitados (dinheiro, tempo, energia), consigo dizer claramente o que estou priorizando, o que estou deixando para depois e por quê.',
 'Esta semana: priorizando a prova de física, deixando o treino de basquete para depois, adiando a festa. Tudo consciente, nada por acidente.',
 'pessoal', 1, 5, 70, 3),

-- CG06 Processos (competency_id=6) · Mês 3
('Organizo e atualizo minhas rotinas',
 'Organizo minhas rotinas de estudo, tarefas e compromissos — e as atualizo quando algo muda, não apenas quando algo dá errado.',
 'Toda segunda você revisa sua agenda da semana e ajusta os horários de estudo conforme provas e compromissos novos. Não espera a sexta.',
 'pessoal', 1, 6, 50, 3),

('Identifico problemas com dados, não só sensação',
 'Quando aponto um problema (na escola, em casa, no grupo), trago evidências concretas — não apenas "eu acho que" ou "parece que".',
 'Em vez de "parece que a gente nunca entrega no prazo", você mostra: "Nos últimos 3 trabalhos, atrasamos 2. O padrão é fazer tudo na véspera."',
 'escola', 1, 6, 60, 3),

('Envolvo o grupo nas melhorias',
 'Quando quero mudar algo num grupo ou projeto, proponho a mudança com quem vai ser afetado, testo antes de implementar e peço feedback depois.',
 'Quer mudar o horário dos treinos. Primeiro pergunta ao grupo, propõe um teste de 2 semanas, depois pede feedback antes de tornar definitivo.',
 'amigos', 1, 6, 70, 3),

-- ============================================================
-- Fase 2 · Meses 4-6 · CG07-CG12 · XP 70-90
-- ============================================================

-- CG07 Negociação (competency_id=7) · Mês 4
('Me preparo antes de negociar',
 'Antes de pedir algo difícil (aos pais, a um amigo, ao professor), penso no mínimo que aceito, nos interesses da outra pessoa e no que posso ceder.',
 'Antes de pedir para ficar até meia-noite na festa, você pensa: mínimo aceitável = 23h, interesse dos pais = segurança, o que posso ceder = ir com o grupo.',
 'familia', 2, 7, 70, 4),

('Entendo o que o outro realmente precisa',
 'Em conflitos ou pedidos, faço perguntas para entender o que a pessoa realmente precisa — não fico só na superfície do que ela está pedindo.',
 'A mãe diz "preciso que você fique em casa". Em vez de discutir, você pergunta: "O que te preocupa se eu sair?" e descobre que o problema é comunicação, não a saída.',
 'familia', 2, 7, 80, 4),

('Honro os combinados',
 'Quando faço um combinado com alguém, cumpro o que foi acertado — e se não puder, aviso antes e renegocio.',
 'Prometeu entregar a parte do trabalho na quinta. Na quarta, percebe que não vai conseguir. Avisa imediatamente e oferece uma alternativa.',
 'amigos', 2, 7, 90, 4),

-- CG08 Mudanças (competency_id=8) · Mês 4
('Penso em quem será afetado antes de propor mudança',
 'Antes de propor uma mudança no grupo, turma ou família, penso em quem vai ser impactado, quem pode resistir e quem pode me ajudar a convencer os demais.',
 'Quer mudar o formato do trabalho em grupo. Antes de propor, fala separadamente com a Ana (líder informal) e o Pedro (mais resistente) para entender objeções.',
 'amigos', 2, 8, 70, 4),

('Explico o porquê antes do como',
 'Quando proponho uma mudança, explico primeiro por que ela é necessária e o que muda para cada um — antes de entrar nos detalhes de como vai funcionar.',
 '"Quero mudar o dia de reunião porque metade não consegue ir na quarta. Acho que quinta funciona melhor — o que vocês acham?"',
 'familia', 2, 8, 80, 4),

('Celebro as primeiras vitórias',
 'Quando estou liderando uma mudança, reconheço e comemoro as primeiras conquistas do grupo — para manter o ânimo e mostrar que está funcionando.',
 'O grupo adotou o novo sistema de tarefas. Na primeira semana que funcionou, você envia uma mensagem reconhecendo o esforço de todos.',
 'amigos', 2, 8, 90, 4),

-- CG09 Inovação (competency_id=9) · Mês 5
('Questiono o problema antes de sair resolvendo',
 'Diante de um problema, primeiro me pergunto se entendi bem o que está acontecendo — reformulo o desafio quando necessário antes de sair em busca de soluções.',
 '"Estou tirando notas baixas." Em vez de estudar mais horas, você pergunta: estou entendendo ou só memorizando? O problema pode ser método, não tempo.',
 'pessoal', 2, 9, 70, 5),

('Aberto a ideias diferentes das minhas',
 'Fico aberto a ideias incomuns dos meus amigos e colegas — separo o momento de ouvir do momento de criticar, sem matar ideias na largada.',
 'No brainstorm, o Rafael sugere algo absurdo. Em vez de criticar, você diz: "O que há de aproveitável nisso?" e continua ouvindo antes de avaliar.',
 'amigos', 2, 9, 80, 5),

('Testo antes de investir tudo',
 'Antes de me comprometer completamente com uma ideia, faço um teste pequeno para ver se funciona — em vez de apostar tudo sem validar.',
 'Antes de criar um perfil profissional completo, você publica artigos curtos por 2 semanas para ver se engaja. Só então investe mais tempo.',
 'pessoal', 2, 9, 90, 5),

-- CG10 Resultado (competency_id=10) · Mês 5
('Tenho metas claras e reviso regularmente',
 'Tenho objetivos definidos para a minha vida (estudos, projetos, desenvolvimento pessoal), compartilhei com alguém próximo e os revejo a cada alguns meses.',
 'Seus 3 objetivos do semestre estão escritos e compartilhados com seu mentor. Cada mês você revisa: o que avançou, o que travou, o que precisa ajustar.',
 'pessoal', 2, 10, 70, 5),

('Uso meus objetivos para filtrar escolhas',
 'Quando surgem oportunidades ou pedidos concorrentes, uso meus objetivos de vida como critério explícito para decidir o que aceito e o que recuso.',
 'Te convidam para um projeto interessante, mas não está alinhado com seus objetivos do semestre. Você recusa educadamente explicando o motivo — sem culpa.',
 'pessoal', 2, 10, 80, 5),

('Fico de olho no que acontece no mundo',
 'Acompanho regularmente o que está acontecendo no mundo (notícias, tendências, mudanças) e conecto isso às minhas decisões pessoais e profissionais.',
 'Lê que IA está transformando o mercado. Conecta à sua escolha de carreira: "Preciso desenvolver habilidades que IA não substitui facilmente."',
 'pessoal', 2, 10, 90, 5),

-- CG11 Cultura (competency_id=11) · Mês 6
('Vivo o que prego',
 'Ajo de acordo com os valores que declaro — especialmente nas situações difíceis, quando seria mais fácil agir diferente do que digo acreditar.',
 'Você defende honestidade, mas na prova alguém oferece a resposta. Você recusa, mesmo sem ser pego. Seus valores valem mais quando ninguém está olhando.',
 'amigos', 2, 11, 70, 6),

('Integro pessoas novas ao grupo',
 'Quando alguém novo chega ao meu grupo ou turma, me esforço para apresentar como as coisas funcionam por lá — o que é bem-vindo e o que não é.',
 'O aluno novo senta sozinho no refeitório. Você se levanta, apresenta o grupo e explica as regras não escritas: "Aqui a gente se chama pelo apelido."',
 'amigos', 2, 11, 80, 6),

('Ouço como o grupo está e tomo atitude',
 'Pergunto regularmente como as pessoas próximas estão se sentindo no grupo e tomo pelo menos uma ação visível com base no que ouço.',
 'Percebe que o grupo está desmotivado. Pergunta individualmente. Com base nas respostas, propõe uma mudança concreta na próxima semana.',
 'amigos', 2, 11, 90, 6),

-- CG12 Sucessão (competency_id=12) · Mês 6
('Preparo quem pode me substituir',
 'Sei quem no meu grupo poderia assumir meu papel (na equipe, no projeto, na liderança) e ajudo essa pessoa a se desenvolver ativamente.',
 'Como líder do projeto, você identifica a Bianca como substituta natural e começa a dar a ela mais responsabilidades, explicando seu processo.',
 'amigos', 2, 12, 70, 6),

('Dou espaço para os outros decidirem',
 'Deixo de propósito que amigos ou irmãos tomem decisões que já conseguem tomar sozinhos — em vez de centralizar tudo em mim.',
 'Seu irmão pergunta o que estudar primeiro. Em vez de dar a resposta, você pergunta: "O que você acha mais importante? Por quê?" e deixa ele decidir.',
 'casa', 2, 12, 80, 6),

('Documento meu jeito de fazer as coisas',
 'Registro como faço as coisas que me saio bem — rotinas, métodos, aprendizados — de forma que outra pessoa pudesse usar se eu não estivesse disponível.',
 'Você é bom em organizar eventos. Escreve um guia passo a passo: checklist, prazos, contatos. Quando alguém precisar fazer no seu lugar, já tem o manual.',
 'pessoal', 2, 12, 90, 6),

-- ============================================================
-- Fase 3 · Meses 7-9 · CC01-CC06 · XP 90-110
-- ============================================================

-- CC01 Iniciativa (competency_id=13) · Mês 7
('Ajo antes de ser pedido',
 'Quando vejo que algo vai dar errado ou que uma oportunidade está surgindo, ajo antes de alguém me pedir — sem precisar que me empurrem.',
 'O prazo do trabalho se aproxima e o grupo não começou. Sem esperar o líder agir, você começa sua parte e avisa o grupo.',
 'pessoal', 3, 13, 90, 7),

('Busco melhorar meu ambiente',
 'Procuro ativamente formas de melhorar o ambiente ao meu redor — em casa, na escola, no grupo — sem esperar que alguém me mande fazer isso.',
 'A sala de estudos está bagunçada e todo mundo reclama mas ninguém faz nada. Você organiza no intervalo e sugere um sistema de manutenção.',
 'casa', 3, 13, 100, 7),

('Aproveito oportunidades incomuns',
 'Quando surge uma oportunidade fora do comum (um projeto diferente, uma conexão inesperada), reconheço e ajo rapidamente — mesmo sem ter certeza do resultado.',
 'Um executivo visita a escola. Em vez de sair rápido, você o aborda com uma pergunta relevante e troca contatos. Pode ser uma mentoria futura.',
 'pessoal', 3, 13, 110, 7),

-- CC02 Persistência (competency_id=14) · Mês 7
('Não desisto diante de obstáculos',
 'Quando enfrento dificuldades — uma matéria difícil, um conflito, uma rejeição — não desisto na primeira pedra. Busco alternativas até achar um caminho.',
 'Reprovado no primeiro processo seletivo. Em vez de desistir, você pede feedback, melhora o currículo e se inscreve em 3 outros na semana seguinte.',
 'pessoal', 3, 14, 90, 7),

('Reavalia e tenta de outro jeito',
 'Quando um plano não funciona, paro, reavaliou o que aconteceu e tento de um jeito diferente — sem abandonar o objetivo.',
 'Estudou 2 horas por dia e não melhorou. Para, analisa o método, percebe que precisa de exercícios práticos — não só leitura. Muda a abordagem.',
 'pessoal', 3, 14, 100, 7),

('Dou mais do que o suficiente',
 'Quando algo é importante para mim, faço mais do que o mínimo necessário — dedico tempo e energia extras além do que a maioria faria.',
 'O trabalho pedido era 5 páginas. Você entrega 7 com gráficos e fontes extras porque o tema importa para você. Por escolha, não por obrigação.',
 'pessoal', 3, 14, 110, 7),

-- CC03 Coragem (competency_id=15) · Mês 8
('Avalio alternativas antes de decidir o difícil',
 'Antes de tomar decisões difíceis (mudar de escola, terminar uma amizade, enfrentar alguém), levanto e avalio diferentes opções — incluindo as desconfortáveis.',
 'Antes de encerrar a amizade com o Lucas, você lista alternativas: conversa direta, tempo afastado, redefinir limites. Só depois escolhe o caminho.',
 'pessoal', 3, 15, 90, 8),

('Busco reduzir o risco de errar',
 'Antes de me comprometer com algo, procuro reduzir as chances de erro — não para evitar a decisão, mas para decidir com mais clareza e segurança.',
 'Antes de se candidatar para liderar o projeto, você conversa com quem já fez isso antes e se prepara para os obstáculos mais comuns.',
 'pessoal', 3, 15, 100, 8),

('Aceito desafios que me tiram da zona de conforto',
 'Aceito desafios que me assustam um pouco — não fujo do que é difícil, mas também não me jogo em riscos desnecessários só para parecer corajoso.',
 'Te convidam para falar para 200 alunos. Você sente o frio na barriga, mas aceita — prepara bem, ensaia com antecedência e entrega.',
 'pessoal', 3, 15, 110, 8),

-- CC04 Qualidade (competency_id=16) · Mês 8
('Melhoro mesmo o que já está bom',
 'Melhoro continuamente meu trabalho, meus hábitos e minhas habilidades — mesmo quando o resultado já seria aceito por todos.',
 'O trabalho ficou bom. Mas antes de entregar, você relê e melhora 3 parágrafos. A diferença entre 7 e 9 está nos detalhes que a maioria ignora.',
 'escola', 3, 16, 90, 8),

('Vou além do que foi pedido',
 'Quando faço algo para alguém (um favor, um trabalho em grupo, uma ajuda em casa), busco superar o que foi combinado — faço melhor do que o mínimo esperado.',
 'Pediram para você organizar a lista de chamada. Você entrega a lista + um sistema de controle de presença que facilita as próximas reuniões.',
 'amigos', 3, 16, 100, 8),

('Tenho sistemas para garantir a qualidade',
 'Crio listas, rotinas ou checagens para garantir que entrego com qualidade — não dependo só de memória ou boa vontade do momento.',
 'Antes de entregar qualquer trabalho, você passa por um checklist: ortografia, fontes, coerência com o que foi pedido, formatação.',
 'pessoal', 3, 16, 110, 8),

-- CC05 Comprometimento (competency_id=17) · Mês 9
('Assumo meus resultados sem jogar culpa',
 'Quando algo dá errado na minha vida, assumo minha parte da responsabilidade — não fico culpando os outros, o sistema ou a sorte.',
 'Tirou nota baixa na prova. Em vez de dizer "a prova foi difícil demais", você diz: "Não estudei o conteúdo certo. Na próxima vou revisar com o professor antes."',
 'pessoal', 3, 17, 90, 9),

('Trabalho junto quando o coletivo é melhor',
 'Prefiro trabalhar em grupo quando o resultado coletivo seria melhor do que o individual — não insisto em fazer sozinho só para controlar tudo.',
 'Você poderia fazer o projeto sozinho em 3 dias. Mas em grupo com mais 3 pessoas ficaria melhor. Você escolhe o grupo mesmo perdendo o controle total.',
 'amigos', 3, 17, 100, 9),

('Priorizo o relacionamento ao invés de ganhos imediatos',
 'Coloco o relacionamento de longo prazo acima de uma vantagem de curto prazo — não abro mão da confiança de alguém por um ganho imediato.',
 'Você poderia ganhar o debate humilhando o oponente. Mas ele é seu amigo. Você vence com argumentos, sem destruir a relação.',
 'amigos', 3, 17, 110, 9),

-- CC06 Pesquisa (competency_id=18) · Mês 9
('Investigo meu mundo pessoalmente',
 'Busco entender meu ambiente de forma ativa — converso com pessoas diferentes, leio, assisto, ouço. Não fico esperando a informação chegar até mim.',
 'Antes de escolher uma carreira, você conversa com 5 profissionais da área, lê 2 livros e assiste entrevistas. Decisão baseada em pesquisa real.',
 'pessoal', 3, 18, 90, 9),

('Procuro sempre formas novas de fazer',
 'Investigo ativamente como melhorar o que faço — busco referências, experimento jeitos novos, aprendo com quem é diferente de mim.',
 'Seu método de estudo parou de funcionar. Em vez de insistir, você pesquisa técnicas como Pomodoro e flashcards e testa por 2 semanas.',
 'pessoal', 3, 18, 100, 9),

('Busco orientação de quem sabe mais',
 'Quando preciso tomar decisões importantes, procuro a orientação de alguém com mais experiência — não acho que já sei tudo sobre o assunto.',
 'Antes de abrir seu primeiro empreendimento, você procura um mentor com experiência. Vai com perguntas específicas e anota tudo.',
 'pessoal', 3, 18, 110, 9),

-- ============================================================
-- Fase 4 · Meses 10-12 · CC07-CC12 · XP 100-150
-- ============================================================

-- CC07 Metas (competency_id=19) · Mês 10
('Persigo objetivos desafiantes',
 'Tenho objetivos pessoais que me exigem esforço real — não me contento com o mínimo para passar ou cumprir o combinado.',
 'Em vez de mirar a nota mínima para passar, você define 8,5 como objetivo e cria um plano para chegar lá.',
 'pessoal', 4, 19, 100, 10),

('Tenho visão clara do que quero construir',
 'Tenho uma imagem clara de onde quero estar em 3 a 5 anos — para minha vida, meus estudos, minhas relações e minha contribuição para a família e o mundo.',
 'Você escreve sua visão de vida em 5 anos: onde quer estar profissionalmente, que tipo de líder quer ser, como quer contribuir para a empresa da família.',
 'pessoal', 4, 19, 120, 10),

('Sei como vou medir se cheguei lá',
 'Quando me proponho algo, sei exatamente como vou medir se consegui ou não — não fico com objetivos vagos como "quero melhorar".',
 '"Quero melhorar em inglês" vira: "Vou ser aprovado no B2 First até dezembro, estudando 1 hora por dia." Objetivo com número, prazo e método.',
 'pessoal', 4, 19, 150, 10),

-- CC08 Planejamento (competency_id=20) · Mês 10
('Enfrento grandes desafios por etapas',
 'Diante de desafios grandes (uma prova difícil, um projeto longo, uma meta ambiciosa), divido em etapas menores em vez de tentar resolver tudo de uma vez.',
 'Tem uma apresentação em 3 semanas. Semana 1: pesquisa. Semana 2: estrutura. Semana 3: ensaios. Divide e o problema some.',
 'pessoal', 4, 20, 100, 10),

('Adapto meus planos quando o cenário muda',
 'Quando as circunstâncias mudam (cancelamento de planos, resultado inesperado, mudança de situação), adapto meus planos rapidamente sem entrar em colapso.',
 'A data da prova mudou e bagunçou sua semana. Em vez de entrar em pânico, você redistribui o cronograma em 20 minutos e segue em frente.',
 'pessoal', 4, 20, 120, 10),

('Considero recursos disponíveis nos meus planos',
 'Ao planejar algo, levo em conta o que tenho disponível (tempo, dinheiro, energia) — não faço planos que dependem de recursos que não tenho.',
 'Quer estudar fora. Antes de se empolgar, calcula: quanto custa, quanto você tem, quanto tempo leva para juntar. O plano só avança se os números fecham.',
 'pessoal', 4, 20, 150, 10),

-- CC09 Networking (competency_id=21) · Mês 11
('Construo alianças para meus projetos',
 'Quando tenho um projeto ou objetivo, penso em quem pode me apoiar e crio estratégias para conquistar esse apoio — não espero que as pessoas apareçam sozinhas.',
 'Para seu projeto, você mapeia: professor especialista, colega designer, amigo empresário. Aborda cada um com propósito específico.',
 'amigos', 4, 21, 100, 11),

('Sei quem são as pessoas-chave e me relaciono com elas',
 'Identifico quem são as pessoas influentes nos ambientes que frequento e cultivo relacionamentos genuínos com elas — não por interesse imediato, mas por respeito mútuo.',
 'Você identifica os alunos que influenciam a turma, o professor mais conectado com oportunidades e o coordenador que abre portas. Constrói relações genuínas.',
 'amigos', 4, 21, 120, 11),

('Invisto em relacionamentos antes de precisar deles',
 'Mantenho relacionamentos com pessoas de diferentes áreas e grupos — invisto nessas conexões antes de precisar delas, não apenas quando quero algo.',
 'Você mantém contato com ex-professores e antigos líderes de projetos. Quando surge uma oportunidade, sua rede já existe.',
 'amigos', 4, 21, 150, 11),

-- CC10 Autoconfiança (competency_id=22) · Mês 11
('Confio no meu próprio julgamento',
 'Confio nas minhas opiniões mesmo quando diferem da maioria — defendo minha posição com argumentos, não cedo só porque todo mundo pensa diferente.',
 'Todo o grupo quer a solução rápida, mas você vê um risco que eles ignoram. Apresenta os dados e defende sua posição com calma.',
 'pessoal', 4, 22, 100, 11),

('Mantenho o otimismo diante de críticas',
 'Quando recebo críticas ou enfrento oposição, mantenho-me determinado e otimista — sem ficar paralisado ou amargo pela rejeição.',
 'Seu projeto foi rejeitado. Em vez de desanimar, você pede feedback específico, melhora o que foi apontado e reapresenta na semana seguinte.',
 'pessoal', 4, 22, 120, 11),

('Transmito segurança para as pessoas ao meu redor',
 'Minha postura transmite confiança para as pessoas ao meu redor — quando estou presente, os outros se sentem mais seguros, não mais ansiosos.',
 'Na véspera da apresentação, o grupo está em pânico. Você mantém a calma, diz "estamos prontos, revisamos tudo" — o clima muda.',
 'amigos', 4, 22, 150, 11),

-- CC11 Autorresponsabilidade (competency_id=23) · Mês 12
('Vejo o problema e ajo sem precisar de ordem',
 'Quando identifico um problema ou oportunidade na minha vida ou no meu grupo, tomo a iniciativa de agir — sem esperar que alguém me diga o que fazer.',
 'A turma está sem monitor para cálculo. Você identifica o problema, fala com o professor e se oferece para organizar um grupo de estudos.',
 'amigos', 4, 23, 100, 12),

('Envolvo o grupo e assumo os resultados',
 'Quando lidero algo, envolvo todos na construção da solução e assumo os resultados — sejam bons ou ruins — sem culpar quem me ajudou.',
 'O projeto que você liderou ficou abaixo do esperado. Em vez de culpar o grupo, você diz: "O resultado foi minha responsabilidade — deveria ter ajustado antes."',
 'amigos', 4, 23, 120, 12),

('Mantenho o grupo focado mesmo sob pressão',
 'Quando o grupo entra em pânico, se dispersa ou perde o foco, ajudo a manter a direção — sem me desesperar junto com os outros.',
 'Faltam 2 horas para a apresentação e o grupo entrou em colapso. Você lista o que ainda dá para fazer, divide tarefas e retoma o ritmo.',
 'amigos', 4, 23, 150, 12),

-- CC12 Visão (competency_id=24) · Mês 12
('Enxergo como um problema num lugar afeta outro',
 'Quando algo vai mal numa área da minha vida (escola, família, amizades), percebo como isso está conectado a outras áreas — e ajo de forma integrada.',
 'Suas notas caíram. Investiga e descobre que conflito com amigos está consumindo sua energia mental. Resolve o relacionamento, as notas sobem.',
 'pessoal', 4, 24, 100, 12),

('Conecto o trabalho do grupo ao propósito maior',
 'Explico para o meu grupo por que o que estamos fazendo importa — o "para quê" além do "o quê", conectando as tarefas a um propósito maior.',
 '"Por que estamos fazendo essa pesquisa?" — "Porque um dia podemos liderar a empresa da família. Essa pesquisa é nosso primeiro passo."',
 'amigos', 4, 24, 120, 12),

('Uso informações externas para antecipar decisões',
 'Uso o que aprendo em diferentes contextos (leituras, conversas, experiências) para antecipar decisões na minha própria vida — não fico esperando o problema chegar.',
 'Lê que o mercado valoriza soft skills mais que diplomas. Antecipa: começa a desenvolver liderança e comunicação agora, não espera o mercado exigir.',
 'pessoal', 4, 24, 150, 12);
