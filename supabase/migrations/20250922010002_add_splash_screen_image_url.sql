-- Add splash_screen_image_url column to app_settings table
ALTER TABLE public.app_settings ADD COLUMN IF NOT EXISTS splash_screen_image_url TEXT;
