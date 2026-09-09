import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getMember, updateMember } from '../api/members';
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

export function EditMemberPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['member', id], queryFn: () => getMember(id!), enabled: !!id });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (data && !isLoading) {
    // populate once
    // @ts-ignore
    if (!reset) {}
  }

  const mut = useMutation({
    mutationFn: (d: FormValues) => updateMember(id!, d as any),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['members'] }); qc.invalidateQueries({ queryKey: ['member', id] }); navigate(`/members/${id}`); },
  });

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!data) return <div className="p-8 text-center">Not found</div>;

  // set default values after fetch
  // useEffect not needed for stub — rely on defaultValues from data
  return (
    <div className="max-w-[600px]">
      <PageHeader title="Edit member" />
      <form onSubmit={handleSubmit((d) => mut.mutate(d))} className="bg-bg-card border border-border rounded-xl p-6 shadow-card flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="First name" defaultValue={data.firstName} {...register('firstName')} error={errors.firstName?.message} />
          <Input label="Last name" defaultValue={data.lastName} {...register('lastName')} error={errors.lastName?.message} />
        </div>
        <Input label="Phone" defaultValue={data.phone} {...register('phone')} error={errors.phone?.message} />
        <div className="grid grid-cols-2 gap-4">
          <Select label="Gender" defaultValue={data.gender} {...register('gender')}><option value="MALE">Male</option><option value="FEMALE">Female</option></Select>
          <Select label="Status" defaultValue={data.status} {...register('status')}><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></Select>
        </div>
        <Input label="Address" defaultValue={data.address} {...register('address')} error={errors.address?.message} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Church role" defaultValue={data.churchRole} {...register('churchRole')} error={errors.churchRole?.message} />
          <Input label="Department" defaultValue={data.department} {...register('department')} error={errors.department?.message} />
        </div>
        <Input label="Date joined" type="date" defaultValue={data.dateJoined} {...register('dateJoined')} error={errors.dateJoined?.message} />
        <Button type="submit" disabled={mut.isPending}>{mut.isPending ? 'Saving...' : 'Update member'}</Button>
      </form>
    </div>
  );
}
