import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

interface AuditLog {
  id: number;
  userId: number | null;
  action: string;
  table: string;
  rowId: number | null;
  details: string;
  createdAt: string;
}

const PAGE_SIZE = 20;

export default function AuditLogsPage() {
  const { user, isLoading } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ userId: '', action: '', table: '', date: '' });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') return;
    setLoading(true);
    const params: any = { limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE };
    if (filters.userId) params.userId = filters.userId;
    if (filters.action) params.action = filters.action;
    if (filters.table) params.table = filters.table;
    if (filters.date) params.date = filters.date;
    axios.get('/api/audit', { params })
      .then(res => {
        setLogs(res.data.logs || res.data); // compatibilité backend
        setTotal(res.data.total ?? res.data.length ?? 0);
      })
      .catch(() => setError('Erreur chargement logs'))
      .finally(() => setLoading(false));
  }, [user, filters, page]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  if (isLoading || loading) return <div className="p-8">Chargement...</div>;
  if (!user || user.role !== 'ADMIN') return <div className="p-8 text-red-500">Accès réservé aux administrateurs RH.</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Logs d'audit RH</h1>
      <div className="mb-4 flex flex-wrap gap-2 items-end">
        <input name="userId" value={filters.userId} onChange={handleFilterChange} placeholder="ID utilisateur" className="border px-2 py-1 rounded text-sm" />
        <input name="action" value={filters.action} onChange={handleFilterChange} placeholder="Action (CREATE, UPDATE...)" className="border px-2 py-1 rounded text-sm" />
        <input name="table" value={filters.table} onChange={handleFilterChange} placeholder="Table (Employee, Payroll...)" className="border px-2 py-1 rounded text-sm" />
        <input name="date" value={filters.date} onChange={handleFilterChange} placeholder="Date (YYYY-MM-DD)" className="border px-2 py-1 rounded text-sm" />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-3 py-2 border">Date</th>
              <th className="px-3 py-2 border">Utilisateur</th>
              <th className="px-3 py-2 border">Action</th>
              <th className="px-3 py-2 border">Table</th>
              <th className="px-3 py-2 border">ID Ligne</th>
              <th className="px-3 py-2 border">Détails</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="border-t">
                <td className="px-3 py-2 border">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="px-3 py-2 border">{log.userId ?? '-'}</td>
                <td className="px-3 py-2 border">{log.action}</td>
                <td className="px-3 py-2 border">{log.table}</td>
                <td className="px-3 py-2 border">{log.rowId ?? '-'}</td>
                <td className="px-3 py-2 border text-xs max-w-xs break-all">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex gap-2 items-center">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Précédent</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={logs.length < PAGE_SIZE} className="px-3 py-1 border rounded disabled:opacity-50">Suivant</button>
        <span className="ml-4 text-sm text-gray-500">{total ? `Total: ${total}` : ''}</span>
      </div>
    </div>
  );
}
