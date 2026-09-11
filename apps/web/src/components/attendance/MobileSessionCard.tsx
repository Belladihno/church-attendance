import { CalendarCheck } from 'lucide-react';

export function MobileSessionCard({
  selectedSunday,
  serviceType,
  onServiceChange,
}: {
  selectedSunday: string | null;
  serviceType: string;
  onServiceChange: (v: string) => void;
}) {
  const label = selectedSunday
    ? new Date(`${selectedSunday}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';
  const serviceLabel = serviceType === 'SUNDAY_SERVICE' ? 'Sunday Worship' : 'Sunday School';

  return (
    <div className="bg-white rounded-2xl p-3.5 shadow-card border border-border/70 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-[#EAE7F8] text-brand-purple flex items-center justify-center shrink-0">
          <CalendarCheck size={20} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-text-secondary">Active Session</span>
          <span className="text-[14px] font-bold text-text-primary truncate">{serviceLabel} · {label}</span>
        </div>
      </div>
      <div className="relative shrink-0">
        <select
          value={serviceType}
          onChange={(e) => onServiceChange(e.target.value)}
          className="appearance-none bg-bg-base hover:bg-border/40 text-brand-purple font-semibold text-[12px] py-1.5 pl-3 pr-7 rounded-lg outline-none cursor-pointer focus:ring-1 focus:ring-brand-purple"
          aria-label="Switch service"
        >
          <option value="SUNDAY_SERVICE">Sunday Worship</option>
          <option value="SUNDAY_SCHOOL">Sunday School</option>
        </select>
        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-brand-purple text-[14px]">▾</span>
      </div>
    </div>
  );
}
