import { useQuery } from '@tanstack/react-query';
import { getOverview } from '../api/dashboard';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, CheckCircle, UserX, Hand, ArrowUp, TrendingUp, AlertTriangle, Clock, ArrowRight } from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({ queryKey: ['dashboard-overview'], queryFn: () => getOverview() });

  if (isLoading) return <div className="p-8 text-center text-text-secondary">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-center text-brand-red">Failed to load dashboard</div>;
  if (!data) return null;

  const firstName = user?.email?.split('@')[0]?.split('.')[0] ? user.email.split('@')[0].split('.')[0].charAt(0).toUpperCase() + user.email.split('@')[0].split('.')[0].slice(1) : 'Adaeze';

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-bg-card p-6 rounded-xl shadow-card">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold text-text-primary tracking-tight">Good morning, {firstName}</h1>
            <span className="px-2 py-0.5 rounded-md bg-[#EAE7F8] text-brand-purple text-[11px] font-medium">September 2026 — Sunday Service</span>
          </div>
          <p className="text-sm text-text-secondary">Executive operational snapshot for Grace Chapel Area • Sunday, 7 Sep 2026</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F6F1FF] text-text-secondary text-xs">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
            <span className="font-semibold text-text-primary">Session live</span>
            <span className="text-text-secondary/50">•</span>
            <span>Grace Sanctuary</span>
          </div>
          <Link to="/attendance" className="h-9 px-4 rounded-lg bg-brand-purple hover:bg-[#221469] text-white text-sm font-semibold shadow-sm flex items-center gap-2">
            <span>Mark live attendance</span>
          </Link>
        </div>
      </div>

      {/* StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bg-card p-6 rounded-xl shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">Total members</span>
            <span className="p-1.5 rounded-lg bg-[#F6F1FF] text-text-secondary"><Users size={18} /></span>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <span className="text-[28px] font-bold text-brand-purple tabular-nums">{data.totalMembers}</span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-green">
              <ArrowUp size={14} />4 this month (+1.1%)
            </div>
          </div>
        </div>

        <div className="bg-bg-card p-6 rounded-xl shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">Present today</span>
            <span className="p-1.5 rounded-lg bg-present-bg text-brand-green"><CheckCircle size={18} /></span>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-bold text-text-primary tabular-nums">{data.presentToday}</span>
              <span className="text-xs text-text-secondary">/ {data.totalMembers}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-green">
              <TrendingUp size={14} />Attendance rate {data.attendanceRate}% (↑ {data.trend.delta.toFixed(1)}%)
            </div>
          </div>
        </div>

        <div className="bg-bg-card p-6 rounded-xl shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">Absent today</span>
            <span className="p-1.5 rounded-lg bg-absent-bg text-brand-red"><UserX size={18} /></span>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <span className="text-[28px] font-bold text-text-primary tabular-nums">{data.absentToday}</span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-pending">
              <AlertTriangle size={14} />{data.followUpRequired.twoWeeks} require follow-up
            </div>
          </div>
        </div>

        <div className="bg-bg-card p-6 rounded-xl shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">First timers</span>
            <span className="p-1.5 rounded-lg bg-contacted-bg text-contacted"><Hand size={18} /></span>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-bold text-brand-purple tabular-nums">{data.firstTimersThisMonth}</span>
              <span className="text-xs text-text-secondary">this month</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-pending">
              <Clock size={14} />{data.followUpRequired.threeOrMore} pending follow-up
            </div>
          </div>
        </div>
      </div>

      {/* Trend + Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend chart 7 cols */}
        <div className="lg:col-span-7 bg-bg-card p-6 rounded-xl shadow-card flex flex-col">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="font-semibold text-text-primary">Attendance trend — last 8 Sundays</h2>
              <p className="text-xs text-text-secondary">Congregation count spanning Sunday School and Main Worship Service</p>
            </div>
            <Link to="/reports" className="h-8 px-3 rounded-lg bg-[#F6F1FF] hover:bg-[#EAE7F8] text-brand-purple text-xs font-semibold flex items-center gap-1">
              View reports <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-brand-purple" /><span className="text-xs text-text-secondary">Sunday Service (Main)</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#B4ADFF]" /><span className="text-xs text-text-secondary">Sunday School</span></div>
          </div>

          <div className="relative w-full overflow-hidden pt-4">
            <svg className="w-full h-auto overflow-visible select-none" viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg">
              <line stroke="#DDE1F0" strokeDasharray="3 3" strokeWidth="1" x1="40" x2="520" y1="30" y2="30" /><text fill="#9E99C0" fontFamily="DM Sans" fontSize="10" textAnchor="end" x="32" y="34">320</text>
              <line stroke="#DDE1F0" strokeDasharray="3 3" strokeWidth="1" x1="40" x2="520" y1="80" y2="80" /><text fill="#9E99C0" fontSize="10" textAnchor="end" x="32" y="84">300</text>
              <line stroke="#DDE1F0" strokeDasharray="3 3" strokeWidth="1" x1="40" x2="520" y1="130" y2="130" /><text fill="#9E99C0" fontSize="10" textAnchor="end" x="32" y="134">280</text>
              <line stroke="#DDE1F0" strokeWidth="1" x1="40" x2="520" y1="180" y2="180" /><text fill="#9E99C0" fontSize="10" textAnchor="end" x="32" y="184">260</text>
              <path d="M 60 167 L 125 150 L 190 142 L 255 130 L 320 145 L 385 125 L 450 110 L 515 100" fill="none" stroke="#B4ADFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <circle cx="60" cy="167" fill="#FFFFFF" r="3.5" stroke="#5C55A0" strokeWidth="2" /><circle cx="125" cy="150" fill="#FFFFFF" r="3.5" stroke="#5C55A0" strokeWidth="2" /><circle cx="190" cy="142" fill="#FFFFFF" r="3.5" stroke="#5C55A0" strokeWidth="2" /><circle cx="255" cy="130" fill="#FFFFFF" r="3.5" stroke="#5C55A0" strokeWidth="2" /><circle cx="320" cy="145" fill="#FFFFFF" r="3.5" stroke="#5C55A0" strokeWidth="2" /><circle cx="385" cy="125" fill="#FFFFFF" r="3.5" stroke="#5C55A0" strokeWidth="2" /><circle cx="450" cy="110" fill="#FFFFFF" r="3.5" stroke="#5C55A0" strokeWidth="2" /><circle cx="515" cy="100" fill="#FFFFFF" r="3.5" stroke="#5C55A0" strokeWidth="2" />
              <path d="M 60 120 L 125 105 L 190 92 L 255 75 L 320 85 L 385 60 L 450 50 L 515 40" fill="none" stroke="#2D1B8B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              <circle cx="60" cy="120" fill="#2D1B8B" r="4" /><circle cx="125" cy="105" fill="#2D1B8B" r="4" /><circle cx="190" cy="92" fill="#2D1B8B" r="4" /><circle cx="255" cy="75" fill="#2D1B8B" r="4" /><circle cx="320" cy="85" fill="#2D1B8B" r="4" /><circle cx="385" cy="60" fill="#2D1B8B" r="4" /><circle cx="450" cy="50" fill="#2D1B8B" r="4" /><circle cx="515" cy="40" fill="#2D1B8B" r="5.5" stroke="#ffffff" strokeWidth="2" /><text fill="#2D1B8B" fontFamily="DM Sans" fontSize="11" fontWeight="700" textAnchor="middle" x="515" y="24">{data.presentToday || 316}</text>
              <text fill="#5A5480" fontFamily="DM Sans" fontSize="10.5" textAnchor="middle" x="60" y="200">20 Jul</text><text fill="#5A5480" fontSize="10.5" textAnchor="middle" x="125" y="200">27 Jul</text><text fill="#5A5480" fontSize="10.5" textAnchor="middle" x="190" y="200">03 Aug</text><text fill="#5A5480" fontSize="10.5" textAnchor="middle" x="255" y="200">10 Aug</text><text fill="#5A5480" fontSize="10.5" textAnchor="middle" x="320" y="200">17 Aug</text><text fill="#5A5480" fontSize="10.5" textAnchor="middle" x="385" y="200">24 Aug</text><text fill="#5A5480" fontSize="10.5" textAnchor="middle" x="450" y="200">31 Aug</text><text fill="#2D1B8B" fontFamily="DM Sans" fontSize="10.5" fontWeight="700" textAnchor="middle" x="515" y="200">Today</text>
            </svg>
          </div>

          <div className="mt-4 pt-4 bg-[#F6F1FF] p-3 rounded-lg flex items-center justify-between text-xs">
            <span className="text-text-secondary">Average attendance over 8 weeks: <strong className="text-text-primary">303 members</strong></span>
            <span className="text-text-secondary/60 hidden sm:inline">Capacity utilization 91.2%</span>
          </div>
        </div>

        {/* Follow-ups 5 cols */}
        <div className="lg:col-span-5 bg-bg-card p-6 rounded-xl shadow-card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-text-primary">Follow-ups needing attention</h2>
              <p className="text-xs text-text-secondary">Priority pastoral follow-up queue</p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-pending-bg text-pending text-[11px] font-semibold">{data.followUpRequired.twoWeeks + data.followUpRequired.threeOrMore} overdue</span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="p-3 rounded-lg bg-[#F6F1FF] flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div><div className="text-sm font-semibold text-text-primary">Chukwuemeka Eze</div><div className="text-xs text-text-secondary">Worker (Ushering) • Brother Tunde</div></div>
                <span className="px-2 py-0.5 rounded-md bg-absent-bg text-absent text-[11px]">Absent 3 Sundays</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-text-secondary/60">Last attended: 17 Aug</span>
                <Link to="/follow-ups" className="h-7 px-3 rounded-md bg-brand-purple text-white text-xs flex items-center gap-1">Contact</Link>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#F6F1FF] flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div><div className="text-sm font-semibold">Blessing Adeyemi</div><div className="text-xs text-text-secondary">Choir Member • Sister Grace</div></div>
                <span className="px-2 py-0.5 rounded-md bg-pending-bg text-pending text-[11px]">Absent 2 Sundays</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-text-secondary/60">Last attended: 24 Aug</span>
                <Link to="/follow-ups" className="h-7 px-3 rounded-md bg-brand-purple text-white text-xs">Contact</Link>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#F6F1FF] flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div><div className="text-sm font-semibold flex items-center gap-2">Folake Ibrahim <span className="px-1.5 py-0.5 rounded bg-contacted-bg text-contacted text-[10px]">First timer</span></div><div className="text-xs text-text-secondary">Attended 24 Aug • Pending welcome call</div></div>
                <span className="px-2 py-0.5 rounded-md bg-pending-bg text-pending text-[11px]">Welcome due</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-text-secondary/60">Follow-up team Alpha</span>
                <Link to="/follow-ups" className="h-7 px-3 rounded-md bg-brand-purple text-white text-xs">Call</Link>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#F6F1FF] flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div><div className="text-sm font-semibold">David Adeleke</div><div className="text-xs text-text-secondary">Sunday School Class 4 • Elder Ojo</div></div>
                <span className="px-2 py-0.5 rounded-md bg-absent-bg text-absent text-[11px]">Absent 2 Sundays</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-text-secondary/60">Last attended: 24 Aug</span>
                <Link to="/follow-ups" className="h-7 px-3 rounded-md bg-brand-purple text-white text-xs">Contact</Link>
              </div>
            </div>
          </div>

          <Link to="/follow-ups" className="mt-4 w-full py-2 px-3 rounded-lg text-brand-purple hover:bg-[#F6F1FF] text-sm font-semibold flex items-center justify-center gap-1">
            View all {data.followUpRequired.twoWeeks + data.followUpRequired.threeOrMore + 8} follow-up cases <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="bg-bg-card p-6 rounded-xl shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-[#EAE7F8] text-brand-purple flex items-center justify-center shrink-0">✓</div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-text-primary">Today's Sunday Service session (7 Sep 2026) is open for marking</span>
              <span className="px-2 py-0.5 rounded-md bg-present-bg text-brand-green text-[11px] font-semibold">Active Session</span>
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-text-secondary">
              <span>{data.presentToday} / {data.totalMembers} recorded ({data.absentToday} remaining)</span>
              <span>•</span>
              <div className="w-32 bg-[#EAE5FF] rounded-full h-1.5 overflow-hidden"><div className="bg-brand-purple h-1.5 rounded-full" style={{ width: `${data.attendanceRate}%` }} /></div>
            </div>
          </div>
        </div>
        <Link to="/attendance" className="w-full sm:w-auto h-10 px-6 rounded-lg bg-brand-purple hover:bg-[#221469] text-white text-sm font-semibold shadow-sm flex items-center justify-center gap-2">
          Open attendance grid
        </Link>
      </div>
    </div>
  );
}
