-- Update the function to handle new user creation and ensure patient profile is active.
-- This function is triggered after a new user is inserted into auth.users.
CREATE OR REPLACE FUNCTION public.handle_new_patient_user()
RETURNS TRIGGER AS $$
BEGIN
  -- This trigger will only run for non-admin signups.
  -- An admin signup is identified by having 'role' = 'admin' in their metadata.
  -- All other signups, including email/password and OAuth, will be treated as patients.
  IF new.raw_user_meta_data->>'role' IS DISTINCT FROM 'admin' THEN
    INSERT INTO public.patients (user_id, name, email, whatsapp, status)
    VALUES (
      new.id,
      -- For Google sign-ups, 'name' might be under 'full_name'. For email, it's 'name'.
      COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Novo Paciente'),
      new.email,
      new.raw_user_meta_data->>'whatsapp', -- This will be null if not provided
      'Ativo'
    )
    ON CONFLICT (user_id) DO UPDATE
    SET
      name = EXCLUDED.name,
      email = EXCLUDED.email,
      status = 'Ativo'; -- Ensure status is always active on login/signup
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger is correctly configured to call the updated function.
-- The existing trigger 'on_auth_user_created_for_patient' should now use this new logic.
-- No change to the trigger definition itself is needed if it already calls this function.

-- One-time data correction:
-- Ensure all existing users in auth.users have a corresponding 'Ativo' patient record
-- if they are not an admin.
INSERT INTO public.patients (user_id, name, email, status)
SELECT
    u.id,
    COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', 'Paciente Existente'),
    u.email,
    'Ativo'
FROM auth.users u
LEFT JOIN public.admin_users au ON u.id = au.user_id
WHERE au.id IS NULL -- User is not an admin
ON CONFLICT (user_id) DO UPDATE
SET
    status = 'Ativo'
WHERE
    patients.status IS DISTINCT FROM 'Ativo';
