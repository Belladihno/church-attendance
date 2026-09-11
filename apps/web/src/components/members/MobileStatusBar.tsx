export function MobileStatusBar({
  total,
  consistency,
  care,
}: {
  total: number;
  consistency: number | null;
  care: number;
}) {
  return (
    <div className="flex flex-col gap-2.5 pt-2">
      <div>
        <h1 className="text-[24px] font-bold text-brand-purple tracking-tight">Members Directory</h1>
        <p className="text-[13px] text-text-secondary leading-normal mt-0.5">Parish roster &amp; attendance health</p>
      </div>
      <div className="bg-white rounded-xl px-4 py-2.5 border border-border/70 shadow-card flex items-center justify-between text-[12px] font-medium text-text-secondary">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-brand-green shrink-0" />
          <span className="text-text-primary font-bold tabular-nums">{total}</span>
          <span className="text-text-secondary">members</span>
        </div>
        <span className="text-border">·</span>
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-brand-purple font-bold tabular-nums">{consistency === null ? '—' : `${consistency}%`}</span>
          <span className="text-text-secondary">consistency</span>
        </div>
        <span className="text-border">·</span>
        <div className="flex items-center gap-1 min-w-0 text-brand-red">
          <span className="font-bold tabular-nums">{care}</span>
          <span>needing care</span>
        </div>
      </div>
    </div>
  );
}
