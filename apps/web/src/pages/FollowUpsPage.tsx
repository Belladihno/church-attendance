import { useFollowUps } from '../hooks/useFollowUps';
import { MobileFollowUpsView } from '../components/follow-ups/MobileFollowUpsView';
import { DesktopFollowUpsView } from '../components/follow-ups/DesktopFollowUpsView';
import { CareModal } from '../components/follow-ups/CareModal';
import { CareDrawer } from '../components/follow-ups/CareDrawer';

export function FollowUpsPage() {
  const a = useFollowUps();

  return (
    <div className="flex flex-col gap-4">
      <MobileFollowUpsView a={a} />
      <DesktopFollowUpsView a={a} />

      <CareModal
        open={a.modal.open}
        mode={a.modal.mode}
        followUp={a.modal.followUp}
        members={a.members}
        firstTimers={a.firstTimers}
        onClose={a.closeModal}
        onSaved={a.invalidate}
      />
      <CareDrawer id={a.drawerId} onClose={() => a.setDrawerId(null)} />
    </div>
  );
}
