import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, ClipboardCheck, UserPlus, HeartHandshake, BarChart3, LogOut } from 'lucide-react';
import redeemLogo from '@/assets/redeem-logo.png';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/members', label: 'Members', icon: Users },
  { to: '/attendance', label: 'Attendance', icon: ClipboardCheck },
  { to: '/first-timers', label: 'First timers', icon: UserPlus },
  { to: '/follow-ups', label: 'Follow-ups', icon: HeartHandshake },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
];

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const { user, logout } = useAuth();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-[240px] bg-bg-sidebar text-text-inverse flex flex-col
      transform transition-transform md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img src={redeemLogo} alt="RCCG Logo" className="w-10 h-10 rounded-full object-contain bg-white p-1" />
          <div>
            <div className="text-sm font-semibold">RCCG Grace Chapel</div>
            <div className="text-xs opacity-70">Area</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive ? 'bg-bg-sidebar-active text-text-inverse' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="text-xs opacity-70 truncate">{user?.email}</div>
        <div className="text-xs opacity-50 capitalize">{user?.role}</div>
        <button
          onClick={logout}
          className="mt-3 flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </aside>
  );
}
