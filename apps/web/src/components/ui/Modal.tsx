import type { ReactNode } from 'react';

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-text-primary/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-bg-card rounded-xl shadow-modal w-full max-w-[540px] max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-bg-base text-text-secondary">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
