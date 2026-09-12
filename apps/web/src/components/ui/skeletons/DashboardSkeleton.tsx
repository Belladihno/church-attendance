import { SkeletonLine, SkeletonBox, SkeletonCircle } from '../Skeleton';

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl md:rounded-xl p-4 md:p-6 shadow-card">
            <SkeletonLine width="w-1/3" height="h-3" />
            <div className="mt-3 md:mt-4 flex flex-col gap-2">
              <SkeletonLine width="w-1/2" height="h-8" />
              <SkeletonLine width="w-2/3" height="h-3" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        <div className="lg:col-span-7 bg-white rounded-2xl md:rounded-xl p-4 md:p-6 shadow-card flex flex-col gap-3">
          <SkeletonLine width="w-1/3" height="h-4" />
          <SkeletonBox height="h-48" />
        </div>
        <div className="lg:col-span-5 bg-white rounded-2xl md:rounded-xl p-4 md:p-6 shadow-card flex flex-col gap-3">
          <SkeletonLine width="w-1/2" height="h-4" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <SkeletonCircle size="w-8 h-8" />
              <div className="flex-1 flex flex-col gap-2">
                <SkeletonLine width="w-2/3" height="h-3" />
                <SkeletonLine width="w-1/3" height="h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
