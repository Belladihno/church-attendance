import { Users, AlertTriangle, Phone, CheckCircle } from 'lucide-react';

function Card({
  label,
  value,
  sub,
  subColor,
  icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: number;
  sub: string;
  subColor: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-bg-card rounded-xl p-4 shadow-card flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-[13px] text-text-secondary">{label}</span>
        <span className="text-[28px] leading-9 font-bold text-text-primary tabular-nums mt-1">{value}</span>
        <span className="text-xs mt-1 flex items-center gap-1" style={{ color: subColor }}>{sub}</span>
      </div>
      <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: iconBg, color: iconColor }}>
        {icon}
      </div>
    </div>
  );
}

export function StatCards({
  active,
  pending,
  absent3Plus,
  contacted,
  resolved,
}: {
  active: number;
  pending: number;
  absent3Plus: number;
  contacted: number;
  resolved: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card
        label="Active Pastoral Queue"
        value={active}
        sub={`${pending} awaiting first contact`}
        subColor="#2D1B8B"
        icon={<Users size={24} />}
        iconBg="#EAE7F8"
        iconColor="#2D1B8B"
      />
      <Card
        label="Needs Attention Today"
        value={pending}
        sub={`${absent3Plus} members 3+ wks absent`}
        subColor="#CC0000"
        icon={<AlertTriangle size={24} />}
        iconBg="#FDEAEA"
        iconColor="#CC0000"
      />
      <Card
        label="In Outreach Contact"
        value={contacted}
        sub="Assigned, in progress"
        subColor="#0369A1"
        icon={<Phone size={24} />}
        iconBg="#E0F2FE"
        iconColor="#0369A1"
      />
      <Card
        label="Restored / Resolved"
        value={resolved}
        sub="Returned to fellowship"
        subColor="#1A7A1A"
        icon={<CheckCircle size={24} />}
        iconBg="#EBF5EB"
        iconColor="#1A7A1A"
      />
    </div>
  );
}
