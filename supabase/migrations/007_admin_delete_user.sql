-- ============================================
-- Admin: função para deletar usuário
-- ============================================

-- Função SECURITY DEFINER para que o admin possa deletar qualquer usuário de auth.users
-- Cascade deleta profile, teen_xp, teen_missions, etc.
create or replace function public.admin_delete_user(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Verifica que o chamador é admin (via user_metadata)
  if (select raw_user_meta_data->>'role' from auth.users where id = auth.uid()) != 'admin' then
    raise exception 'Acesso negado: apenas admins podem excluir usuários';
  end if;

  -- Não permite deletar a si mesmo
  if target_user_id = auth.uid() then
    raise exception 'Não é possível excluir o próprio usuário';
  end if;

  -- Deleta o usuário (cascade remove profile e dados vinculados)
  delete from auth.users where id = target_user_id;
end;
$$;

-- Garante que apenas usuários autenticados podem chamar
revoke all on function public.admin_delete_user(uuid) from public;
grant execute on function public.admin_delete_user(uuid) to authenticated;
