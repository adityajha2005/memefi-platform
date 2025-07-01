export function SkeletonLoader({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-300 border-2 border-black retro-border"></div>
    </div>
  )
}

export function MemeCardSkeleton() {
  return (
    <div className="meme-card p-0 overflow-hidden">
      <SkeletonLoader className="h-48 w-full" />
      <div className="p-4 space-y-4">
        <SkeletonLoader className="h-6 w-3/4" />
        <div className="flex items-center gap-3">
          <SkeletonLoader className="h-10 w-10 rounded-full" />
          <SkeletonLoader className="h-4 w-24" />
        </div>
        <div className="flex gap-2">
          <SkeletonLoader className="h-8 w-20" />
          <SkeletonLoader className="h-8 w-16" />
        </div>
        <SkeletonLoader className="h-10 w-full" />
      </div>
    </div>
  )
}
