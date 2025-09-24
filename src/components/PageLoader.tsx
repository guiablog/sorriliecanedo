import { Skeleton } from '@/components/ui/skeleton'

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen w-full">
    <div className="w-full max-w-md p-8 space-y-4">
      <Skeleton className="h-12 w-48 mx-auto" />
      <Skeleton className="h-8 w-full" />
      <div className="space-y-2 pt-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full pt-4" />
    </div>
  </div>
)
