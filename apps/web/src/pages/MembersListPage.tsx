import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getMembers } from '../api/members';
import { PageHeader } from '../components/ui/PageHeader';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell, EmptyState } from '../components/ui/Table';
import { Pagination } from '../components/ui/Pagination';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';

export function MembersListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [department, setDepartment] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['members', page, search, status, department],
    queryFn: () => getMembers({ page, limit: 10, search: search || undefined, status: status || undefined, department: department || undefined }),
  });

  return (
    <div>
      <PageHeader
        title="Members Directory"
        subtitle={`${data?.total ?? 0} registered members`}
        actions={
          <Link to="/members/new">
            <Button>Add member</Button>
          </Link>
        }
      />

      <div className="bg-bg-card rounded-xl p-4 shadow-card mb-4 flex flex-col lg:flex-row gap-3">
        <div className="flex-1">
          <Input placeholder="Search by name, phone..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </Select>
        <Select value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="">All departments</option>
          <option value="Ushering Unit">Ushering</option>
          <option value="Choir Ministry">Choir</option>
          <option value="Media & Technical">Media</option>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center p-8 text-text-secondary">Loading...</div>
      ) : !data || data.data.length === 0 ? (
        <EmptyState message="No members yet. Add your first member →" />
      ) : (
        <>
          <Table>
            <TableHead>
              <TableHeader>Member</TableHeader>
              <TableHeader>Contact</TableHeader>
              <TableHeader>Department</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableHead>
            <TableBody>
              {data.data.map((m, idx) => (
                <TableRow key={m.id} alt={idx % 2 === 1}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar firstName={m.firstName} lastName={m.lastName} size={36} />
                      <div>
                        <div className="font-medium text-text-primary">{m.firstName} {m.lastName}</div>
                        <div className="text-xs text-text-secondary">{m.gender}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{m.phone}</TableCell>
                  <TableCell>{m.department}</TableCell>
                  <TableCell><Badge variant={m.status === 'ACTIVE' ? 'active' : 'excused'}>{m.status.toLowerCase()}</Badge></TableCell>
                  <TableCell>
                    <Link to={`/members/${m.id}`} className="text-brand-purple hover:underline text-sm">View</Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-text-secondary">Total: {data.total}</span>
            <Pagination page={page} totalPages={Math.ceil(data.total / data.limit)} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}
