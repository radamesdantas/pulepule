-- ============================================================
-- 006: Remove as 12 competências de gestão (CG01-CG12)
--      e seus 36 comportamentos (missões)
-- As 12 competências comportamentais (CC01-CC12, id 13-24) permanecem
-- ============================================================

-- 1. Remove missões vinculadas às competências de gestão (competency_id 1-12)
DELETE FROM public.teen_missions
WHERE mission_id IN (
  SELECT id FROM public.missions WHERE competency_id BETWEEN 1 AND 12
);

DELETE FROM public.missions WHERE competency_id BETWEEN 1 AND 12;

-- 2. Remove as competências de gestão
DELETE FROM public.competencies WHERE category = 'management';
