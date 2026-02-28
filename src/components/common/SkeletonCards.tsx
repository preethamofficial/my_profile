interface SkeletonCardsProps {
  count?: number
}

export function SkeletonCards({ count = 6 }: SkeletonCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <article key={`skeleton-${index}`} className="glass-card rounded-2xl p-5">
          <div className="skeleton h-5 w-2/3" />
          <div className="skeleton mt-4 h-4 w-full" />
          <div className="skeleton mt-2 h-4 w-4/5" />
          <div className="mt-6 flex gap-2">
            <div className="skeleton h-7 w-16 rounded-full" />
            <div className="skeleton h-7 w-16 rounded-full" />
          </div>
        </article>
      ))}
    </div>
  )
}
