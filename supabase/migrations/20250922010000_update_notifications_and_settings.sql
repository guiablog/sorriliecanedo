-- Add message column to notifications table
ALTER TABLE public.notifications ADD COLUMN message TEXT;

-- Add whatsapp_contact to app_settings table
ALTER TABLE public.app_settings ADD COLUMN whatsapp_contact TEXT;

-- Insert a default value for whatsapp_contact if the settings row exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.app_settings WHERE id = 1) THEN
    UPDATE public.app_settings SET whatsapp_contact = '5511999999999' WHERE id = 1;
  ELSE
    INSERT INTO public.app_settings (id, whatsapp_contact) VALUES (1, '5511999999999');
  END IF;
END $$;
