-- Add a nullable patient_id column to appointments
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS patient_id UUID;

-- Populate the new patient_id column by matching patient_name with name in patients table
-- This assumes patient names are unique. A more robust solution would use another identifier if available.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appointments' AND column_name='patient_id') THEN
        UPDATE public.appointments a
        SET patient_id = p.id
        FROM public.patients p
        WHERE a.patient_name = p.name AND a.patient_id IS NULL;
    END IF;
END $$;


-- Add a foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_appointments_patient_id'
    ) THEN
        ALTER TABLE public.appointments
        ADD CONSTRAINT fk_appointments_patient_id
        FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE SET NULL;
    END IF;
END $$;
