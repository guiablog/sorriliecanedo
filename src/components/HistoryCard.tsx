import { Card, CardContent } from '@/components/ui/card'
import { History, ChevronRight } from 'lucide-react'

interface HistoryCardProps {
  onClick: () => void
}

export const HistoryCard = ({ onClick }: HistoryCardProps) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow mb-4 bg-white"
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-center">
        <div className="bg-secondary/10 p-3 rounded-full mr-4">
          <History className="h-6 w-6 text-secondary" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-neutral-dark">Histórico de Consultas</p>
          <p className="text-sm text-neutral-dark/70">
            Veja suas consultas anteriores e futuras
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-neutral-dark/50" />
      </CardContent>
    </Card>
  )
}
