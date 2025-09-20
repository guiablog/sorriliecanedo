import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useContentStore } from '@/stores/content'
import { Skeleton } from '@/components/ui/skeleton'

const getImageQuery = (title: string) => {
  return encodeURIComponent(
    title.toLowerCase().split(' ').slice(0, 3).join(' '),
  )
}

export default function Content() {
  const { content, loading } = useContentStore()

  const tips = content.filter(
    (c) => c.type === 'tip' && c.status === 'Publicado',
  )
  const news = content.filter(
    (c) => c.type === 'news' && c.status === 'Publicado',
  )

  return (
    <div className="p-4 animate-fade-in-up">
      <Tabs defaultValue="tips" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tips">Dicas de Saúde</TabsTrigger>
          <TabsTrigger value="news">Novidades</TabsTrigger>
        </TabsList>
        <TabsContent value="tips" className="space-y-4 mt-4">
          {loading
            ? Array.from({ length: 2 }).map((_, index) => (
                <Card key={index}>
                  <Skeleton className="w-full h-32" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardHeader>
                </Card>
              ))
            : tips.map((tip) => (
                <Card
                  key={tip.id}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                >
                  <img
                    src={`https://img.usecurling.com/p/400/200?q=${getImageQuery(
                      tip.title,
                    )}`}
                    alt={tip.title}
                    className="w-full h-32 object-cover"
                  />
                  <CardHeader>
                    <CardTitle>{tip.title}</CardTitle>
                    <CardDescription>
                      {tip.content.substring(0, 100)}...
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
        </TabsContent>
        <TabsContent value="news" className="space-y-4 mt-4">
          {loading
            ? Array.from({ length: 2 }).map((_, index) => (
                <Card key={index}>
                  <Skeleton className="w-full h-32" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardHeader>
                </Card>
              ))
            : news.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                >
                  <img
                    src={`https://img.usecurling.com/p/400/200?q=${getImageQuery(
                      item.title,
                    )}`}
                    alt={item.title}
                    className="w-full h-32 object-cover"
                  />
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>
                      {item.content.substring(0, 100)}...
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
