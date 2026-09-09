import type { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'default' | 'compact';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base = 'inline-flex items-center justify-center rounded-md font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-purple text-white hover:bg-[#221469] shadow-sm',
  secondary: 'bg-transparent border border-brand-purple text-brand-purple hover:bg-brand-purple/5',
  ghost: 'bg-transparent text-text-secondary hover:bg-bg-base',
  danger: 'bg-brand-red text-white hover:bg-red-700',
};

const sizes: Record<Size, string> = {
  default: 'h-10 px-5',
  compact: 'h-8 px-4 text-xs',
};

export function Button({ variant = 'primary', size = 'default', className, ...props }: Props) {
  return <button className={twMerge(clsx(base, variants[variant], sizes[size], className))} {...props} />;
}
