import { useMembers } from '../hooks/useMembers';
import { MobileMembersView } from '../components/members/MobileMembersView';
import { DesktopMembersView } from '../components/members/DesktopMembersView';
import { AddMemberModal } from '../components/members/AddMemberModal';

export function MembersListPage() {
  const a = useMembers();

  return (
    <div className="flex flex-col gap-4">
      <MobileMembersView a={a} />
      <DesktopMembersView a={a} />

      <AddMemberModal open={a.modalOpen} onClose={() => a.setModalOpen(false)} />
    </div>
  );
}
