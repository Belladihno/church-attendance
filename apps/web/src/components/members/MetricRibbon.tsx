import { Users, UserCheck, BadgeCheck, UserPlus } from 'lucide-react';
import type { MemberStats } from '../../api/members';

function Card({
  label,
  value,
  sub,
  icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: number;
  sub: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-bg-card rounded-xl p-6 shadow-card flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-text-secondary">{label}</span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2 mt-3">
        <span className="text-[28px] leading-8 font-bold text-text-primary tabular-nums">{value}</span>
      </div>
      <span className="text-xs text-text-secondary/60 mt-1">{sub}</span>
    </div>
  );
}

export function MetricRibbon({ stats }: { stats?: MemberStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        label="Total Members"
        value={stats?.total ?? 0}
        sub="Registered on parish roll"
        icon={<Users size={18} />}
        iconBg="#EAE7F8"
        iconColor="#2D1B8B"
      />
      <Card
        label="Active Members"
        value={stats?.active ?? 0}
        sub="Currently in good standing"
        icon={<UserCheck size={18} />}
        iconBg="#EBF5EB"
        iconColor="#1A7A1A"
      />
      <Card
        label="Active Workers"
        value={stats?.workers ?? 0}
        sub="Serving across ministry units"
        icon={<BadgeCheck size={18} />}
        iconBg="#E0F2FE"
        iconColor="#0369A1"
      />
      <Card
        label="New This Month"
        value={stats?.newThisMonth ?? 0}
        sub="Joined since the 1st"
        icon={<UserPlus size={18} />}
        iconBg="#EAE7F8"
        iconColor="#2D1B8B"
      />
    </div>
  );
}
