import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { ContentItem } from '@/stores/content'

interface ContentCarouselProps {
  title: string
  items: ContentItem[]
  onItemClick: (item: ContentItem, list: ContentItem[]) => void
}

const getImageQuery = (title: string) => {
  return encodeURIComponent(
    title.toLowerCase().split(' ').slice(0, 3).join(' '),
  )
}

export const ContentCarousel = ({
  title,
  items,
  onItemClick,
}: ContentCarouselProps) => {
  if (items.length === 0) {
    return null
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-neutral-dark">{title}</h2>
      <Carousel opts={{ loop: items.length > 1 }}>
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem
              key={item.id}
              onClick={() => onItemClick(item, items)}
            >
              <Card className="overflow-hidden cursor-pointer">
                <img
                  src={
                    item.image_url ||
                    `https://img.usecurling.com/p/400/200?q=${getImageQuery(
                      item.title,
                    )}`
                  }
                  alt={item.title}
                  className="w-full h-32 object-cover"
                />
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>
                    {item.content.replace(/<[^>]*>?/gm, '').substring(0, 70)}
                    ...
                  </CardDescription>
                </CardHeader>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </section>
  )
}
