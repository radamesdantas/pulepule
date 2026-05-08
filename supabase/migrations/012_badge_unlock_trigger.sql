-- ============================================================
-- Migration 012 — Trigger de desbloqueio de badges
-- Grava badges em teen_xp.badges[] quando condicoes sao atingidas
-- Executa AFTER UPDATE em teen_missions (apos streak e XP ja atualizados)
-- ============================================================

create or replace function public.handle_badge_unlock()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  xp_row    public.teen_xp%rowtype;
  approved_count int;
  new_badges text[] := '{}';
begin
  -- Executa apenas quando status muda para 'approved'
  if NEW.status = 'approved' and (OLD.status is null or OLD.status != 'approved') then

    -- Buscar estado atual do teen_xp (ja atualizado pelos triggers anteriores)
    select * into xp_row from public.teen_xp where teen_id = NEW.teen_id;
    if not found then return NEW; end if;

    -- Contar missoes aprovadas (incluindo a atual)
    select count(*) into approved_count
    from public.teen_missions
    where teen_id = NEW.teen_id and status = 'approved';

    -- Criterios de missoes
    if approved_count >= 1  then new_badges := array_append(new_badges, 'first_mission'); end if;
    if approved_count >= 10 then new_badges := array_append(new_badges, 'missions_10');   end if;
    if approved_count >= 36 then new_badges := array_append(new_badges, 'missions_36');   end if;

    -- Criterios de streak
    if xp_row.current_streak >= 7   then new_badges := array_append(new_badges, 'streak_7');   end if;
    if xp_row.current_streak >= 30  then new_badges := array_append(new_badges, 'streak_30');  end if;
    if xp_row.current_streak >= 100 then new_badges := array_append(new_badges, 'streak_100'); end if;
    if xp_row.current_streak >= 267 then new_badges := array_append(new_badges, 'streak_267'); end if;

    -- Criterios de XP
    if xp_row.total_xp >= 1000  then new_badges := array_append(new_badges, 'xp_1000');  end if;
    if xp_row.total_xp >= 5000  then new_badges := array_append(new_badges, 'xp_5000');  end if;
    if xp_row.total_xp >= 10000 then new_badges := array_append(new_badges, 'xp_10000'); end if;

    -- Criterios de nivel
    if xp_row.current_level >= 3 then new_badges := array_append(new_badges, 'level_3'); end if;
    if xp_row.current_level >= 5 then new_badges := array_append(new_badges, 'level_5'); end if;

    -- Criterios de autonomia
    if xp_row.autonomy_index >= 50  then new_badges := array_append(new_badges, 'autonomy_50');  end if;
    if xp_row.autonomy_index >= 100 then new_badges := array_append(new_badges, 'autonomy_100'); end if;

    -- Mescla com badges existentes (sem duplicatas)
    if array_length(new_badges, 1) > 0 then
      update public.teen_xp
      set
        badges     = (
          select array_agg(distinct b order by b)
          from unnest(coalesce(badges, '{}') || new_badges) as b
        ),
        updated_at = now()
      where teen_id = NEW.teen_id;
    end if;

  end if;

  return NEW;
end;
$$;

-- Nome com 'z' garante execucao apos on_mission_status_change (ordem alfabetica)
drop trigger if exists z_on_mission_approved_badge_unlock on public.teen_missions;
create trigger z_on_mission_approved_badge_unlock
  after update on public.teen_missions
  for each row execute procedure public.handle_badge_unlock();
