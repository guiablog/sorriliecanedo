-- Modify the handle_new_admin_user function to only create an admin_users record
-- if the new user has a 'role' of 'admin' in their metadata.
-- This prevents patient sign-ups from creating unwanted admin records.
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check for the 'role' in the user's metadata.
  IF new.raw_user_meta_data->>'role' = 'admin' THEN
    INSERT INTO public.admin_users (user_id, name, email, status)
    VALUES (new.id, new.raw_user_meta_data->>'name', new.email, 'active');
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- The trigger 'on_auth_user_created' on 'auth.users' remains the same,
-- as the logic is now correctly handled within the function.
