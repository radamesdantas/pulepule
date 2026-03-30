-- Fix: permite que usuário autenticado busque teen por email para vincular
-- Sem esta policy, LinkTeenForm retorna vazio ao buscar teen ainda não vinculado
CREATE POLICY "Autenticado pode buscar teen por email"
ON public.profiles
FOR SELECT
USING (
  role = 'teen'
  AND auth.uid() IS NOT NULL
);
