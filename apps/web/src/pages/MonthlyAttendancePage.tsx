import { useParams } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { AttendancePage } from './AttendancePage';

export function MonthlyAttendancePage() {
  const { year, month } = useParams();
  return (
    <div>
      <PageHeader title={`Attendance ${month}/${year}`} />
      <AttendancePage />
    </div>
  );
}
