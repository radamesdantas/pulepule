-- ============================================
-- SEED: Missões por competência (5 por competência = 120 missões)
-- Distribuídas em 12 meses, 4 fases, 4 contextos
-- Contextos: family, school, community, company
-- ============================================

-- Contexto helper para distribuição
-- Cada competência recebe 5 missões em 5 meses consecutivos

-- FASE 1 — Meses 1–3
-- Competência 1: Autoconhecimento (id=1)
insert into public.missions (title, description, context, phase, competency_id, xp_reward, month) values
('Mapa dos meus talentos', 'Escreva uma lista com 5 pontos fortes seus e peça para 3 pessoas próximas confirmarem ou acrescentarem.', 'family', 1, 1, 50, 1),
('Diário de decisões', 'Durante 7 dias, anote cada decisão que tomar e por que a tomou. Reflita ao final da semana.', 'school', 1, 1, 60, 1),
('Entrevista com o espelho', 'Grave um vídeo de 2 minutos respondendo: quem sou, o que quero e o que me travar.', 'family', 1, 1, 70, 2),
('Feedback 360', 'Peça feedback honesto para 1 familiar, 1 amigo e 1 professor sobre como você se porta sob pressão.', 'school', 1, 1, 60, 2),
('Missão de propósito', 'Escreva uma frase de propósito pessoal e explique para alguém da família por que ela faz sentido.', 'community', 1, 1, 80, 3),

-- Competência 2: Gestão do Tempo (id=2)
('Semana planejada', 'Monte um planejamento semanal com horários fixos para estudos, lazer e família. Siga por 7 dias.', 'family', 1, 2, 50, 1),
('Eliminando ladroẽs de tempo', 'Identifique as 3 atividades que mais desperdiçam seu tempo e substitua por algo produtivo por 5 dias.', 'school', 1, 2, 60, 1),
('Projeto 1 hora', 'Escolha um objetivo de 30 dias e dedique 1 hora por dia a ele. Documente o progresso.', 'family', 1, 2, 70, 2),
('Agenda dos pais', 'Entreviste um dos seus pais sobre como eles gerenciam o tempo deles. Apresente 3 aprendizados.', 'family', 1, 2, 60, 2),
('Dia sem tela', 'Passe 1 dia inteiro sem celular ou redes sociais. Anote o que fez diferente e o que aprendeu.', 'community', 1, 2, 80, 3),

-- Competência 3: Comunicação Assertiva (id=3)
('Pedido difícil', 'Peça algo que você evitou pedir por medo de ouvir não. Relate o que aconteceu.', 'family', 1, 3, 50, 2),
('Apresentação em voz alta', 'Prepare e apresente um assunto que você domina para pelo menos 5 pessoas.', 'school', 1, 3, 60, 2),
('Conflito resolvido', 'Identifique uma situação de conflito e resolva com conversa direta, sem raiva. Documente.', 'family', 1, 3, 70, 3),
('Discurso de 1 minuto', 'Grave um vídeo de 1 minuto defendendo uma ideia com argumentos claros e concisos.', 'school', 1, 3, 60, 3),
('Carta de reconhecimento', 'Escreva uma carta agradecendo alguém que teve impacto na sua vida. Entregue pessoalmente.', 'community', 1, 3, 80, 3),

-- Competência 4: Tomada de Decisão (id=4)
('Matriz de decisão', 'Use uma matriz de prós e contras para tomar uma decisão real que esteja adiando.', 'family', 1, 4, 60, 3),
('Decisão de grupo', 'Lidere uma decisão coletiva em casa ou na escola (o que comer, onde ir, como resolver algo).', 'family', 1, 4, 70, 4),
('Risco calculado', 'Tome uma decisão arriscada (mas segura) que você normalmente evitaria. Relate o resultado.', 'school', 1, 4, 80, 4),
('Conselho dos 3', 'Antes de uma decisão importante, consulte 3 pessoas com perspectivas diferentes. Documente.', 'community', 1, 4, 70, 4),
('Decisão com deadline', 'Imponha um prazo de 24h para uma decisão que está pendente. Tome e execute.', 'family', 1, 4, 90, 5),

-- Competência 5: Liderança Situacional (id=5)
('Líder de projeto escolar', 'Assuma a liderança de um trabalho em grupo na escola. Delegue tarefas e entregue resultado.', 'school', 1, 5, 60, 4),
('Líder em casa', 'Organize uma atividade familiar (jantar, passeio, limpeza) liderando sem impor.', 'family', 1, 5, 70, 4),
('Adaptando o estilo', 'Lidere a mesma tarefa com 2 pessoas de perfis diferentes. Relate como adaptou sua abordagem.', 'school', 1, 5, 80, 5),
('Motivando alguém', 'Ajude alguém que está desmotivado (colega, irmão) a retomar uma atividade. Documente como.', 'community', 1, 5, 70, 5),
('Avaliação de liderança', 'Peça feedback de 3 pessoas sobre como você liderou um projeto recente. Escreva 3 aprendizados.', 'school', 1, 5, 90, 5),

-- Competência 6: Gestão de Conflitos (id=6)
('Escuta ativa', 'Em um desentendimento, ouça completamente sem interromper antes de responder. Relate.', 'family', 2, 6, 60, 5),
('Mediação em ação', 'Medeie um conflito entre 2 pessoas próximas. Documente como conduziu e o resultado.', 'school', 2, 6, 70, 5),
('Carta sem raiva', 'Escreva uma carta para alguém com quem você tem tensão, focando em soluções, não culpas.', 'family', 2, 6, 80, 6),
('Conflito profissional', 'Observe ou vivencie um conflito em uma empresa (estágio, negócio familiar). Documente.', 'company', 2, 6, 70, 6),
('Protocolo de paz', 'Crie um protocolo pessoal de 5 passos para resolver conflitos. Aplique em uma situação real.', 'community', 2, 6, 90, 6),

-- FASE 1 COMPORTAMENTAL — Meses 1–3
-- Competência 7: Responsabilidade (id=7)
('Compromisso cumprido', 'Faça uma promessa (pequena mas real) e cumpra-a sem ser lembrado. Documente.', 'family', 1, 7, 50, 1),
('Erro assumido', 'Quando errar algo esta semana, assuma o erro diretamente sem culpar outros. Relate.', 'school', 1, 7, 60, 1),
('Responsabilidade com prazo', 'Entregue 3 tarefas escolares antes do prazo. Prove com foto ou print.', 'school', 1, 7, 70, 2),
('Conta prestada', 'No final de uma semana, preste contas a um familiar sobre o que planejou vs o que fez.', 'family', 1, 7, 60, 2),
('Projeto pessoal entregue', 'Defina um projeto pessoal de 2 semanas, execute-o e apresente o resultado.', 'community', 1, 7, 80, 3),

-- Competência 8: Empatia (id=8)
('Dia do outro', 'Passe 1 hora ajudando alguém com uma tarefa sem reclamar. Anote o que aprendeu sobre a pessoa.', 'family', 1, 8, 50, 1),
('Perspectiva diferente', 'Escreva um texto defendendo uma ideia que você não concorda, do ponto de vista de quem concorda.', 'school', 1, 8, 60, 1),
('Voluntariado', 'Dedique 2 horas a uma ação voluntária (escola, comunidade, família). Documente.', 'community', 1, 8, 70, 2),
('Escuta sem conselho', 'Ouça alguém por 15 minutos apenas para entender, sem dar conselhos. Relate o que aprendeu.', 'family', 1, 8, 60, 2),
('Carta de empatia', 'Escreva uma carta para alguém que passou por uma dificuldade. Entregue-a.', 'community', 1, 8, 80, 3),

-- Competência 9: Resiliência (id=9)
('Falha documentada', 'Registre uma falha recente: o que aconteceu, o que aprendeu, o que vai fazer diferente.', 'school', 1, 9, 50, 2),
('Desafio 7 dias', 'Escolha um desafio difícil e mantenha-o por 7 dias consecutivos. Documente cada dia.', 'family', 1, 9, 70, 2),
('Rota alternativa', 'Quando um plano falhar esta semana, documente como criou uma alternativa e seguiu em frente.', 'school', 1, 9, 60, 3),
('Conversa com quem superar', 'Entreviste alguém que superou uma dificuldade grande. Anote 3 lições.', 'community', 1, 9, 70, 3),
('Manifesto de resiliência', 'Escreva seus 5 princípios pessoais para não desistir quando as coisas ficam difíceis.', 'family', 1, 9, 80, 3),

-- Competência 10: Trabalho em Equipe (id=10)
('Projeto em grupo', 'Contribua de forma destacada em um projeto em grupo na escola. Relate sua contribuição.', 'school', 2, 10, 60, 3),
('Papel de apoio', 'Em um projeto que não é seu, apoie a liderança ativamente. Documente o que fez.', 'school', 2, 10, 60, 4),
('Equipe em casa', 'Organize uma tarefa doméstica complexa com a participação de toda a família.', 'family', 2, 10, 70, 4),
('Conflito de equipe resolvido', 'Quando surgir tensão em um grupo, atue para resolver. Documente o resultado.', 'school', 2, 10, 80, 4),
('Celebração do time', 'Organize uma celebração (pequena) pelo resultado de um projeto em grupo.', 'community', 2, 10, 70, 5),

-- Competência 11: Criatividade (id=11)
('Solução criativa', 'Resolva um problema do dia a dia de uma forma que nunca tentou antes. Documente.', 'family', 2, 11, 60, 4),
('Brainstorm de 10 ideias', 'Para um problema real (escola, família, comunidade) gere 10 ideias em 10 minutos. Apresente.', 'school', 2, 11, 70, 4),
('Projeto original', 'Crie algo original (texto, arte, produto, campanha) relacionado à sua comunidade.', 'community', 2, 11, 80, 5),
('Hackathon pessoal', 'Em 3 horas, crie uma solução para um problema identificado em sua escola ou bairro.', 'school', 2, 11, 90, 5),
('Pitch da ideia', 'Apresente sua solução criativa para pelo menos 5 pessoas. Colete feedback.', 'community', 2, 11, 80, 6),

-- Competência 12: Ética e Integridade (id=12)
('Dilema ético', 'Escreva sobre um dilema ético que enfrentou e como o resolveu. Que princípio guiou você?', 'school', 2, 12, 60, 5),
('Denúncia construtiva', 'Quando observar algo errado (injusto, desonesto), reporte de forma construtiva. Documente.', 'school', 2, 12, 70, 5),
('Escolha difícil', 'Diante de uma escolha entre o fácil e o certo, escolha o certo. Documente.', 'family', 2, 12, 80, 6),
('Código de ética pessoal', 'Escreva seus 5 princípios éticos e como os aplica no dia a dia.', 'family', 2, 12, 70, 6),
('Ética em negócios', 'Observe uma empresa ou negócio e identifique como ela pratica (ou não) ética. Apresente.', 'company', 2, 12, 90, 6),

-- FASE 2 — Meses 4–6
-- Competência 13: Planejamento Estratégico (id=13)
('Plano de 90 dias', 'Crie um plano pessoal de 90 dias com metas, ações e indicadores de sucesso.', 'family', 2, 13, 70, 4),
('Análise SWOT pessoal', 'Faça uma análise SWOT de você mesmo e de um projeto que quer realizar.', 'school', 2, 13, 80, 4),
('Estratégia do semestre', 'Defina 3 objetivos prioritários para o semestre escolar e o plano para atingi-los.', 'school', 2, 13, 70, 5),
('Plano de negócio básico', 'Crie um plano básico para um micro-negócio (pode ser simples). Apresente para alguém.', 'company', 2, 13, 90, 5),
('Revisão e pivô', 'Depois de 30 dias do seu plano, revise o que funcionou e pivote o que não funcionou.', 'family', 2, 13, 80, 6),

-- Competência 14: Delegação (id=14)
('Delegação real', 'Delegue uma tarefa que você normalmente faz sozinho para alguém. Acompanhe sem controlar.', 'family', 2, 14, 70, 5),
('Treinando alguém', 'Ensine uma habilidade sua para alguém mais novo. Documente como foi o processo.', 'school', 2, 14, 80, 5),
('Projeto delegado', 'Num projeto em grupo, delegue partes específicas para cada membro com clareza.', 'school', 2, 14, 70, 6),
('Delegação com confiança', 'Delegue algo importante e não interfira. Entregue o crédito ao responsável.', 'family', 2, 14, 90, 6),
('Avaliação da delegação', 'Peça feedback de quem você delegou. O que poderia ter feito melhor como líder?', 'community', 2, 14, 80, 7),

-- Competência 15: Feedback (id=15)
('Feedback estruturado', 'Dê feedback para um colega usando o modelo: situação, comportamento, impacto.', 'school', 2, 15, 70, 5),
('Pedindo feedback', 'Peça feedback específico de 3 pessoas sobre uma habilidade que quer melhorar.', 'school', 2, 15, 80, 5),
('Feedback difícil', 'Dê um feedback honesto (mas gentil) sobre algo que realmente precisa melhorar.', 'family', 2, 15, 90, 6),
('Implementando feedback', 'Após receber feedback, implemente 1 mudança concreta. Documente antes e depois.', 'family', 2, 15, 80, 6),
('Cultura de feedback', 'Proponha uma rotina de feedback semanal para um grupo (escola, família). Execute por 2 semanas.', 'community', 2, 15, 90, 7),

-- Competência 16: Gestão de Projetos (id=16)
('Projeto do zero', 'Planeje e execute um projeto do início ao fim com cronograma, tarefas e entrega.', 'school', 2, 16, 80, 6),
('Gerenciamento de crise', 'Quando um projeto atrasar ou ter problema, documente como gerenciou a situação.', 'school', 2, 16, 90, 6),
('Projeto comunitário', 'Lidere um projeto que beneficie sua comunidade (escola, bairro). Documente.', 'community', 2, 16, 100, 7),
('Retrospectiva', 'Após um projeto, conduza uma reunião de retrospectiva. O que foi bem? O que melhorar?', 'school', 2, 16, 80, 7),
('KPIs do projeto', 'Defina 3 métricas de sucesso para um projeto e acompanhe-as ao longo da execução.', 'company', 2, 16, 90, 8),

-- FASE 2 COMPORTAMENTAL — Continuação
-- Competência 17: Inteligência Emocional (id=17)
('Diário emocional', 'Durante 7 dias, registre suas emoções ao final do dia e o que as causou.', 'family', 3, 17, 80, 7),
('Gatilhos mapeados', 'Identifique seus 3 principais gatilhos emocionais e como reage a eles. Crie respostas alternativas.', 'family', 3, 17, 90, 7),
('Emoção em público', 'Gerencia uma emoção forte (frustração, ansiedade) em situação pública. Documente.', 'school', 3, 17, 100, 8),
('Empatia emocional', 'Apoie alguém em dificuldade emocional sem minimizar o que sente. Relate.', 'family', 3, 17, 90, 8),
('Regulação em 3 passos', 'Crie e aplique seu protocolo pessoal de 3 passos para regular emoções difíceis.', 'community', 3, 17, 110, 9),

-- Competência 18: Influência Positiva (id=18)
('Inspirando alguém', 'Inspire alguém a começar algo que estava adiando. Documente como fez isso.', 'community', 3, 18, 80, 8),
('Campanha de impacto', 'Crie uma campanha simples (escola, redes) com mensagem positiva. Meça o alcance.', 'school', 3, 18, 90, 8),
('Mentoria informal', 'Acompanhe alguém mais novo por 2 semanas ajudando-o a superar um desafio.', 'community', 3, 18, 100, 9),
('Discurso motivacional', 'Faça uma fala de 3 minutos para inspirar um grupo (turma, equipe, família).', 'school', 3, 18, 90, 9),
('Impacto documentado', 'Reúna evidências (depoimentos, fotos) de como você impactou positivamente outras pessoas.', 'community', 3, 18, 110, 10),

-- FASE 3 — Meses 7–9
-- Competência 19: Iniciativa (id=19)
('Problema resolvido sem pedir', 'Identifique e resolva um problema antes de alguém pedir. Documente.', 'family', 3, 19, 80, 7),
('Proposta não solicitada', 'Apresente uma melhoria para um processo na escola ou família sem ser pedido.', 'school', 3, 19, 90, 7),
('Projeto por iniciativa própria', 'Inicie e conclua um projeto que ninguém mandou você fazer.', 'community', 3, 19, 100, 8),
('Oportunidade criada', 'Crie uma oportunidade (de aprendizado, negócio, conexão) que não existia. Documente.', 'company', 3, 19, 110, 8),
('Iniciativa na empresa', 'Proponha e implemente uma melhoria em um negócio (familiar ou parceiro). Apresente resultados.', 'company', 3, 19, 120, 9),

-- Competência 20: Adaptabilidade (id=20)
('Plano B executado', 'Quando um plano falhar, execute o plano B rapidamente. Documente a adaptação.', 'school', 3, 20, 80, 7),
('Novo contexto', 'Coloque-se em um ambiente completamente diferente do habitual por 1 dia. Relate.', 'community', 3, 20, 90, 8),
('Mudança de papel', 'Assuma uma função diferente da sua em um projeto. Documente como se adaptou.', 'school', 3, 20, 100, 8),
('Aprendendo rápido', 'Aprenda uma habilidade nova em 7 dias e demonstre para alguém.', 'family', 3, 20, 110, 9),
('Adaptabilidade em crise', 'Documente como se adaptou a uma mudança inesperada (escola, família, planos).', 'family', 3, 20, 120, 9),

-- Competência 21: Pensamento Crítico (id=21)
('Análise de notícia', 'Escolha uma notícia e analise: fontes, vieses, o que não está sendo dito. Apresente.', 'school', 3, 21, 80, 8),
('Questionamento produtivo', 'Em uma reunião ou aula, faça 3 perguntas que geram reflexão (não just informação).', 'school', 3, 21, 90, 8),
('Argumento contrário', 'Para uma crença que você tem, construa o melhor argumento contrário possível.', 'family', 3, 21, 100, 9),
('Decisão analisada', 'Antes de uma decisão importante, liste todas as premissas que está assumindo. Questione-as.', 'family', 3, 21, 110, 9),
('Relatório crítico', 'Analise criticamente um projeto que participou: o que realmente funcionou? O que não funcionou?', 'school', 3, 21, 120, 10),

-- FASE 4 — Meses 10–12
-- Competência 22: Visão de Futuro (id=22)
('Carta para mim em 5 anos', 'Escreva uma carta detalhada para você mesmo daqui a 5 anos. Seal e guarde.', 'family', 4, 22, 90, 10),
('Tendências do meu setor', 'Pesquise as 5 principais tendências do setor que quer seguir. Apresente.', 'school', 4, 22, 100, 10),
('Plano de vida', 'Crie um plano de vida de 10 anos com metas em 4 dimensões: carreira, família, saúde, impacto.', 'family', 4, 22, 120, 11),
('Visão compartilhada', 'Compartilhe sua visão de futuro com sua família e colete feedback deles.', 'family', 4, 22, 110, 11),
('Alinhando ações à visão', 'Identifique 5 ações do seu dia a dia que estão alinhadas (ou não) com sua visão de futuro.', 'community', 4, 22, 130, 12),

-- Competência 23: Impacto Social (id=23)
('Mapeamento da comunidade', 'Identifique os 3 principais problemas da sua comunidade. Proponha soluções viáveis.', 'community', 4, 23, 90, 10),
('Projeto de impacto', 'Execute um projeto que resolve um problema real na sua comunidade. Documente resultados.', 'community', 4, 23, 120, 10),
('Parceria com empresa', 'Conecte um projeto social com uma empresa local. Documente a parceria.', 'company', 4, 23, 130, 11),
('Ampliando o alcance', 'Compartilhe seu projeto de impacto em um espaço público (escola, evento, redes). Meça alcance.', 'community', 4, 23, 140, 11),
('Relatório de impacto', 'Documente o impacto social gerado em 12 meses com dados, histórias e fotos.', 'community', 4, 23, 150, 12),

-- Competência 24: Legado (id=24)
('Síntese dos 12 meses', 'Escreva um texto sobre quem você era ao começar e quem é agora. Seja específico.', 'family', 4, 24, 100, 10),
('Passando adiante', 'Ensine algo que aprendeu nesses 12 meses para alguém mais novo. Documente.', 'community', 4, 24, 120, 11),
('Manifesto pessoal', 'Escreva seu manifesto: seus valores, missão e como quer ser lembrado.', 'family', 4, 24, 130, 11),
('Apresentação final', 'Prepare e apresente sua jornada de 12 meses para família, mentor e convidados (mín. 10 min).', 'community', 4, 24, 200, 12),
('Carta para o próximo', 'Escreva uma carta de conselhos para alguém que vai começar a mesma jornada que você fez.', 'community', 4, 24, 150, 12);
