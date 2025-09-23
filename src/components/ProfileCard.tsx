import { Card, CardContent } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProfileCardProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  onClick: () => void
  className?: string
}

export const ProfileCard = ({
  icon,
  title,
  subtitle,
  onClick,
  className,
}: ProfileCardProps) => {
  return (
    <Card
      className={cn(
        'cursor-pointer hover:shadow-md transition-shadow bg-white',
        className,
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-center">
        <div className="bg-secondary/10 p-3 rounded-full mr-4">{icon}</div>
        <div className="flex-1">
          <p className="font-bold text-neutral-dark">{title}</p>
          <p className="text-sm text-neutral-dark/70">{subtitle}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-neutral-dark/50" />
      </CardContent>
    </Card>
  )
}
