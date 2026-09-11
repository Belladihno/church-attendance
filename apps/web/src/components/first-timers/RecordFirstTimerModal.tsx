import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus, X } from 'lucide-react';
import { createFirstTimer } from '../../api/firstTimers';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  phone: z.string().min(1, 'Required'),
  gender: z.enum(['MALE', 'FEMALE']),
  address: z.string().optional(),
  dateAttended: z.string().min(1, 'Required'),
  serviceAttended: z.enum(['SUNDAY_SERVICE', 'SUNDAY_SCHOOL']),
  invitedBy: z.string().optional(),
  howHeard: z.string().optional(),
  followUpNotes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function RecordFirstTimerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: 'MALE',
      serviceAttended: 'SUNDAY_SERVICE',
      dateAttended: new Date().toISOString().slice(0, 10),
    },
  });

  const mut = useMutation({
    mutationFn: (data: FormValues) => createFirstTimer(data as unknown as Record<string, unknown>),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['first-timers'] });
      reset();
      onClose();
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0F0A2E]/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-bg-card rounded-2xl shadow-modal w-full max-w-[580px] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 bg-bg-base/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center">
              <UserPlus size={22} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary">Record New First Timer</h3>
              <span className="text-[13px] text-text-secondary">Intake into the 30-day assimilation system</span>
            </div>
          </div>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit((d) => mut.mutate(d))} className="p-6 overflow-y-auto flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name *" placeholder="e.g. Oluwaseun" {...register('firstName')} error={errors.firstName?.message} />
            <Input label="Last Name *" placeholder="e.g. Adeyemi" {...register('lastName')} error={errors.lastName?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone Number *" placeholder="0800 000 0000" {...register('phone')} error={errors.phone?.message} />
            <Select label="Gender" {...register('gender')}>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Service Attended" {...register('serviceAttended')}>
              <option value="SUNDAY_SERVICE">Sunday Main Service</option>
              <option value="SUNDAY_SCHOOL">Sunday School</option>
            </Select>
            <Input label="Date Attended" type="date" {...register('dateAttended')} error={errors.dateAttended?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Invited By" placeholder="Member name or 'Walk-in'" {...register('invitedBy')} />
            <Input label="How Heard" placeholder="e.g. Friend, Social media" {...register('howHeard')} />
          </div>
          <Input label="Residential Area / Landmark" placeholder="e.g. Lekki Phase 1 / Admiralty Way" {...register('address')} />
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-text-primary">Prayer Request &amp; Pastoral Remarks</label>
            <textarea
              rows={3}
              placeholder="Note down any specific prayer points or impressions..."
              className="p-3 rounded-md bg-bg-base border border-border text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 resize-none"
              {...register('followUpNotes')}
            />
          </div>
          {mut.isError && (
            <div className="text-sm text-brand-red">
              {(mut.error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save first timer'}
            </div>
          )}
          <div className="pt-2 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mut.isPending}>{mut.isPending ? 'Saving...' : 'Save First Timer'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
