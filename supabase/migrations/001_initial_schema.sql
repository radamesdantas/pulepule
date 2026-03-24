-- ============================================
-- Pule Pule — Schema Inicial
-- ============================================

-- Extensões
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text not null,
  role text not null check (role in ('teen', 'parent', 'mentor')),
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Usuários veem o próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuários atualizam o próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- Pais veem perfis dos seus teens
create policy "Pais veem perfis dos teens vinculados"
  on public.profiles for select
  using (
    exists (
      select 1 from public.parent_teen
      where parent_id = auth.uid() and teen_id = profiles.id
    )
  );

-- Mentores veem todos os perfis teens
create policy "Mentores veem perfis de teens"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'mentor'
    )
    and profiles.role = 'teen'
  );

-- ============================================
-- COMPETÊNCIAS (24 no total)
-- ============================================
create table public.competencies (
  id serial primary key,
  name text not null,
  description text not null,
  category text not null check (category in ('management', 'behavioral')),
  phase int not null check (phase between 1 and 4),
  xp_reward int not null default 100,
  icon text not null default '⭐'
);

-- Competências são públicas (leitura)
alter table public.competencies enable row level security;
create policy "Todos leem competências"
  on public.competencies for select using (true);

-- ============================================
-- MISSÕES
-- ============================================
create table public.missions (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  context text not null check (context in ('family', 'school', 'community', 'company')),
  phase int not null check (phase between 1 and 4),
  competency_id int references public.competencies(id),
  xp_reward int not null default 50,
  month int not null check (month between 1 and 12),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.missions enable row level security;
create policy "Todos leem missões"
  on public.missions for select using (true);

-- ============================================
-- MISSÕES DOS TEENS
-- ============================================
create table public.teen_missions (
  id uuid default uuid_generate_v4() primary key,
  teen_id uuid references public.profiles(id) on delete cascade not null,
  mission_id uuid references public.missions(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'submitted', 'approved', 'rejected')),
  evidence_url text,
  evidence_description text,
  mentor_feedback text,
  parent_approved boolean default false not null,
  completed_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(teen_id, mission_id)
);

alter table public.teen_missions enable row level security;

create policy "Teen vê suas próprias missões"
  on public.teen_missions for select
  using (auth.uid() = teen_id);

create policy "Teen atualiza suas missões"
  on public.teen_missions for update
  using (auth.uid() = teen_id);

create policy "Teen cria missões"
  on public.teen_missions for insert
  with check (auth.uid() = teen_id);

create policy "Pai vê missões dos teens vinculados"
  on public.teen_missions for select
  using (
    exists (
      select 1 from public.parent_teen
      where parent_id = auth.uid() and teen_id = teen_missions.teen_id
    )
  );

create policy "Pai aprova missões dos teens"
  on public.teen_missions for update
  using (
    exists (
      select 1 from public.parent_teen
      where parent_id = auth.uid() and teen_id = teen_missions.teen_id
    )
  );

create policy "Mentor vê e avalia todas as missões teens"
  on public.teen_missions for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'mentor'
    )
  );

-- ============================================
-- XP & GAMIFICAÇÃO DOS TEENS
-- ============================================
create table public.teen_xp (
  id uuid default uuid_generate_v4() primary key,
  teen_id uuid references public.profiles(id) on delete cascade unique not null,
  total_xp int default 0 not null,
  current_level int default 1 not null,
  current_streak int default 0 not null,
  max_streak int default 0 not null,
  badges text[] default '{}' not null,
  current_phase int default 1 not null check (current_phase between 1 and 4),
  autonomy_index int default 0 not null check (autonomy_index between 0 and 100),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.teen_xp enable row level security;

create policy "Teen vê seu próprio XP"
  on public.teen_xp for select using (auth.uid() = teen_id);

create policy "Teen atualiza seu próprio XP"
  on public.teen_xp for all using (auth.uid() = teen_id);

create policy "Pai vê XP dos teens vinculados"
  on public.teen_xp for select
  using (
    exists (
      select 1 from public.parent_teen
      where parent_id = auth.uid() and teen_id = teen_xp.teen_id
    )
  );

create policy "Mentor vê XP de todos os teens"
  on public.teen_xp for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'mentor'
    )
  );

-- ============================================
-- VÍNCULO PAI ↔ TEEN
-- ============================================
create table public.parent_teen (
  id uuid default uuid_generate_v4() primary key,
  parent_id uuid references public.profiles(id) on delete cascade not null,
  teen_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(parent_id, teen_id)
);

alter table public.parent_teen enable row level security;

create policy "Pai vê seus vínculos"
  on public.parent_teen for select using (auth.uid() = parent_id);

create policy "Teen vê seus vínculos"
  on public.parent_teen for select using (auth.uid() = teen_id);

create policy "Pai cria vínculo"
  on public.parent_teen for insert with check (auth.uid() = parent_id);

-- ============================================
-- TRIGGER: Criar perfil e XP ao registrar
-- ============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'teen')
  );

  if coalesce(new.raw_user_meta_data->>'role', 'teen') = 'teen' then
    insert into public.teen_xp (teen_id)
    values (new.id);
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- SEED: 24 Competências
-- ============================================
insert into public.competencies (name, description, category, phase, xp_reward, icon) values
-- Fase 1 — Gestão (6)
('Autoconhecimento', 'Entender seus pontos fortes e áreas de melhoria', 'management', 1, 100, '🔍'),
('Gestão do Tempo', 'Organizar prioridades e cumprir compromissos', 'management', 1, 100, '⏰'),
('Comunicação Assertiva', 'Expressar ideias com clareza e respeito', 'management', 1, 120, '💬'),
('Tomada de Decisão', 'Avaliar opções e escolher com responsabilidade', 'management', 2, 120, '🎯'),
('Liderança Situacional', 'Adaptar o estilo de liderança ao contexto', 'management', 2, 150, '🌟'),
('Gestão de Conflitos', 'Mediar situações de conflito de forma construtiva', 'management', 3, 150, '🤝'),
-- Fase 1 — Comportamental (6)
('Responsabilidade', 'Assumir compromissos e consequências das ações', 'behavioral', 1, 100, '🏆'),
('Empatia', 'Compreender a perspectiva e sentimentos dos outros', 'behavioral', 1, 100, '❤️'),
('Resiliência', 'Superar obstáculos mantendo o foco nos objetivos', 'behavioral', 1, 120, '💪'),
('Trabalho em Equipe', 'Colaborar efetivamente com diferentes pessoas', 'behavioral', 2, 120, '👥'),
('Criatividade', 'Gerar soluções inovadoras para desafios reais', 'behavioral', 2, 150, '💡'),
('Ética e Integridade', 'Agir com honestidade em todas as situações', 'behavioral', 2, 150, '⚖️'),
-- Fase 2 — Gestão (6)
('Planejamento Estratégico', 'Definir metas e criar planos de ação', 'management', 2, 150, '📋'),
('Delegação', 'Distribuir tarefas reconhecendo os pontos fortes de cada um', 'management', 3, 150, '🔄'),
('Feedback', 'Dar e receber críticas construtivas', 'management', 3, 150, '📊'),
('Gestão de Projetos', 'Planejar, executar e entregar projetos no prazo', 'management', 3, 200, '📁'),
('Inteligência Emocional', 'Gerenciar emoções em situações de pressão', 'management', 4, 200, '🧠'),
('Influência Positiva', 'Inspirar e motivar pessoas ao seu redor', 'management', 4, 200, '✨'),
-- Fase 2 — Comportamental (6)
('Iniciativa', 'Agir proativamente sem esperar ser solicitado', 'behavioral', 3, 150, '🚀'),
('Adaptabilidade', 'Ajustar-se rapidamente a novas situações', 'behavioral', 3, 150, '🦋'),
('Pensamento Crítico', 'Analisar informações antes de tirar conclusões', 'behavioral', 3, 200, '🔬'),
('Visão de Futuro', 'Planejar ações pensando no longo prazo', 'behavioral', 4, 200, '🔭'),
('Impacto Social', 'Contribuir positivamente para a comunidade', 'behavioral', 4, 200, '🌍'),
('Legado', 'Deixar uma marca positiva em tudo que faz', 'behavioral', 4, 250, '👑');
