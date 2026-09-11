import { Search, Bell, Plus, Calendar, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMembers } from '../api/members';
import { getOverview } from '../api/dashboard';
import { detectFollowUps } from '../api/followUps';
import { Avatar } from './ui/Avatar';

export function TopBar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const todayStr = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearch('');
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const { data: searchRes } = useQuery({
    queryKey: ['topbar-search', debounced],
    queryFn: () => getMembers({ search: debounced, limit: 5 } as any),
    enabled: debounced.length >= 2,
  });

  const { data: overview } = useQuery({ queryKey: ['dashboard-overview'], queryFn: () => getOverview() });
  const { data: followUps } = useQuery({ queryKey: ['follow-ups-detect-topbar'], queryFn: () => detectFollowUps(2) as Promise<any[]> });

  const overdue = (overview?.followUpRequired.twoWeeks ?? 0) + (overview?.followUpRequired.threeOrMore ?? 0);

  return (
    <header className="fixed top-0 left-0 md:left-[240px] right-0 h-12 bg-bg-card/95 backdrop-blur-md shadow-[0_1px_8px_rgba(15,10,46,0.04)] z-20 px-4 md:px-8 hidden md:flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <Link to="/" className="hover:text-text-primary">Grace Chapel</Link>
          <ChevronRight size={16} className="text-text-secondary/50" />
          <span className="font-semibold text-text-primary">Administration</span>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6F1FF] text-text-secondary text-xs">
          <Calendar size={14} />
          <span>{todayStr}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block" ref={searchRef}>
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/50" />
          <input
            className="w-64 h-8 pl-9 pr-3 rounded-lg bg-bg-base text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:bg-bg-card border border-transparent focus:border-border"
            placeholder="Quick search members, tags, logs..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && debounced) navigate(`/members?search=${encodeURIComponent(debounced)}`);
            }}
          />
          {debounced.length >= 2 && searchRes && (
            <div className="absolute top-10 left-0 w-80 bg-bg-card border border-border rounded-xl shadow-modal overflow-hidden z-30">
              {searchRes.data.length === 0 ? (
                <div className="p-4 text-sm text-text-secondary text-center">No members found</div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {searchRes.data.map((m: any) => (
                    <button
                      key={m.id}
                      onClick={() => { setSearch(''); navigate(`/members/${m.id}`); }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-bg-base text-left"
                    >
                      <Avatar firstName={m.firstName} lastName={m.lastName} size={32} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-text-primary truncate">{m.firstName} {m.lastName}</div>
                        <div className="text-xs text-text-secondary truncate">{m.phone} • {m.department}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => { setSearch(''); navigate(`/members?search=${encodeURIComponent(debounced)}`); }} className="w-full p-2 text-xs text-brand-purple hover:bg-bg-base text-center border-t border-border">
                View all results for "{debounced}"
              </button>
            </div>
          )}
        </div>

        <div className="relative" ref={notifRef}>
          <button onClick={() => setNotifOpen((v) => !v)} className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-[#F6F1FF]" type="button" aria-label="Notifications">
            <Bell size={22} />
            {overdue > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-red" />}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-10 w-80 bg-bg-card border border-border rounded-xl shadow-modal overflow-hidden z-30">
              <div className="p-4 border-b border-border">
                <div className="font-semibold text-sm text-text-primary">Notifications</div>
                <div className="text-xs text-text-secondary">{overdue} follow-ups needing attention</div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {!followUps || followUps.length === 0 ? (
                  <div className="p-4 text-sm text-text-secondary text-center">No notifications</div>
                ) : (
                  followUps.slice(0, 3).map((m: any) => (
                    <div key={m.id} className="p-3 hover:bg-bg-base flex items-center gap-3">
                      <Avatar firstName={m.firstName} lastName={m.lastName} size={32} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{m.firstName} {m.lastName}</div>
                        <div className="text-xs text-text-secondary">Absent 2+ Sundays</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Link to="/follow-ups" onClick={() => setNotifOpen(false)} className="block p-3 text-center text-xs text-brand-purple hover:bg-bg-base border-t border-border">View all follow-ups</Link>
            </div>
          )}
        </div>

        <Link to="/attendance" className="h-8 px-4 rounded-lg bg-brand-purple hover:bg-[#221469] text-white text-xs font-semibold shadow-sm flex items-center gap-2">
          <Plus size={16} />
          Mark Attendance
        </Link>
      </div>
    </header>
  );
}
