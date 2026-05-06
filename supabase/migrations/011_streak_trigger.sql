-- ============================================
-- Migration 011 — Trigger de Streak
-- ============================================

create or replace function public.handle_mission_approved()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  last_activity date;
  today date := current_date;
  new_streak int;
begin
  -- So executa quando status muda para 'approved'
  if NEW.status = 'approved' and (OLD.status is null or OLD.status != 'approved') then

    -- Marcar data de conclusao
    NEW.completed_at := now();

    -- Buscar ultimo dia de atividade (excluindo a missao atual)
    select date(max(completed_at)) into last_activity
    from public.teen_missions
    where teen_id = NEW.teen_id
      and status = 'approved'
      and id != NEW.id;

    -- Calcular novo streak
    new_streak := case
      when last_activity is null                            then 1
      when last_activity = today                            then (select current_streak from public.teen_xp where teen_id = NEW.teen_id)
      when last_activity = today - interval '1 day'        then (select current_streak from public.teen_xp where teen_id = NEW.teen_id) + 1
      else                                                       1
    end;

    -- Atualizar teen_xp
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

drop trigger if exists on_mission_approved on public.teen_missions;
create trigger on_mission_approved
  before update on public.teen_missions
  for each row execute procedure public.handle_mission_approved();
