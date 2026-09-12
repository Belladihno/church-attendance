import { SkeletonLine, SkeletonBox } from '../Skeleton';

export function AttendanceGridSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[720px] p-4 flex flex-col gap-2">
          <div className="grid gap-2" style={{ gridTemplateColumns: 'minmax(180px, 1.4fr) repeat(4, 1fr)' }}>
            <SkeletonLine width="w-2/3" height="h-4" />
            {[0, 1, 2, 3].map((i) => (
              <SkeletonBox key={i} height="h-9" />
            ))}
          </div>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="grid gap-2 py-2 border-t border-border/40"
              style={{ gridTemplateColumns: 'minmax(180px, 1.4fr) repeat(4, 1fr)' }}
            >
              <SkeletonLine width="w-1/2" height="h-4" />
              {[0, 1, 2, 3].map((j) => (
                <SkeletonBox key={j} height="h-8" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
