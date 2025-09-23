CREATE OR REPLACE FUNCTION public.update_admin_user(
  user_id_to_update uuid,
  new_email text,
  new_name text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  caller_user_id uuid := auth.uid();
  is_admin boolean;
BEGIN
  -- Check if the user calling the function is an admin
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = caller_user_id AND status = 'active'
  ) INTO is_admin;

  IF NOT is_admin THEN
    RAISE EXCEPTION 'Permission denied: You must be an admin to update users.';
  END IF;

  -- Update the user in auth.users
  UPDATE auth.users
  SET
    email = new_email,
    raw_user_meta_data = raw_user_meta_data || jsonb_build_object('name', new_name)
  WHERE id = user_id_to_update;

END;
$$;

GRANT EXECUTE ON FUNCTION public.update_admin_user(uuid, text, text) TO authenticated;
