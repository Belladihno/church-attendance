import { useState } from 'react';
import { Phone, MessageCircle, SearchX } from 'lucide-react';
import type { FirstTimer } from '../../api/firstTimers';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { statusLabel, serviceLabel, formatVisitDate } from './labels';

function statusVariant(s: FirstTimer['followUpStatus']): 'pending' | 'contacted' | 'active' | 'excused' {
  if (s === 'PENDING') return 'pending';
  if (s === 'CONTACTED') return 'contacted';
  if (s === 'CONVERTED') return 'active';
  return 'excused';
}

function waLink(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const intl = digits.startsWith('0') ? `234${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}`;
}

const PAGE = 20;

export function MobileVisitorCards({
  visitors,
  onOpen,
  onConvert,
  onClear,
}: {
  visitors: FirstTimer[];
  onOpen: (v: FirstTimer) => void;
  onConvert: (v: FirstTimer) => void;
  onClear: () => void;
}) {
  const [visible, setVisible] = useState(PAGE);
  const shown = visitors.slice(0, visible);

  if (visitors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-2xl border border-border/40">
        <div className="w-12 h-12 rounded-full bg-[#EAE7F8] flex items-center justify-center mb-2.5 text-brand-purple">
          <SearchX size={24} />
        </div>
        <h4 className="text-[15px] font-semibold text-text-primary mb-1">No visitors found</h4>
        <p className="text-[12px] text-text-secondary max-w-xs">Try another keyword or reset the stage pill to view all visitors.</p>
        <button onClick={() => { setVisible(PAGE); onClear(); }} className="mt-3 text-sm text-brand-purple font-medium hover:underline">
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      {shown.map((v) => (
        <div key={v.id} className="bg-white rounded-2xl p-4 shadow-card border border-border/40 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0 cursor-pointer" onClick={() => onOpen(v)}>
              <Avatar firstName={v.firstName} lastName={v.lastName} size={48} />
              <div className="min-w-0">
                <h3 className="text-[16px] text-text-primary font-semibold truncate leading-snug">{v.firstName} {v.lastName}</h3>
                <p className="text-[12px] text-text-secondary truncate mt-0.5">
                  {formatVisitDate(v.dateAttended)} · {serviceLabel(v.serviceAttended)}
                </p>
              </div>
            </div>
            <Badge variant={statusVariant(v.followUpStatus)} className="shrink-0 whitespace-nowrap">
              {statusLabel(v.followUpStatus)}
            </Badge>
          </div>
          <div className="flex flex-col gap-1.5 text-[13px]">
            <div className="flex items-center gap-1.5 text-text-secondary">
              <span>Invited by <strong className="text-text-primary font-semibold">{v.invitedBy || 'Walk-in'}</strong></span>
            </div>
            {v.followUpNotes && (
              <p className="text-[12px] text-text-secondary line-clamp-1 italic pl-0.5">“{v.followUpNotes}”</p>
            )}
          </div>
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/30 mt-1">
            <div className="flex items-center gap-2">
              <a
                href={`tel:${v.phone}`}
                aria-label={`Call ${v.firstName} ${v.lastName}`}
                className="w-9 h-9 rounded-full bg-bg-base flex items-center justify-center text-brand-purple active:scale-95 shadow-sm"
              >
                <Phone size={17} />
              </a>
              <a
                href={waLink(v.phone)}
                target="_blank"
                rel="noreferrer"
                aria-label={`WhatsApp ${v.firstName} ${v.lastName}`}
                className="w-9 h-9 rounded-full bg-present-bg flex items-center justify-center text-present active:scale-95 shadow-sm"
              >
                <MessageCircle size={17} />
              </a>
            </div>
            {(v.followUpStatus === 'PENDING' || v.followUpStatus === 'CONTACTED') && (
              <button
                onClick={() => onConvert(v)}
                className="px-3.5 py-1.5 rounded-lg bg-[#EAE7F8] text-brand-purple font-bold text-[13px] active:scale-95"
              >
                Convert
              </button>
            )}
          </div>
        </div>
      ))}
      {visible < visitors.length && (
        <button
          onClick={() => setVisible((n) => n + PAGE)}
          className="w-full py-3 rounded-xl bg-white text-brand-purple text-[13px] font-semibold border border-border/70 shadow-card active:bg-bg-base"
        >
          Show more ({visitors.length - visible} remaining)
        </button>
      )}
    </div>
  );
}
