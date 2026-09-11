import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { updateMember } from '../../api/members';
import type { RosterMember, RosterMeta } from './MobileRoster';

const QUICK_TAGS = ['Official Assignment', 'Health / Bedrest', 'Travel', 'Exams'];

export function MobileNoteSheet({
  member,
  meta,
  deptRole,
  onClose,
}: {
  member: RosterMember | null;
  meta?: RosterMeta;
  deptRole?: string;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [text, setText] = useState('');

  useEffect(() => {
    setText(meta?.notes ?? '');
  }, [member, meta?.notes]);

  const mut = useMutation({
    mutationFn: () => updateMember(member!.id, { notes: text.trim() || null }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['members'] });
      onClose();
    },
  });

  if (!member) return null;

  const err = (mut.error as { response?: { data?: { message?: string } } })?.response?.data?.message;

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-black/40 flex flex-col justify-end" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl p-5 w-full flex flex-col gap-3.5 shadow-modal pb-[env(safe-area-inset-bottom)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-border rounded-full mx-auto -mt-1 mb-1" />
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <h3 className="font-bold text-[16px] text-text-primary tracking-tight">{member.name}</h3>
            {deptRole && <span className="text-[12px] text-text-secondary">{deptRole}</span>}
          </div>
          <button onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-full bg-bg-base flex items-center justify-center text-text-secondary">
            <X size={18} />
          </button>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider">Quick tag</label>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_TAGS.map((t) => (
              <button
                key={t}
                onClick={() => setText((prev) => (prev ? `${prev} ` : '') + `${t}: `)}
                className="px-2.5 py-1 rounded-lg bg-bg-base text-text-primary text-[11px] font-medium hover:bg-[#EAE7F8] hover:text-brand-purple"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider" htmlFor="pastoral-remark">
            Pastoral remark
          </label>
          <textarea
            id="pastoral-remark"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add follow-up context or visitation note..."
            className="w-full p-3 bg-bg-base border border-border/80 rounded-xl text-[13px] text-text-primary outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple placeholder:text-text-secondary/50 resize-none"
          />
        </div>
        {err && <div className="text-[13px] text-brand-red">{err}</div>}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button onClick={onClose} className="py-2.5 rounded-xl border border-border text-text-secondary text-[13px] font-semibold">
            Cancel
          </button>
          <button
            onClick={() => mut.mutate()}
            disabled={mut.isPending}
            className="py-2.5 rounded-xl bg-brand-purple text-white text-[13px] font-bold disabled:opacity-50"
          >
            {mut.isPending ? 'Saving...' : 'Save Remark'}
          </button>
        </div>
      </div>
    </div>
  );
}
