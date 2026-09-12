import { SkeletonLine } from '../Skeleton';

const COLS = ['w-1/4', 'w-1/5', 'w-1/4', 'w-1/6'];
const ROW_WIDTHS = [
  ['w-2/5', 'w-1/3', 'w-1/2', 'w-1/4'],
  ['w-1/3', 'w-1/2', 'w-2/5', 'w-1/5'],
  ['w-1/2', 'w-1/4', 'w-1/3', 'w-1/4'],
  ['w-2/5', 'w-1/3', 'w-1/2', 'w-1/6'],
  ['w-1/3', 'w-2/5', 'w-1/4', 'w-1/4'],
  ['w-1/2', 'w-1/3', 'w-2/5', 'w-1/5'],
  ['w-2/5', 'w-1/4', 'w-1/3', 'w-1/4'],
  ['w-1/3', 'w-1/3', 'w-1/2', 'w-1/6'],
];

export function MembersListSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[640px] p-4 flex flex-col">
          <div className="grid grid-cols-4 gap-4 pb-3">
            {COLS.map((w, i) => (
              <SkeletonLine key={i} width={w} height="h-3" />
            ))}
          </div>
          {ROW_WIDTHS.map((row, i) => (
            <div key={i} className="grid grid-cols-4 gap-4 py-3 border-t border-border/40">
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
