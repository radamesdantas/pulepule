-- ============================================================
-- Migration 015 — Streak baseado em atividade (não só aprovação)
-- Corrige D1: streak só incrementava em missões aprovadas (avg 3/mês).
-- Agora qualquer mudança de status (start, submit, approve) conta como
-- atividade do dia, tornando streaks de 7+ dias alcançáveis.
-- ============================================================

create or replace function public.handle_teen_activity()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  xp_row    public.teen_xp%rowtype;
  today     date := current_date;
  last_day  date;
  new_streak int;
begin
  -- Qualquer mudança de status = atividade do dia
  if NEW.status IS DISTINCT FROM OLD.status then

    -- Marcar completed_at somente em aprovação
    if NEW.status = 'approved' then
      NEW.completed_at := now();
    end if;

    -- Buscar estado atual de XP (updated_at serve como proxy de "último dia ativo")
    select * into xp_row from public.teen_xp where teen_id = NEW.teen_id;
    if not found then return NEW; end if;

    last_day := date(xp_row.updated_at);

    new_streak := case
      when xp_row.current_streak = 0              then 1          -- primeira atividade ever
      when last_day = today                        then xp_row.current_streak     -- já contou hoje
      when last_day = today - interval '1 day'     then xp_row.current_streak + 1 -- dia consecutivo
      else                                              1          -- streak quebrado
    end;

    update public.teen_xp
    set
      current_streak = new_streak,
      max_streak     = greatest(max_streak, new_streak),
      updated_at     = now()
    where teen_id = NEW.teen_id;

  end if;

  return NEW;
end;
$$;

-- Substitui o trigger antigo (handle_mission_approved → handle_teen_activity)
drop trigger if exists on_mission_approved on public.teen_missions;
drop trigger if exists on_teen_activity on public.teen_missions;

create trigger on_teen_activity
  before update on public.teen_missions
  for each row execute procedure public.handle_teen_activity();

-- Função antiga pode ser mantida como dead code ou removida
-- drop function if exists public.handle_mission_approved();
