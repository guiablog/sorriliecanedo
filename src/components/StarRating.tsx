import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  count?: number
  rating: number
  onRatingChange: (rating: number) => void
  size?: number
}

export const StarRating = ({
  count = 5,
  rating,
  onRatingChange,
  size = 24,
}: StarRatingProps) => {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex items-center space-x-1">
      {[...Array(count)].map((_, index) => {
        const ratingValue = index + 1
        return (
          <button
            type="button"
            key={ratingValue}
            onClick={() => onRatingChange(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
            className="cursor-pointer"
          >
            <Star
              className={cn(
                'transition-colors',
                ratingValue <= (hover || rating)
                  ? 'text-yellow-400'
                  : 'text-gray-300',
              )}
              fill={
                ratingValue <= (hover || rating)
                  ? 'currentColor'
                  : 'transparent'
              }
              style={{ width: size, height: size }}
            />
          </button>
        )
      })}
    </div>
  )
}
