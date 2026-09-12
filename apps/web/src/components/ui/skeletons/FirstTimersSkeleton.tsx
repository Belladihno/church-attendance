import { SkeletonLine } from '../Skeleton';

const HEADER = ['w-1/5', 'w-1/6', 'w-1/5', 'w-1/6', 'w-1/6'];
const ROWS = [
  ['w-2/5', 'w-1/3', 'w-1/2', 'w-1/4', 'w-1/5'],
  ['w-1/3', 'w-1/2', 'w-2/5', 'w-1/5', 'w-1/4'],
  ['w-1/2', 'w-1/4', 'w-1/3', 'w-1/4', 'w-1/5'],
  ['w-2/5', 'w-1/3', 'w-1/2', 'w-1/6', 'w-1/4'],
  ['w-1/3', 'w-2/5', 'w-1/4', 'w-1/4', 'w-1/5'],
  ['w-1/2', 'w-1/3', 'w-2/5', 'w-1/5', 'w-1/4'],
];

export function FirstTimersSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[720px] p-4 flex flex-col">
          <div className="grid grid-cols-5 gap-4 pb-3">
            {HEADER.map((w, i) => (
              <SkeletonLine key={i} width={w} height="h-3" />
            ))}
          </div>
          {ROWS.map((row, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 py-3 border-t border-border/40">
              {row.map((w, j) => (
                <SkeletonLine key={j} width={w} height="h-4" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
