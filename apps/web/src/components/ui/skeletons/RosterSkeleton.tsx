import { SkeletonLine, SkeletonBox, SkeletonCircle } from '../Skeleton';

export function RosterSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-border/80 shadow-card divide-y divide-border/60 overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-3.5 py-2.5 flex items-center justify-between gap-2.5 min-h-[64px]">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <SkeletonCircle size="w-10 h-10" />
            <div className="flex flex-col gap-1.5 min-w-0 flex-1">
              <SkeletonLine width="w-2/5" height="h-4" />
              <SkeletonLine width="w-1/4" height="h-3" />
            </div>
          </div>
          <SkeletonBox width="w-24" height="h-9" className="rounded-lg" />
        </div>
      ))}
    </div>
  );
}
