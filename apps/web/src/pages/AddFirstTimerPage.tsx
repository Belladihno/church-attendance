import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createFirstTimer } from '../api/firstTimers';
import { PageHeader } from '../components/ui/PageHeader';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';

const schema = z.object({ firstName: z.string().min(1), lastName: z.string().min(1), phone: z.string().min(1), gender: z.enum(['MALE','FEMALE']), dateAttended: z.string().min(1), serviceAttended: z.enum(['SUNDAY_SERVICE','SUNDAY_SCHOOL']) });
type FormValues = z.infer<typeof schema>;

export function AddFirstTimerPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const mut = useMutation({ mutationFn: (d: FormValues) => createFirstTimer(d as any), onSuccess: () => { qc.invalidateQueries({ queryKey: ['first-timers'] }); navigate('/first-timers'); } });
  return (
    <div className="max-w-[600px]">
      <PageHeader title="Add first timer" />
      <form onSubmit={handleSubmit((d) => mut.mutate(d))} className="bg-bg-card border border-border rounded-xl p-6 shadow-card flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4"><Input label="First name" {...register('firstName')} error={errors.firstName?.message} /><Input label="Last name" {...register('lastName')} error={errors.lastName?.message} /></div>
        <Input label="Phone" {...register('phone')} error={errors.phone?.message} />
        <div className="grid grid-cols-2 gap-4"><Select label="Gender" {...register('gender')}><option value="MALE">Male</option><option value="FEMALE">Female</option></Select><Select label="Service" {...register('serviceAttended')}><option value="SUNDAY_SERVICE">Sunday Service</option><option value="SUNDAY_SCHOOL">Sunday School</option></Select></div>
        <Input label="Date attended" type="date" {...register('dateAttended')} error={errors.dateAttended?.message} />
        <Button type="submit" disabled={mut.isPending}>{mut.isPending ? 'Saving...' : 'Save first timer'}</Button>
      </form>
    </div>
  );
}
