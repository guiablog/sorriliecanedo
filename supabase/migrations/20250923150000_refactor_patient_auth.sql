-- Step 1: Remove the insecure password column from patients
ALTER TABLE public.patients DROP COLUMN IF EXISTS password;

-- Step 2: Add a user_id column to link to auth.users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'patients' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.patients ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    ALTER TABLE public.patients ADD CONSTRAINT patients_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Step 3: Create a function to handle new patient user creation
CREATE OR REPLACE FUNCTION public.handle_new_patient_user()
RETURNS TRIGGER AS $$
BEGIN
  -- This trigger will only run for non-admin signups,
  -- identified by the presence of 'cpf' in the user metadata.
  IF new.raw_user_meta_data ? 'cpf' THEN
    INSERT INTO public.patients (user_id, name, email, cpf, whatsapp, status)
    VALUES (
      new.id,
      new.raw_user_meta_data->>'name',
      new.email,
      new.raw_user_meta_data->>'cpf',
      new.raw_user_meta_data->>'whatsapp',
      'Ativo'
    );
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Create a trigger to call the function on new user sign up.
-- This trigger is named differently from the admin trigger to avoid conflicts.
DROP TRIGGER IF EXISTS on_auth_user_created_for_patient ON auth.users;
CREATE TRIGGER on_auth_user_created_for_patient
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_patient_user();
