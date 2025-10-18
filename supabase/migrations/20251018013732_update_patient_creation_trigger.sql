-- Update the function to handle new user creation without CPF and with nullable WhatsApp.
-- This function is triggered after a new user is inserted into auth.users.
CREATE OR REPLACE FUNCTION public.handle_new_patient_user()
RETURNS TRIGGER AS $$
BEGIN
  -- This trigger will only run for non-admin signups,
  -- which are identified by NOT having a 'role' of 'admin' in their metadata.
  -- This allows Google sign-ups to create a patient profile automatically.
  IF new.raw_user_meta_data->>'role' IS DISTINCT FROM 'admin' THEN
    INSERT INTO public.patients (user_id, name, email, whatsapp, status)
    VALUES (
      new.id,
      -- For Google sign-ups, 'name' might be under 'full_name'. For email, it's 'name'.
      COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
      new.email,
      new.raw_user_meta_data->>'whatsapp', -- This will be null if not provided
      'Ativo'
    );
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
