CREATE TABLE public.contact_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_resolved BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own inquiries
CREATE POLICY "Allow authenticated users to insert inquiries"
ON public.contact_inquiries
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow admins to view and manage all inquiries
CREATE POLICY "Allow admins to manage inquiries"
ON public.contact_inquiries
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
  )
);
