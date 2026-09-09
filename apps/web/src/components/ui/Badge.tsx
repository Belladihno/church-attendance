import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

type Variant = 'present' | 'absent' | 'excused' | 'pending' | 'contacted' | 'active';

const map: Record<Variant, string> = {
  present: 'bg-present-bg text-present',
  absent: 'bg-absent-bg text-absent',
  excused: 'bg-excused-bg text-excused',
  pending: 'bg-pending-bg text-pending',
  contacted: 'bg-contacted-bg text-contacted',
  active: 'bg-[#EAE7F8] text-brand-purple',
};

export function Badge({ variant, className, children }: { variant: Variant; className?: string; children: React.ReactNode }) {
  return (
    <span className={twMerge(clsx('inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] font-medium', map[variant], className))}>
      {children}
    </span>
  );
}
