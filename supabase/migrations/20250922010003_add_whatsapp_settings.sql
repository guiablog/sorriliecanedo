-- Add whatsapp_button_enabled and whatsapp_icon_url columns to app_settings table
ALTER TABLE public.app_settings ADD COLUMN IF NOT EXISTS whatsapp_button_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE public.app_settings ADD COLUMN IF NOT EXISTS whatsapp_icon_url TEXT;

-- Ensure the default value is applied to existing rows
UPDATE public.app_settings SET whatsapp_button_enabled = TRUE WHERE id = 1 AND whatsapp_button_enabled IS NULL;
