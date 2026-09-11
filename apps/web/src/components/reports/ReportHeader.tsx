import { Printer, TableProperties } from 'lucide-react';

export function ReportHeader({
  periodLabel,
  onExport,
  exporting,
}: {
  periodLabel: string;
  onExport: () => void;
  exporting: boolean;
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
      <div>
        <div className="flex items-center gap-2 text-text-secondary text-xs mb-1">
          <span>Analytics Engine</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span className="text-brand-purple font-semibold">Area Governance</span>
        </div>
        <h1 className="text-2xl font-semibold text-text-primary tracking-tight">Attendance Reports &amp; Analytics</h1>
        <p className="text-[13px] text-text-secondary mt-1">Executive trends, departmental consistency benchmarks, and absence diagnostics</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="h-10 px-3 rounded-lg bg-bg-card shadow-card text-text-primary font-semibold text-sm flex items-center">
          {periodLabel}
        </span>
        <button
          onClick={onExport}
          disabled={exporting}
          className="h-10 px-4 rounded-lg bg-bg-card shadow-card hover:bg-bg-base text-text-primary font-medium text-sm flex items-center gap-2 disabled:opacity-50"
        >
          <TableProperties size={17} className="text-brand-purple" />
          <span>{exporting ? 'Exporting...' : 'Export Summary (CSV)'}</span>
        </button>
        <button
          onClick={() => window.print()}
          className="h-10 px-4 rounded-lg bg-brand-purple hover:bg-[#221469] text-white font-medium text-sm shadow-card flex items-center gap-2"
        >
          <Printer size={17} />
          <span>Print / Save PDF</span>
        </button>
      </div>
    </div>
  );
}
