-- Cria função SECURITY DEFINER para checar role sem disparar RLS
-- Isso quebra a recursão infinita nas políticas de profiles
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- ── profiles ─────────────────────────────────────────────────────────────────

-- Remove políticas que causam recursão
DROP POLICY IF EXISTS "Mentor vê perfis de teens" ON public.profiles;
DROP POLICY IF EXISTS "Autenticado pode buscar teen por email" ON public.profiles;

-- Recria sem subquery recursiva
CREATE POLICY "Mentor vê perfis de teens"
  ON public.profiles FOR SELECT
  USING (
    public.get_user_role(auth.uid()) = 'mentor'
    AND role = 'teen'
  );

CREATE POLICY "Autenticado pode buscar teen por email"
  ON public.profiles FOR SELECT
  USING (
    role = 'teen' AND auth.uid() IS NOT NULL
  );

-- ── teen_missions ─────────────────────────────────────────────────────────────

-- Remove política FOR ALL de mentor (causava o trigger da recursão)
DROP POLICY IF EXISTS "Mentor gerencia missões" ON public.teen_missions;

-- Recria separada por operação, usando a função segura
CREATE POLICY "Mentor vê teen missions"
  ON public.teen_missions FOR SELECT
  USING (public.get_user_role(auth.uid()) = 'mentor');

CREATE POLICY "Mentor atualiza teen missions"
  ON public.teen_missions FOR UPDATE
  USING (public.get_user_role(auth.uid()) = 'mentor');
