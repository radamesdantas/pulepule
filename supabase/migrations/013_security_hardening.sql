-- ============================================================
-- Migration 013 — Security Hardening
-- 1. Revoga EXECUTE de funções SECURITY DEFINER do role anon
-- 2. Corrige bucket evidence (remove listagem pública)
-- ============================================================

-- ── Trigger functions ────────────────────────────────────────
-- Funções chamadas apenas por triggers — anon e authenticated
-- não precisam de EXECUTE direto via /rest/v1/rpc/

REVOKE EXECUTE ON FUNCTION public.handle_badge_unlock()    FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_mission_approved() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user()        FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_mission_update()  FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trigger_phase_check()    FROM anon, authenticated;

-- ── RPCs internos — revogar apenas do anon ───────────────────
-- A checagem de autenticação/autorização real está nas API routes (Next.js)
-- mas o banco não deve aceitar chamadas diretas não autenticadas

REVOKE EXECUTE ON FUNCTION public.admin_delete_user(uuid)                  FROM anon;
REVOKE EXECUTE ON FUNCTION public.award_badges(uuid, integer, integer)     FROM anon;
REVOKE EXECUTE ON FUNCTION public.check_phase_advancement(uuid)            FROM anon;
REVOKE EXECUTE ON FUNCTION public.daily_checkin(uuid)                      FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_user_role(uuid)                      FROM anon;

-- ── Bucket evidence — remover listagem pública ───────────────
-- Buckets públicos permitem acesso a objetos por URL sem política SELECT.
-- A política "Allow public read" estava permitindo LISTAR todos os arquivos
-- via /storage/v1/object/list/evidence — expondo mais do que necessário.
-- Removendo: objetos continuam acessíveis por URL direta (bucket ainda público).

DROP POLICY IF EXISTS "Allow public read 6c0biv_0" ON storage.objects;
