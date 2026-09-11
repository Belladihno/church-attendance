import { Link, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { useAuth } from '../context/AuthContext';
import { getOverview } from '../api/dashboard';
import redeemLogo from '@/assets/redeem-logo.png';
import { useState } from 'react';

function MobileBrandHeader() {
  const { user } = useAuth();
  const { data } = useQuery({ queryKey: ['dashboard-overview'], queryFn: () => getOverview() });
  const overdue = (data?.followUpRequired.twoWeeks ?? 0) + (data?.followUpRequired.threeOrMore ?? 0);
  const initials = user?.email
    ? user.email.split('@')[0].split('.').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
    : 'GC';

  return (
    <header
      className="md:hidden fixed top-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-b border-border/60 pt-[env(safe-area-inset-top)]"
    >
      <div className="h-16 px-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={redeemLogo} alt="RCCG Logo" className="h-9 w-9 object-contain" />
          <div>
            <h1 className="text-[16px] font-bold tracking-tight text-text-primary leading-tight">Grace Chapel Area</h1>
            <p className="text-[11px] font-medium text-text-secondary">Redeemed Christian Church of God</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/follow-ups"
            aria-label="Notifications"
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:text-brand-purple"
          >
            <Bell size={22} />
            {overdue > 0 && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-red" />}
          </Link>
          <div className="w-9 h-9 rounded-full bg-[#EAE7F8] text-brand-purple flex items-center justify-center text-xs font-bold ring-2 ring-brand-purple/20">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-bg-base">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-text-primary/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col min-w-0 md:ml-[240px] pt-16 md:pt-12">
        <TopBar />
        <MobileBrandHeader />
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-[1200px] mx-auto w-full">
          <Outlet />
        </main>
        <MobileBottomNav onMore={() => setMobileOpen(true)} />
      </div>
    </div>
  );
}
