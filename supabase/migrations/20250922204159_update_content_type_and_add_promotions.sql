-- Create a new ENUM type for content types if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_type') THEN
        CREATE TYPE public.content_type AS ENUM ('tip', 'news', 'promotion', 'highlight');
    END IF;
END$$;

-- Add new enum values if the type already exists but without them
DO $$
BEGIN
    ALTER TYPE public.content_type ADD VALUE IF NOT EXISTS 'promotion';
    ALTER TYPE public.content_type ADD VALUE IF NOT EXISTS 'highlight';
EXCEPTION
    WHEN duplicate_object THEN null;
END$$;


-- Alter the 'content' table to use the new ENUM type
-- This requires casting the existing text values to the new enum type.
-- We need to handle the case where the column type is already correct.
DO $$
BEGIN
    IF (SELECT data_type FROM information_schema.columns WHERE table_name = 'content' AND column_name = 'type') = 'text' THEN
        ALTER TABLE public.content
        ALTER COLUMN type TYPE public.content_type
        USING (type::public.content_type);
    END IF;
END$$;


-- Insert some sample promotions and highlights
-- Use ON CONFLICT to avoid inserting duplicate titles
INSERT INTO public.content (type, title, content, published_date, status, image_url)
VALUES
('promotion', 'Clareamento Dental com 20% OFF', '<p>Deixe seu sorriso mais branco e radiante! Agende sua sessão de clareamento dental este mês e ganhe <strong>20% de desconto</strong>. Utilizamos as técnicas mais modernas e seguras para garantir um resultado incrível. Não perca essa chance de brilhar!</p>', '2025-09-22', 'Publicado', 'https://img.usecurling.com/p/800/400?q=teeth%20whitening'),
('promotion', 'Implantes Dentários Facilitados', '<p>Recupere a função e a estética do seu sorriso com implantes dentários. Oferecemos condições de pagamento facilitadas e uma avaliação completa para planejar seu tratamento. Volte a sorrir com confiança!</p>', '2025-09-20', 'Publicado', 'https://img.usecurling.com/p/800/400?q=dental%20implant'),
('highlight', 'Check-up Preventivo Digital', '<p>A prevenção é o melhor caminho para a saúde bucal. Nosso check-up digital utiliza tecnologia de ponta para detectar problemas antes que eles se agravem. Agende sua avaliação e mantenha seu sorriso saudável por mais tempo.</p>', '2025-09-18', 'Publicado', 'https://img.usecurling.com/p/800/400?q=dental%20checkup%20digital'),
('highlight', 'Ortodontia Invisível', '<p>Alinhe seus dentes de forma discreta e confortável com nossos alinhadores invisíveis. Uma alternativa moderna aos aparelhos convencionais, perfeita para adultos e adolescentes. Consulte nossos especialistas!</p>', '2025-09-15', 'Publicado', 'https://img.usecurling.com/p/800/400?q=invisible%20braces')
ON CONFLICT (title) DO NOTHING;
