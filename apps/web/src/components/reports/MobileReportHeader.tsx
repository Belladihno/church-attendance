import { CalendarDays, Download } from 'lucide-react';

export function MobileReportHeader({
  rangeLabel,
  onExport,
  exporting,
}: {
  rangeLabel: string;
  onExport: () => void;
  exporting: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <h1 className="text-[22px] font-bold text-text-primary tracking-tight">Reports &amp; Analytics</h1>
          <p className="text-[13px] text-text-secondary mt-0.5">Executive attendance trends &amp; departmental consistency</p>
        </div>
        <button
          onClick={onExport}
          disabled={exporting}
          className="shrink-0 h-10 px-3 bg-white text-brand-purple rounded-xl shadow-card flex items-center gap-1 active:bg-[#EAE7F8] disabled:opacity-50"
          title="Export Summary"
        >
          <Download size={19} />
          <span className="text-sm font-semibold">{exporting ? '...' : 'Export'}</span>
        </button>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 bg-bg-base rounded-xl">
        <CalendarDays size={17} className="text-brand-purple shrink-0" />
        <span className="text-[13px] font-semibold text-brand-purple truncate">{rangeLabel}</span>
      </div>
    </div>
  );
}
