import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createMember } from '../api/members';
import { PageHeader } from '../components/ui/PageHeader';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
  gender: z.enum(['MALE', 'FEMALE']),
  address: z.string().min(1),
  churchRole: z.string().min(1),
  department: z.string().min(1),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  dateJoined: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export function AddMemberPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { gender: 'MALE', status: 'ACTIVE', dateJoined: new Date().toISOString().slice(0,10) } });
  const mut = useMutation({
    mutationFn: (data: FormValues) => createMember(data as any),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['members'] }); navigate('/members'); },
  });

  return (
    <div className="max-w-[600px]">
      <PageHeader title="Add member" />
      <form onSubmit={handleSubmit((d) => mut.mutate(d))} className="bg-bg-card border border-border rounded-xl p-6 shadow-card flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="First name" {...register('firstName')} error={errors.firstName?.message} />
          <Input label="Last name" {...register('lastName')} error={errors.lastName?.message} />
        </div>
        <Input label="Phone" {...register('phone')} error={errors.phone?.message} />
        <div className="grid grid-cols-2 gap-4">
          <Select label="Gender" {...register('gender')}><option value="MALE">Male</option><option value="FEMALE">Female</option></Select>
          <Select label="Status" {...register('status')}><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></Select>
        </div>
        <Input label="Address" {...register('address')} error={errors.address?.message} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Church role" {...register('churchRole')} error={errors.churchRole?.message} />
          <Input label="Department" {...register('department')} error={errors.department?.message} />
        </div>
        <Input label="Date joined" type="date" {...register('dateJoined')} error={errors.dateJoined?.message} />
        {mut.isError && <div className="text-sm text-brand-red">{(mut.error as any)?.response?.data?.message || 'Failed'}</div>}
        <Button type="submit" disabled={mut.isPending}>{mut.isPending ? 'Saving...' : 'Save member'}</Button>
      </form>
    </div>
  );
}
