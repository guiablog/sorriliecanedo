CREATE OR REPLACE FUNCTION public.delete_user(user_id_to_delete uuid)
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
    RAISE EXCEPTION 'Permission denied: You must be an admin to delete users.';
  END IF;

  -- Prevent admin from deleting themselves
  IF caller_user_id = user_id_to_delete THEN
      RAISE EXCEPTION 'Action denied: Admins cannot delete their own account.';
  END IF;

  -- Delete the user from auth.users
  -- The ON DELETE CASCADE on admin_users and patients tables will handle the rest.
  DELETE FROM auth.users WHERE id = user_id_to_delete;
END;
$$;

-- Grant execute permission to the authenticated role
GRANT EXECUTE ON FUNCTION public.delete_user(uuid) TO authenticated;
