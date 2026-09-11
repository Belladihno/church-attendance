import { Link } from 'react-router-dom';
import { ClipboardCheck, UserPlus, Phone, Download } from 'lucide-react';

const actions = [
  { to: '/attendance', label: 'Mark Roll', icon: ClipboardCheck, primary: true },
  { to: '/first-timers/new', label: 'New Visitor', icon: UserPlus, primary: false },
  { to: '/follow-ups', label: 'Call Care', icon: Phone, primary: false, alert: true },
  { to: '/reports', label: 'Export', icon: Download, primary: false },
];

export function QuickActions() {
  return (
    <section className="md:hidden">
      <div className="grid grid-cols-4 gap-3 text-center">
        {actions.map((a) => (
          <Link key={a.label} to={a.to} className="flex flex-col items-center active:scale-95 transition-transform">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm mb-2 ${
                a.primary
                  ? 'bg-brand-purple text-white shadow-brand-purple/20'
                  : a.alert
                    ? 'bg-absent-bg text-brand-red'
                    : 'bg-white border border-border text-brand-purple'
              }`}
            >
              <a.icon size={24} />
            </div>
            <span className="text-[12px] font-medium text-text-primary">{a.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
