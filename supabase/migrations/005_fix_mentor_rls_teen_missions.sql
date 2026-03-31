-- Fix: policy "for all" no mentor dava permissão de INSERT em teen_missions
-- Mentores devem apenas SELECT e UPDATE (aprovar/rejeitar), nunca INSERT

DROP POLICY IF EXISTS "Mentor vê e avalia todas as missões teens" ON public.teen_missions;

CREATE POLICY "Mentor vê missões teens"
  ON public.teen_missions FOR SELECT
  USING (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'mentor'
    )
  );

CREATE POLICY "Mentor avalia missões teens"
  ON public.teen_missions FOR UPDATE
  USING (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'mentor'
    )
  );
