-- ============================================================
-- Migration 014 — Security & Performance Fixes
-- 1. Revoga EXECUTE de admin_delete_user do role authenticated
-- 2. Índices em family_meetings (teen_id, recorded_by)
-- ============================================================

-- ── Security: admin_delete_user não deve ser chamada diretamente ──
-- A proteção real está na API route Next.js (/api/admin/users/[id])
-- mas o banco também deve bloquear chamadas diretas via /rest/v1/rpc/
REVOKE EXECUTE ON FUNCTION public.admin_delete_user(uuid) FROM authenticated;

-- ── Performance: foreign keys sem índice em family_meetings ──
CREATE INDEX IF NOT EXISTS idx_family_meetings_teen_id
  ON public.family_meetings (teen_id);

CREATE INDEX IF NOT EXISTS idx_family_meetings_recorded_by
  ON public.family_meetings (recorded_by);
