import type { SelectHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export function Select({ label, error, className, children, id, ...props }: Props) {
  const sid = id || `select-${label?.replace(/\s+/g, '-')}`;
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={sid} className="text-[13px] font-medium text-text-primary">{label}</label>}
      <select
        id={sid}
        className={twMerge(
          clsx(
            'h-10 px-3 pr-8 rounded-md bg-bg-card border border-border text-text-primary text-sm focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10',
            error && 'border-brand-red',
            className,
          ),
        )}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-brand-red">{error}</span>}
    </div>
  );
}
