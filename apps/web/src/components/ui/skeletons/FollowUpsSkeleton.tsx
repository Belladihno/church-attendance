import { SkeletonLine, SkeletonBox } from '../Skeleton';

const ROWS = [
  { top: 'w-1/2', sub: 'w-1/3' },
  { top: 'w-2/5', sub: 'w-1/4' },
  { top: 'w-1/2', sub: 'w-2/5' },
  { top: 'w-2/5', sub: 'w-1/3' },
];

export function FollowUpsSkeleton() {
  return (
    <div className="flex flex-col gap-3.5 md:gap-4">
      {ROWS.map((row, i) => (
        <div key={i} className="bg-white rounded-2xl md:rounded-xl p-4 md:p-6 shadow-card flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <SkeletonLine width={row.top} height="h-4" />
            <SkeletonLine width={row.sub} height="h-3" />
          </div>
          <SkeletonBox width="w-20" height="h-7" className="rounded-md shrink-0" />
        </div>
      ))}
    </div>
  );
}
