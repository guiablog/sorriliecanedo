-- Add 'publication' value to the content_type ENUM
DO $$
BEGIN
    ALTER TYPE public.content_type ADD VALUE IF NOT EXISTS 'publication';
EXCEPTION
    WHEN duplicate_object THEN null;
END$$;
