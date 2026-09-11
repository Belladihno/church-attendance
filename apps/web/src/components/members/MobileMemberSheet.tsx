import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Phone, MessageCircle, CheckCircle } from 'lucide-react';
import type { Member } from '../../api/members';
import { updateMember } from '../../api/members';
import { markAttendance } from '../../api/attendance';
import { Avatar } from '../ui/Avatar';
import { departmentLabel, churchRoleLabel, waLink } from './labels';

function latestSunday(): string {
  const d = new Date();
  while (d.getDay() !== 0) d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function MobileMemberSheet({
  member,
  rate,
  onClose,
}: {
  member: Member | null;
  rate: number | null;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [note, setNote] = useState('');

  useEffect(() => {
    setNote(member?.notes ?? '');
  }, [member]);

  const sunday = latestSunday();
  const preJoin = !!member && member.dateJoined > sunday;

  const markMut = useMutation({
    mutationFn: () => markAttendance({ memberId: member!.id, date: sunday, serviceType: 'SUNDAY_SERVICE', status: 'PRESENT' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['member-rate', member!.id] });
      qc.invalidateQueries({ queryKey: ['attendance-grid'] });
      qc.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
  });

  const noteMut = useMutation({
    mutationFn: () => updateMember(member!.id, { notes: note.trim() || null }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['members'] });
      onClose();
    },
  });

  if (!member) return null;

  const err =
    (markMut.error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
    (noteMut.error as { response?: { data?: { message?: string } } })?.response?.data?.message;

  return (
    <div className="md:hidden fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-[#0F0A2E]/50" />
      <div
        className="absolute bottom-0 inset-x-0 bg-white rounded-t-[24px] p-5 shadow-modal flex flex-col gap-4 max-h-[85vh] overflow-y-auto pb-[env(safe-area-inset-bottom)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-border rounded-full mx-auto self-center" />
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar firstName={member.firstName} lastName={member.lastName} size={52} />
            <div className="flex flex-col min-w-0">
              <h3 className="font-bold text-[18px] text-text-primary truncate">{member.firstName} {member.lastName}</h3>
              <span className="text-[13px] text-text-secondary truncate">
                {departmentLabel(member.department)} · {churchRoleLabel(member.churchRole)}
              </span>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close details" className="w-8 h-8 rounded-full bg-bg-base flex items-center justify-center text-text-secondary shrink-0">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <a href={`tel:${member.phone}`} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-bg-base text-brand-purple font-semibold text-[13px]">
            <Phone size={17} />
            <span>Call member</span>
          </a>
          <a href={waLink(member.phone)} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-present-bg text-present font-semibold text-[13px]">
            <MessageCircle size={17} />
            <span>WhatsApp</span>
          </a>
        </div>

        <div className="bg-bg-base rounded-xl p-3.5 flex flex-col gap-2.5 text-[13px]">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Phone number</span>
            <span className="text-text-primary font-medium tabular-nums">{member.phone}</span>
          </div>
          <div className="flex items-center justify-between border-t border-border/50 pt-2">
            <span className="text-text-secondary">Parish status</span>
            <span className="text-brand-purple font-semibold">{member.status === 'ACTIVE' ? 'Active' : 'Inactive'}</span>
          </div>
          <div className="flex items-center justify-between border-t border-border/50 pt-2">
            <span className="text-text-secondary">Address</span>
            <span className="text-text-primary font-medium truncate max-w-[60%]" title={member.address}>{member.address || '—'}</span>
          </div>
          <div className="flex items-center justify-between border-t border-border/50 pt-2">
            <span className="text-text-secondary">Recent consistency</span>
            <span className="text-text-primary font-medium tabular-nums">{rate === null ? 'No records' : `${Math.round(rate)}%`}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider" htmlFor="member-note">
            Pastoral note
          </label>
          <textarea
            id="member-note"
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add follow-up context or visitation note..."
            className="w-full p-3 bg-bg-base border border-border/80 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple placeholder:text-text-secondary/50 resize-none"
          />
        </div>

        {err && <div className="text-[13px] text-brand-red">{err}</div>}
        {markMut.isSuccess && <div className="text-[13px] text-present font-medium">Marked present for {sunday}.</div>}

        <div className="flex flex-col gap-2">
          <button
            onClick={() => noteMut.mutate()}
            disabled={noteMut.isPending}
            className="w-full h-11 rounded-xl bg-white border border-border text-text-primary font-medium text-[14px] disabled:opacity-50"
          >
            {noteMut.isPending ? 'Saving...' : 'Save pastoral note'}
          </button>
          <button
            onClick={() => markMut.mutate()}
            disabled={markMut.isPending || preJoin || member.status !== 'ACTIVE'}
            title={preJoin ? `Joined after ${sunday}` : undefined}
            className="w-full h-11 rounded-xl bg-brand-purple text-white font-semibold text-[14px] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CheckCircle size={18} />
            <span>{markMut.isPending ? 'Marking...' : 'Mark present for live service'}</span>
          </button>
          <Link
            to={`/members/${member.id}`}
            className="w-full h-11 rounded-xl bg-bg-base text-brand-purple font-semibold text-[14px] flex items-center justify-center"
          >
            Open full profile
          </Link>
        </div>
      </div>
    </div>
  );
}
