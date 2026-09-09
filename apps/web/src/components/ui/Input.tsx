import type { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: Props) {
  const inputId = id || `input-${label?.replace(/\s+/g, '-')}`;
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={inputId} className="text-[13px] font-medium text-text-primary">{label}</label>}
      <input
        id={inputId}
        className={twMerge(
          clsx(
            'h-10 px-3 rounded-md bg-bg-card border border-border text-text-primary text-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 transition-colors',
            error && 'border-brand-red focus:border-brand-red focus:ring-brand-red/10',
            className,
          ),
        )}
        {...props}
      />
      {error && <span className="text-xs text-brand-red">{error}</span>}
    </div>
  );
}
