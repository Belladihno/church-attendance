import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { useState } from 'react';

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-bg-base">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-text-primary/50 z-20 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col min-w-0 md:ml-[240px]">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 p-4 bg-bg-card border-b border-border">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-md bg-bg-base"
            aria-label="Open navigation"
          >
            ☰
          </button>
          <span className="font-semibold text-text-primary">RCCG Grace Chapel</span>
        </div>
        <main className="flex-1 p-4 md:p-8 max-w-[1200px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
