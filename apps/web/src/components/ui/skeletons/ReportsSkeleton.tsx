import { SkeletonLine, SkeletonBox } from '../Skeleton';

export function ReportsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[0, 1].map((i) => (
        <div key={i} className="bg-white rounded-xl p-4 md:p-6 shadow-card flex flex-col gap-3">
          <SkeletonLine width="w-1/4" height="h-4" />
          <SkeletonBox height="h-48" />
        </div>
      ))}
    </div>
  );
}
