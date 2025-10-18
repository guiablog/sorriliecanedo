-- Step 1: Drop the unique constraint on the cpf column if it exists.
ALTER TABLE public.patients DROP CONSTRAINT IF EXISTS patients_cpf_key;

-- Step 2: Drop the cpf column from the patients table.
ALTER TABLE public.patients DROP COLUMN IF EXISTS cpf;

-- Step 3: Make the whatsapp column nullable.
ALTER TABLE public.patients ALTER COLUMN whatsapp DROP NOT NULL;
