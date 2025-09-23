-- Add clinic_address and clinic_phone columns to app_settings table
ALTER TABLE public.app_settings ADD COLUMN IF NOT EXISTS clinic_address TEXT;
ALTER TABLE public.app_settings ADD COLUMN IF NOT EXISTS clinic_phone TEXT;

-- Populate the new columns for the existing settings row (id=1)
-- This ensures that if the row already exists, it gets updated with the new info.
-- If it doesn't exist, the app logic should handle creating it, but we can pre-populate.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.app_settings WHERE id = 1) THEN
    UPDATE public.app_settings
    SET
      clinic_address = 'Av. Pedro Miranda, Quadra: 05 Lote 38 Sala 1 Res. Pedro Miranda, Sen. Canedo - GO, 75262-553, Brasil',
      clinic_phone = '62 9 8122-7085'
    WHERE id = 1;
  ELSE
    -- This part is a fallback, assuming the settings row with id=1 should exist.
    INSERT INTO public.app_settings (id, clinic_address, clinic_phone)
    VALUES (1, 'Av. Pedro Miranda, Quadra: 05 Lote 38 Sala 1 Res. Pedro Miranda, Sen. Canedo - GO, 75262-553, Brasil', '62 9 8122-7085')
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;
