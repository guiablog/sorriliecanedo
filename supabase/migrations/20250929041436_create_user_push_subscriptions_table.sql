CREATE TABLE public.user_push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    fcm_token TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT user_push_subscriptions_user_id_fcm_token_key UNIQUE (user_id, fcm_token)
);

ALTER TABLE public.user_push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage their own push subscriptions.
CREATE POLICY "Allow users to manage their own subscriptions"
ON public.user_push_subscriptions
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all subscriptions (for sending notifications).
CREATE POLICY "Allow admins to view subscriptions"
ON public.user_push_subscriptions
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

-- Function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update the updated_at column
CREATE TRIGGER on_user_push_subscriptions_updated
BEFORE UPDATE ON public.user_push_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
