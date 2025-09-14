import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const healthTips = [
  {
    title: 'A Importância da Escovação Noturna',
    excerpt:
      'Nunca durma sem escovar os dentes para evitar o acúmulo de placa e cáries.',
    image:
      'https://img.usecurling.com/p/400/200?q=brushing%20teeth%20at%20night',
  },
  {
    title: 'Use o Fio Dental Diariamente',
    excerpt:
      'O fio dental alcança onde a escova não chega, removendo restos de comida e placa.',
    image: 'https://img.usecurling.com/p/400/200?q=dental%20floss',
  },
]

const dentalNews = [
  {
    title: 'Novas Tecnologias em Clareamento a Laser',
    excerpt:
      'Conheça os avanços que tornam o clareamento dental mais rápido e eficaz.',
    image: 'https://img.usecurling.com/p/400/200?q=laser%20teeth%20whitening',
  },
  {
    title: 'Alinhadores Invisíveis: A Alternativa Moderna',
    excerpt:
      'Saiba mais sobre os benefícios dos alinhadores transparentes para corrigir o sorriso.',
    image: 'https://img.usecurling.com/p/400/200?q=invisible%20aligners',
  },
]

export default function Content() {
  return (
    <div className="p-4 animate-fade-in-up">
      <Tabs defaultValue="tips" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tips">Dicas de Saúde</TabsTrigger>
          <TabsTrigger value="news">Novidades</TabsTrigger>
        </TabsList>
        <TabsContent value="tips" className="space-y-4 mt-4">
          {healthTips.map((tip, index) => (
            <Card
              key={index}
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            >
              <img
                src={tip.image}
                alt={tip.title}
                className="w-full h-32 object-cover"
              />
              <CardHeader>
                <CardTitle>{tip.title}</CardTitle>
                <CardDescription>{tip.excerpt}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="news" className="space-y-4 mt-4">
          {dentalNews.map((news, index) => (
            <Card
              key={index}
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            >
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-32 object-cover"
              />
              <CardHeader>
                <CardTitle>{news.title}</CardTitle>
                <CardDescription>{news.excerpt}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
