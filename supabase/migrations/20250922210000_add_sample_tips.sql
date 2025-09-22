INSERT INTO public.content (type, title, content, published_date, status, image_url)
VALUES
('tip', 'A Importância da Escovação Noturna', '<p>Você sabia que a escovação antes de dormir é a mais importante do dia? Durante a noite, a produção de saliva diminui, deixando seus dentes mais vulneráveis às bactérias. Garanta uma escovação completa para um sorriso saudável!</p>', '2025-09-21', 'Publicado', 'https://img.usecurling.com/p/800/400?q=brushing%20teeth%20at%20night'),
('tip', 'O Poder do Fio Dental', '<p>O fio dental não é um luxo, é uma necessidade! Ele alcança áreas onde a escova não chega, removendo placa bacteriana e restos de alimentos. Use diariamente e previna cáries e doenças na gengiva.</p>', '2025-09-19', 'Publicado', 'https://img.usecurling.com/p/800/400?q=dental%20floss'),
('tip', 'Alimentos que Fortalecem os Dentes', '<p>Sua alimentação impacta diretamente sua saúde bucal. Alimentos ricos em cálcio como leite e queijo, e vegetais crocantes como cenoura e maçã, ajudam a fortalecer os dentes e a limpar a boca naturalmente.</p>', '2025-09-17', 'Publicado', 'https://img.usecurling.com/p/800/400?q=healthy%20food%20for%20teeth')
ON CONFLICT (title) DO NOTHING;
