import { Link } from 'react-router-dom';

export function GreetingBanner({ firstName }: { firstName: string }) {
  const todayStr = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
  const monthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <>
      {/* Mobile welcome section */}
      <section className="md:hidden pt-2">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5 text-text-secondary text-[13px]">
            <span>{todayStr}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-present-bg text-present text-[12px] font-medium">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
            <span>Live Service</span>
          </div>
        </div>
        <h2 className="text-[26px] font-bold tracking-tight text-text-primary leading-snug">
          Good morning, {firstName}
        </h2>
        <p className="text-[14px] text-text-secondary mt-0.5">Parish Admin • Pastoral Oversight</p>
      </section>

      {/* Desktop banner card */}
      <div className="hidden md:flex flex-col md:flex-row md:items-center justify-between gap-4 bg-bg-card p-6 rounded-xl shadow-card">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold text-text-primary tracking-tight">Good morning, {firstName}</h1>
            <span className="px-2 py-0.5 rounded-md bg-[#EAE7F8] text-brand-purple text-[11px] font-medium">{monthYear} — Sunday Service</span>
          </div>
          <p className="text-sm text-text-secondary">Executive operational snapshot for Grace Chapel Area • {todayStr}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F6F1FF] text-text-secondary text-xs">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
            <span className="font-semibold text-text-primary">Session live</span>
            <span className="text-text-secondary/50">•</span>
            <span>Grace Sanctuary</span>
          </div>
          <Link to="/attendance" className="h-9 px-4 rounded-lg bg-brand-purple hover:bg-[#221469] text-white text-sm font-semibold shadow-sm flex items-center gap-2">
            Mark live attendance
          </Link>
        </div>
      </div>
    </>
  );
}
