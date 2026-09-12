import { useAttendance } from '../hooks/useAttendance';
import { MobileAttendanceView } from '../components/attendance/MobileAttendanceView';
import { DesktopAttendanceView } from '../components/attendance/DesktopAttendanceView';

export function AttendancePage() {
  const a = useAttendance();

  return (
    <div className="flex flex-col gap-6">
      <MobileAttendanceView a={a} />
      <DesktopAttendanceView a={a} />
    </div>
  );
}
