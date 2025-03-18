import { Skeleton } from './ui/skeleton'

export const CardListSkeleton = () => {
  return (
    <div className="mx-auto grid max-w-(--breakpoint-xl) grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <Skeleton key={i} className="h-[125px] w-full rounded-xl" />
      ))}
    </div>
  )
}
