import type { InputHTMLAttributes } from 'react';

export function Checkbox(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className="w-[18px] h-[18px] rounded border border-border text-brand-purple focus:ring-brand-purple accent-brand-purple"
      {...props}
    />
  );
}
