import { useFirstTimers } from '../hooks/useFirstTimers';
import { MobileFirstTimersView } from '../components/first-timers/MobileFirstTimersView';
import { DesktopFirstTimersView } from '../components/first-timers/DesktopFirstTimersView';
import { RecordFirstTimerModal } from '../components/first-timers/RecordFirstTimerModal';
import { VisitorDrawer } from '../components/first-timers/VisitorDrawer';

export function FirstTimersListPage() {
  const a = useFirstTimers();

  return (
    <div className="flex flex-col gap-4">
      <MobileFirstTimersView a={a} />
      <DesktopFirstTimersView a={a} />

      <RecordFirstTimerModal open={a.modalOpen} onClose={() => a.setModalOpen(false)} />
      <VisitorDrawer id={a.drawerId} onClose={() => a.setDrawerId(null)} />
    </div>
  );
}
