import { UserPlus, Phone, Users, BadgeCheck } from 'lucide-react';

export type FirstTimerKpis = {
  thisMonth: number;
  lastMonth: number;
  pending: number;
  contacted: number;
  converted: number;
};

function Card({
  label,
  value,
  sub,
  barPct,
  barColor,
  icon,
  iconColor,
  valueColor,
}: {
  label: string;
  value: number | string;
  sub: string;
  barPct: number;
  barColor: string;
  icon: React.ReactNode;
  iconColor: string;
  valueColor?: string;
}) {
  return (
    <div className="bg-bg-card rounded-xl p-6 shadow-card flex flex-col justify-between gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-text-secondary">{label}</span>
        <span style={{ color: iconColor }}>{icon}</span>
      </div>
      <div className="flex items-baseline gap-3">
        <span
          className="text-[28px] leading-8 font-bold tabular-nums"
          style={{ color: valueColor ?? '#0F0A2E' }}
        >
          {value}
        </span>
        <span className="text-xs text-text-secondary">{sub}</span>
      </div>
      <div className="w-full bg-bg-base h-1.5 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, barPct))}%`, background: barColor }} />
      </div>
    </div>
  );
}

export function KpiCards({ kpis, total }: { kpis: FirstTimerKpis; total: number }) {
  const delta = kpis.thisMonth - kpis.lastMonth;
  const deltaTxt = `${delta >= 0 ? '+' : ''}${delta} vs last mo`;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        label="Visitors this month"
        value={kpis.thisMonth}
        sub={deltaTxt}
        barPct={total > 0 ? (kpis.thisMonth / total) * 100 : 0}
        barColor="#2D1B8B"
        icon={<UserPlus size={20} />}
        iconColor="#2D1B8B"
        valueColor="#2D1B8B"
      />
      <Card
        label="Pending first call"
        value={kpis.pending}
        sub="Awaiting welcome call"
        barPct={total > 0 ? (kpis.pending / total) * 100 : 0}
        barColor="#B45309"
        icon={<Phone size={20} />}
        iconColor="#1A7A1A"
      />
      <Card
        label="In active follow-up"
        value={kpis.contacted}
        sub="Contacted, not yet converted"
        barPct={total > 0 ? (kpis.contacted / total) * 100 : 0}
        barColor="#0369A1"
        icon={<Users size={20} />}
        iconColor="#0369A1"
      />
      <Card
        label="Converted to members"
        value={kpis.converted}
        sub="Joined the parish roll"
        barPct={total > 0 ? (kpis.converted / total) * 100 : 0}
        barColor="#2D1B8B"
        icon={<BadgeCheck size={20} />}
        iconColor="#2D1B8B"
        valueColor="#2D1B8B"
      />
    </div>
  );
}
