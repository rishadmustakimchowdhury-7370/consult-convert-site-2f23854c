-- Ensure user_roles can be upserted by user_id (one role per user)
-- 1) Remove duplicates (keep newest) if any exist
WITH ranked AS (
  SELECT id,
         user_id,
         role,
         created_at,
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC NULLS LAST, id DESC) AS rn
  FROM public.user_roles
)
DELETE FROM public.user_roles ur
USING ranked r
WHERE ur.id = r.id
  AND r.rn > 1;

-- 2) Add unique constraint on user_id (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'user_roles_user_id_key'
      AND conrelid = 'public.user_roles'::regclass
  ) THEN
    ALTER TABLE public.user_roles
      ADD CONSTRAINT user_roles_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- 3) Make sure RLS is enabled and users can read their own role
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_roles'
      AND policyname = 'Users can read their own role'
  ) THEN
    CREATE POLICY "Users can read their own role"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;
END $$;