import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus, CheckCircle2, X } from 'lucide-react';
import { createMember } from '../../api/members';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { DEPARTMENT_LABELS, CHURCH_ROLE_LABELS } from './labels';

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  phone: z.string().min(1, 'Required'),
  gender: z.enum(['MALE', 'FEMALE']),
  address: z.string().min(1, 'Required'),
  churchRole: z.enum(['MEMBER','WORKER','MEN_LEADER','WOMEN_LEADER','YOUTH_LEADER','DEACON','DEACONESS','ASSISTANT_PASTOR','PASTOR']),
  department: z.enum(['NONE','CHOIR','USHERING','CHILDREN_MINISTRY','YOUTH_MINISTRY','PRAYER_TEAM','TECHNICAL','WELFARE','PROTOCOL','WORKERS_IN_TRAINING']).optional(),
  sundaySchoolClass: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  dateJoined: z.string().min(1, 'Required'),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function AddMemberModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: 'MALE',
      status: 'ACTIVE',
      churchRole: 'MEMBER',
      dateJoined: new Date().toISOString().slice(0, 10),
    },
  });

  const mut = useMutation({
    mutationFn: (data: FormValues) => createMember(data as never),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['members'] });
      qc.invalidateQueries({ queryKey: ['members-stats'] });
      reset();
      onClose();
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0F0A2E]/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-bg-card w-full max-w-[580px] rounded-xl shadow-modal flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-bg-base/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-purple text-white flex items-center justify-center">
              <UserPlus size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text-primary">Add New Member</h2>
              <p className="text-xs text-text-secondary">Register congregant or pastoral worker into parish roster</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-border/50">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit((d) => mut.mutate(d))} className="p-6 overflow-y-auto flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="First Name *" placeholder="e.g. Chukwuemeka" {...register('firstName')} error={errors.firstName?.message} />
            <Input label="Last Name *" placeholder="e.g. Eze" {...register('lastName')} error={errors.lastName?.message} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Phone Number *" placeholder="0803 000 0000" {...register('phone')} error={errors.phone?.message} />
            <Select label="Gender" {...register('gender')}>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </Select>
          </div>
          <Input label="Residential Address / District" placeholder="House address and parish fellowship district" {...register('address')} error={errors.address?.message} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Department / Ministry Unit" {...register('department')}>
              <option value="NONE">Congregation (General)</option>
              {Object.entries(DEPARTMENT_LABELS).filter(([v]) => v !== 'NONE').map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </Select>
            <Select label="Church Role" {...register('churchRole')} error={errors.churchRole?.message}>
              {Object.entries(CHURCH_ROLE_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Sunday School Class" placeholder="e.g. Believers Class 2" {...register('sundaySchoolClass')} />
            <Input label="Date Joined Grace Chapel" type="date" {...register('dateJoined')} error={errors.dateJoined?.message} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-text-primary">Pastoral Follow-up Notes</label>
            <textarea
              rows={2}
              placeholder="Baptismal state, previous parish, marital status, or care team assignments..."
              className="p-3 rounded-md bg-bg-base border border-border text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 resize-none"
              {...register('notes')}
            />
          </div>
          {mut.isError && (
            <div className="text-sm text-brand-red">
              {(mut.error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save member'}
            </div>
          )}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mut.isPending} className="gap-2">
              <CheckCircle2 size={16} />
              {mut.isPending ? 'Saving...' : 'Save Member Record'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
