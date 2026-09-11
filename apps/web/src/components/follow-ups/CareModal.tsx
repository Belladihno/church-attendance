import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { NotebookPen, X } from 'lucide-react';
import { createFollowUp, updateFollowUp, type FollowUp } from '../../api/followUps';
import type { Member } from '../../api/members';
import type { FirstTimer } from '../../api/firstTimers';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { subjectOf } from './labels';

export type CareModalMode = 'create' | 'note' | 'reassign';

const REASON_SUGGESTIONS = [
  'Absent 2 consecutive Sundays',
  'Absent 3+ consecutive Sundays',
  'First timer outreach',
  'Welfare check',
];

type Props = {
  open: boolean;
  mode: CareModalMode;
  followUp: FollowUp | null;
  members: Member[];
  firstTimers: FirstTimer[];
  onClose: () => void;
  onSaved: () => void;
};

export function CareModal({ open, mode, followUp, members, firstTimers, onClose, onSaved }: Props) {
  const [kind, setKind] = useState<'member' | 'firstTimer'>('member');
  const [subjectId, setSubjectId] = useState('');
  const [reason, setReason] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [contactDate, setContactDate] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const reset = () => {
    setSubjectId('');
    setReason('');
    setAssignedTo('');
    setContactDate('');
    setNotes('');
    setFormError(null);
  };

  const close = () => {
    reset();
    onClose();
  };

  const createMut = useMutation({
    mutationFn: () =>
      createFollowUp({
        ...(kind === 'member' ? { memberId: subjectId } : { firstTimerId: subjectId }),
        reason: reason.trim(),
        ...(assignedTo.trim() ? { assignedTo: assignedTo.trim() } : {}),
        ...(contactDate ? { contactDate } : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      }),
    onSuccess: () => {
      close();
      onSaved();
    },
    onError: (e: unknown) => {
      setFormError((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create follow-up');
    },
  });

  const updateMut = useMutation({
    mutationFn: () => {
      if (!followUp) throw new Error('No follow-up selected');
      if (mode === 'reassign') return updateFollowUp(followUp.id, { assignedTo: assignedTo.trim() || null });
      const stamped = `[${new Date().toISOString().slice(0, 10)}] ${notes.trim()}`;
      const merged = followUp.notes ? `${followUp.notes}\n${stamped}` : stamped;
      return updateFollowUp(followUp.id, { notes: merged });
    },
    onSuccess: () => {
      close();
      onSaved();
    },
    onError: (e: unknown) => {
      setFormError((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save');
    },
  });

  if (!open) return null;

  const title =
    mode === 'create'
      ? 'New Follow-up Care Ticket'
      : mode === 'note'
        ? `Care Note: ${followUp ? subjectOf(followUp).name : ''}`
        : `Reassign Ticket: ${followUp ? subjectOf(followUp).name : ''}`;

  const canSubmit =
    mode === 'create'
      ? !!subjectId && !!reason.trim() && !createMut.isPending
      : mode === 'reassign'
        ? !!assignedTo.trim() && !updateMut.isPending
        : !!notes.trim() && !updateMut.isPending;

  return (
    <div className="fixed inset-0 z-50 bg-[#0F0A2E]/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={close}>
      <div
        className="bg-bg-card rounded-xl w-full max-w-[560px] shadow-modal p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EAE7F8] flex items-center justify-center text-brand-purple">
              <NotebookPen size={20} />
            </div>
            <h2 className="text-base font-semibold text-text-primary">{title}</h2>
          </div>
          <button onClick={close} className="text-text-secondary/60 hover:text-text-primary p-1">
            <X size={22} />
          </button>
        </div>

        {mode === 'create' && (
          <>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setKind('member'); setSubjectId(''); }}
                className={`h-9 px-4 rounded-lg text-sm ${kind === 'member' ? 'bg-brand-purple text-white font-semibold' : 'bg-bg-base text-text-secondary'}`}
              >
                Member
              </button>
              <button
                onClick={() => { setKind('firstTimer'); setSubjectId(''); }}
                className={`h-9 px-4 rounded-lg text-sm ${kind === 'firstTimer' ? 'bg-brand-purple text-white font-semibold' : 'bg-bg-base text-text-secondary'}`}
              >
                First timer
              </button>
            </div>
            <Select label={kind === 'member' ? 'Member *' : 'First timer *'} value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              <option value="">Select...</option>
              {kind === 'member'
                ? members.map((m) => (
                    <option key={m.id} value={m.id}>{m.firstName} {m.lastName} — {m.phone}</option>
                  ))
                : firstTimers.map((t) => (
                    <option key={t.id} value={t.id}>{t.firstName} {t.lastName} — {t.phone}</option>
                  ))}
            </Select>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-text-primary">Reason *</label>
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                list="reason-suggestions"
                placeholder="e.g. Absent 2 consecutive Sundays"
                className="h-10 px-3 rounded-md bg-bg-card border border-border text-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10"
              />
              <datalist id="reason-suggestions">
                {REASON_SUGGESTIONS.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Assigned Caregiver" placeholder="e.g. Brother Tunde" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} />
              <Input label="Contact By (date)" type="date" value={contactDate} onChange={(e) => setContactDate(e.target.value)} />
            </div>
          </>
        )}

        {mode === 'reassign' && (
          <Input label="Assigned Caregiver *" placeholder="e.g. Sister Mary" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} />
        )}

        {mode !== 'reassign' && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-text-primary">
              {mode === 'create' ? 'Detailed Pastoral Care Notes' : 'Care Note *'}
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter conversation details, prayer requests, or scheduled follow-up dates..."
              className="p-3 rounded-md bg-bg-base border border-border text-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 resize-none"
            />
          </div>
        )}

        {mode !== 'create' && (
          <div className="p-3 rounded-lg bg-pending-bg/50 text-xs text-pending">
            Notes are confidential and accessible strictly to ordained ministers and department leaders.
          </div>
        )}

        {formError && <div className="text-sm text-brand-red">{formError}</div>}

        <div className="flex items-center justify-end gap-3 pt-1">
          <Button variant="ghost" onClick={close}>Cancel</Button>
          <Button
            disabled={!canSubmit}
            onClick={() => (mode === 'create' ? createMut.mutate() : updateMut.mutate())}
          >
            {(createMut.isPending || updateMut.isPending) ? 'Saving...' : 'Save Record'}
          </Button>
        </div>
      </div>
    </div>
  );
}
