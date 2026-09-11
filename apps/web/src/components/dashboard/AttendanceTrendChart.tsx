import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { DashboardOverview } from '../../api/dashboard';

export function AttendanceTrendChart({ data }: { data: DashboardOverview }) {
  return (
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

      <div className="relative w-full overflow-x-auto pt-4">
        <svg className="h-auto overflow-visible select-none min-w-[520px] w-full" viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg">
          <line stroke="#DDE1F0" strokeDasharray="3 3" strokeWidth="1" x1="40" x2="520" y1="30" y2="30" /><text fill="#9E99C0" fontFamily="DM Sans" fontSize="10" textAnchor="end" x="32" y="34">320</text>
          <line stroke="#DDE1F0" strokeDasharray="3 3" strokeWidth="1" x1="40" x2="520" y1="80" y2="80" /><text fill="#9E99C0" fontSize="10" textAnchor="end" x="32" y="84">300</text>
          <line stroke="#DDE1F0" strokeDasharray="3 3" strokeWidth="1" x1="40" x2="520" y1="130" y2="130" /><text fill="#9E99C0" fontSize="10" textAnchor="end" x="32" y="134">280</text>
          <line stroke="#DDE1F0" strokeWidth="1" x1="40" x2="520" y1="180" y2="180" /><text fill="#9E99C0" fontSize="10" textAnchor="end" x="32" y="184">260</text>
          <path d="M 60 167 L 125 150 L 190 142 L 255 130 L 320 145 L 385 125 L 450 110 L 515 100" fill="none" stroke="#B4ADFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <circle cx="60" cy="167" fill="#FFFFFF" r="3.5" stroke="#5C55A0" strokeWidth="2" /><circle cx="125" cy="150" fill="#FFFFFF" r="3.5" stroke="#5C55A0" strokeWidth="2" /><circle cx="190" cy="142" fill="#FFFFFF" r="3.5" stroke="#5C55A0" strokeWidth="2" /><circle cx="255" cy="130" fill="#FFFFFF" r="3.5" stroke="#5C55A0" strokeWidth="2" /><circle cx="320" cy="145" fill="#FFFFFF" r="3.5" stroke="#5C55A0" strokeWidth="2" /><circle cx="385" cy="125" fill="#FFFFFF" r="3.5" stroke="#5C55A0" strokeWidth="2" /><circle cx="450" cy="110" fill="#FFFFFF" r="3.5" stroke="#5C55A0" strokeWidth="2" /><circle cx="515" cy="100" fill="#FFFFFF" r="3.5" stroke="#5C55A0" strokeWidth="2" />
          <path d="M 60 120 L 125 105 L 190 92 L 255 75 L 320 85 L 385 60 L 450 50 L 515 40" fill="none" stroke="#2D1B8B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          <circle cx="60" cy="120" fill="#2D1B8B" r="4" /><circle cx="125" cy="105" fill="#2D1B8B" r="4" /><circle cx="190" cy="92" fill="#2D1B8B" r="4" /><circle cx="255" cy="75" fill="#2D1B8B" r="4" /><circle cx="320" cy="85" fill="#2D1B8B" r="4" /><circle cx="385" cy="60" fill="#2D1B8B" r="4" /><circle cx="450" cy="50" fill="#2D1B8B" r="4" /><circle cx="515" cy="40" fill="#2D1B8B" r="5.5" stroke="#ffffff" strokeWidth="2" /><text fill="#2D1B8B" fontFamily="DM Sans" fontSize="11" fontWeight="700" textAnchor="middle" x="515" y="24">{data.presentToday}</text>
          <text fill="#5A5480" fontFamily="DM Sans" fontSize="10.5" textAnchor="middle" x="60" y="200">20 Jul</text><text fill="#5A5480" fontSize="10.5" textAnchor="middle" x="125" y="200">27 Jul</text><text fill="#5A5480" fontSize="10.5" textAnchor="middle" x="190" y="200">03 Aug</text><text fill="#5A5480" fontSize="10.5" textAnchor="middle" x="255" y="200">10 Aug</text><text fill="#5A5480" fontSize="10.5" textAnchor="middle" x="320" y="200">17 Aug</text><text fill="#5A5480" fontSize="10.5" textAnchor="middle" x="385" y="200">24 Aug</text><text fill="#5A5480" fontSize="10.5" textAnchor="middle" x="450" y="200">31 Aug</text><text fill="#2D1B8B" fontFamily="DM Sans" fontSize="10.5" fontWeight="700" textAnchor="middle" x="515" y="200">Today</text>
        </svg>
      </div>

      <div className="mt-4 pt-4 bg-[#F6F1FF] p-3 rounded-lg flex items-center justify-between text-xs">
        <span className="text-text-secondary">Average attendance over 8 weeks: <strong className="text-text-primary">{Math.round((data.trend.previous + data.trend.current) / 2)} members</strong></span>
        <span className="text-text-secondary/60 hidden sm:inline">Capacity utilization {data.totalMembers ? Math.round((data.presentToday / data.totalMembers) * 100) : 0}%</span>
      </div>
    </div>
  );
}
