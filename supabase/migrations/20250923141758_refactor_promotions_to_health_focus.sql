-- Add 'health_focus' value to the content_type ENUM if it doesn't exist
DO $$
BEGIN
    -- Check if the type exists before trying to alter it
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_type') THEN
        ALTER TYPE public.content_type ADD VALUE IF NOT EXISTS 'health_focus';
    END IF;
EXCEPTION
    WHEN duplicate_object THEN null;
END$$;

-- Update existing content items from 'promotion' and 'highlight' to 'health_focus'
UPDATE public.content
SET type = 'health_focus'::public.content_type
WHERE type IN ('promotion', 'highlight');
