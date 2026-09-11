import { NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LayoutDashboard, ClipboardCheck, Users, HeartHandshake, Menu } from 'lucide-react';
import { getOverview } from '../api/dashboard';

const tabs = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/attendance', label: 'Attendance', icon: ClipboardCheck },
  { to: '/members', label: 'Members', icon: Users },
  { to: '/follow-ups', label: 'Follow-ups', icon: HeartHandshake, badge: true },
];

export function MobileBottomNav({ onMore }: { onMore: () => void }) {
  // Shared cache with dashboard ('dashboard-overview') — no extra fetch
  const { data } = useQuery({ queryKey: ['dashboard-overview'], queryFn: () => getOverview() });
  const overdue = (data?.followUpRequired.twoWeeks ?? 0) + (data?.followUpRequired.threeOrMore ?? 0);

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-border/70 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1 ${isActive ? 'text-brand-purple' : 'text-text-secondary'}`
            }
          >
            {({ isActive }) => (
              <>
                <span className="relative">
                  <t.icon size={23} />
                  {t.badge && overdue > 0 && (
                    <span className="absolute -top-1 -right-2 px-1 rounded-full bg-brand-red text-white text-[9px] font-bold leading-tight">
                      {overdue}
                    </span>
                  )}
                </span>
                <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>{t.label}</span>
              </>
            )}
          </NavLink>
        ))}
        <button
          onClick={onMore}
          className="flex flex-col items-center justify-center flex-1 py-1 text-text-secondary"
          aria-label="More navigation"
        >
          <Menu size={23} />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">More</span>
        </button>
      </div>
    </nav>
  );
}
