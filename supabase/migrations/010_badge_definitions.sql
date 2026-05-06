-- ============================================
-- Migration 010 — Definicoes de Badges
-- ============================================
create table public.badge_definitions (
  code text primary key,
  name text not null,
  description text not null,
  icon text not null,
  rarity text not null check (rarity in ('bronze', 'silver', 'gold', 'diamond')),
  criteria text not null,
  sort_order int default 0 not null
);

alter table public.badge_definitions enable row level security;
create policy "Todos leem badge_definitions"
  on public.badge_definitions for select using (true);

insert into public.badge_definitions (code, name, description, icon, rarity, criteria, sort_order) values
('first_mission',     'Primeira Missao',       'Completou sua primeira missao aprovada',              '🎯', 'bronze',  '1 missao aprovada',          1),
('streak_7',          'Semana de Fogo',         '7 dias consecutivos com atividade',                   '🔥', 'bronze',  '7 dias de streak',           2),
('streak_30',         'Mes Imparavel',          '30 dias consecutivos — um mes inteiro!',              '⚡', 'silver',  '30 dias de streak',          3),
('streak_100',        'Centuriao',              '100 dias consecutivos — forca pura!',                 '💎', 'gold',    '100 dias de streak',         4),
('streak_267',        'Lenda Viva',             '267 dias consecutivos — quase 9 meses!',              '👑', 'diamond', '267 dias de streak',         5),
('xp_1000',           'Acumulador',             'Acumulou 1.000 XP',                                   '💰', 'bronze',  'total_xp >= 1000',           6),
('xp_5000',           'Cacador de XP',          'Acumulou 5.000 XP',                                   '🏆', 'silver',  'total_xp >= 5000',           7),
('xp_10000',          'Elite',                  'Acumulou 10.000 XP — nivel elite!',                   '🌟', 'gold',    'total_xp >= 10000',          8),
('level_3',           'Guerreiro',              'Alcancou o Nivel 3',                                   '⚔️', 'bronze',  'current_level >= 3',         9),
('level_5',           'Heroi',                  'Alcancou o Nivel 5',                                   '🦸', 'gold',    'current_level >= 5',        10),
('autonomy_50',       'Meio Caminho',           '50% de autonomia conquistada',                        '🦅', 'silver',  'autonomy_index >= 50',      11),
('autonomy_100',      'Totalmente Autonomo',    '100% de autonomia — jornada completa!',               '🎖️', 'diamond', 'autonomy_index = 100',      12),
('missions_10',       'Veterano',               '10 missoes aprovadas',                                '🛡️', 'bronze',  '10 missoes aprovadas',      13),
('missions_36',       'Campeao',                'Todas as 36 missoes aprovadas — COMPLETO!',           '🏅', 'diamond', '36 missoes aprovadas',      14),
('family_meeting_1',  'Familia Unida',          'Primeira reuniao familiar registrada',                '👨‍👩‍👦', 'bronze',  '1 reuniao familiar',        15),
('family_meeting_10', 'Lacos Fortes',           '10 reunioes familiares registradas',                  '🏠', 'silver',  '10 reunioes familiares',    16),
('competency_first',  'Explorador',             'Desbloqueou a primeira competencia',                  '🔓', 'bronze',  '1 competencia desbloqueada',17),
('all_contexts',      'Multi-Contexto',         'Missoes em todos os 5 contextos de vida',             '🌈', 'silver',  'todos os contextos',        18);
