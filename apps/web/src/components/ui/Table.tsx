import type { ReactNode } from 'react';

export function Table({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto bg-bg-card rounded-xl border border-border shadow-card"><table className="w-full text-left border-collapse">{children}</table></div>;
}
export function TableHead({ children }: { children: ReactNode }) {
  return <thead className="bg-bg-base/50 text-text-secondary text-xs font-medium"><tr>{children}</tr></thead>;
}
export function TableHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <th className={`py-3 px-4 font-medium ${className || ''}`}>{children}</th>;
}
export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-border/40 text-sm text-text-primary">{children}</tbody>;
}
export function TableRow({ children, alt }: { children: ReactNode; alt?: boolean }) {
  return <tr className={`${alt ? 'bg-[#F9FAFB]' : 'bg-bg-card'} hover:bg-bg-base/40`}>{children}</tr>;
}
export function TableCell({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={`py-3 px-4 ${className || ''}`}>{children}</td>;
}
export function EmptyState({ message }: { message: string }) {
  return <div className="p-8 text-center text-sm text-text-secondary">{message}</div>;
}
