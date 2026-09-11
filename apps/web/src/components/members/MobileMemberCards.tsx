import { Phone, MessageCircle, SearchX, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Member } from '../../api/members';
import { Avatar } from '../ui/Avatar';
import { departmentLabel, churchRoleLabel, waLink } from './labels';

function rateColor(rate: number | null): string {
  if (rate === null) return 'bg-bg-base text-text-secondary';
  if (rate >= 80) return 'bg-present-bg text-present';
  if (rate >= 60) return 'bg-pending-bg text-pending';
  return 'bg-absent-bg text-absent';
}

function statusDot(m: Member, rate: number | null): string {
  if (m.status !== 'ACTIVE') return 'bg-text-secondary/40';
  if (rate !== null && rate < 40) return 'bg-brand-red';
  if (rate !== null && rate < 60) return 'bg-pending';
  return 'bg-brand-green';
}

export function MobileMemberCards({
  members,
  rates,
  page,
  totalPages,
  total,
  onPageChange,
  onOpen,
  onClear,
}: {
  members: Member[];
  rates: Record<string, number | null>;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (p: number) => void;
  onOpen: (m: Member) => void;
  onClear: () => void;
}) {
  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-[#EAE7F8] flex items-center justify-center text-brand-purple mb-3">
          <SearchX size={24} />
        </div>
        <span className="font-bold text-[16px] text-text-primary">No members found</span>
        <p className="text-[13px] text-text-secondary mt-1 max-w-[260px]">Try adjusting your search terms or filter selection.</p>
        <button
          onClick={onClear}
          className="mt-4 px-4 py-2 rounded-xl bg-white border border-border text-brand-purple text-[13px] font-semibold"
        >
          Reset filters
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {members.map((m) => {
        const rate = rates[m.id] ?? null;
        const needsCare = rate !== null && rate < 60;
        return (
          <div
            key={m.id}
            onClick={() => onOpen(m)}
            className="bg-white rounded-2xl p-4 border border-border/70 shadow-card flex items-center justify-between gap-3 cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="relative shrink-0">
                <Avatar firstName={m.firstName} lastName={m.lastName} size={48} />
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${statusDot(m, rate)} ring-2 ring-white`} />
              </div>
              <div className="flex flex-col min-w-0">
                <h2 className="font-bold text-[16px] text-text-primary tracking-tight truncate leading-snug">
                  {m.firstName} {m.lastName}
                </h2>
                {needsCare ? (
                  <p className="text-[13px] text-brand-red font-medium truncate mt-0.5">Needs pastoral care</p>
                ) : (
                  <p className="text-[13px] text-text-secondary truncate mt-0.5">
                    {departmentLabel(m.department)} · {churchRoleLabel(m.churchRole)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0" onClick={(e) => e.stopPropagation()}>
              <span className={`px-2.5 py-1 rounded-full font-semibold text-[12px] leading-tight tabular-nums ${rateColor(rate)}`}>
                {rate === null ? '—' : `${Math.round(rate)}%`}
              </span>
              <div className="flex items-center gap-1.5">
                <a
                  href={`tel:${m.phone}`}
                  aria-label={`Call ${m.firstName} ${m.lastName}`}
                  className="w-8 h-8 rounded-full bg-bg-base flex items-center justify-center text-brand-purple active:scale-95"
                >
                  <Phone size={16} />
                </a>
                <a
                  href={waLink(m.phone)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`WhatsApp ${m.firstName} ${m.lastName}`}
                  className="w-8 h-8 rounded-full bg-present-bg flex items-center justify-center text-present active:scale-95"
                >
                  <MessageCircle size={16} />
                </a>
              </div>
            </div>
          </div>
        );
      })}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-[13px] text-text-secondary px-1">
          <span>Page {page} of {totalPages} ({total})</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              aria-label="Previous page"
              className="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center disabled:opacity-40"
            >
              <ChevronLeft size={17} />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              aria-label="Next page"
              className="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center disabled:opacity-40"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
