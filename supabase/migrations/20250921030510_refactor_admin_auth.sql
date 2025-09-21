-- Remove the insecure password column from admin_users
ALTER TABLE public.admin_users DROP COLUMN IF EXISTS password;

-- Add a user_id column to link to auth.users, if it doesn't exist with the constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.admin_users ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  ELSE
    -- If column exists, ensure the foreign key is there
    ALTER TABLE public.admin_users DROP CONSTRAINT IF EXISTS admin_users_user_id_fkey;
    ALTER TABLE public.admin_users ADD CONSTRAINT admin_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create a function to handle new user creation and link to admin_users
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admin_users (user_id, name, email, status)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email, 'active');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function on new user sign up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_user();
