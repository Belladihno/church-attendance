import { RefreshCw } from 'lucide-react';

export function MobileSyncBar({
  pending,
  saving,
  onMarkRest,
  onSync,
}: {
  pending: number;
  saving: boolean;
  onMarkRest: () => void;
  onSync: () => void;
}) {
  return (
    <div className="md:hidden fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-0 w-full px-4 z-30 pointer-events-none flex justify-center">
      <div className="pointer-events-auto bg-text-primary/95 text-white backdrop-blur-lg shadow-modal rounded-full py-2 px-3.5 pl-4 flex items-center justify-between gap-3 w-full max-w-sm">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2 h-2 rounded-full shrink-0 ${pending === 0 ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
          <span className="text-[12px] font-medium tracking-tight whitespace-nowrap">
            {pending === 0 ? (
              <span className="text-emerald-300 font-medium">All updates synced</span>
            ) : (
              <><strong className="font-bold text-white">{pending}</strong> unsaved update{pending > 1 ? 's' : ''}</>
            )}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={onMarkRest} className="text-[11px] font-semibold text-slate-300 hover:text-white px-2 py-1">
            Mark Rest P
          </button>
          <button
            onClick={onSync}
            disabled={pending === 0 || saving}
            className="bg-brand-purple text-white text-[12px] font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={15} className={saving ? 'animate-spin' : ''} />
            <span>{saving ? 'Syncing' : 'Sync'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
