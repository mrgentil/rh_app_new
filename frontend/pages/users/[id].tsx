import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { FaArrowLeft, FaSave, FaTrash } from 'react-icons/fa';
import Link from 'next/link';

export default function EditUser() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: '',
    employeId: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:4000/api/users/${id}`, { withCredentials: true })
      .then(res => setForm({ ...res.data, password: '', employeId: res.data.employeId || '' }))
      .catch(() => setError('Erreur de chargement'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await axios.put(`http://localhost:4000/api/users/${id}`, {
        ...form,
        employeId: form.employeId ? parseInt(form.employeId) : undefined,
      }, { withCredentials: true });
      router.push('/users');
    } catch (err) {
      setError("Erreur lors de la modification de l'utilisateur");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    setSaving(true);
    try {
      await axios.delete(`http://localhost:4000/api/users/${id}`, { withCredentials: true });
      router.push('/users');
    } catch {
      setError('Erreur lors de la suppression');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-indigo-100">
      <Navbar />
      <div className="max-w-xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/users" className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1">
            <FaArrowLeft /> <span>Retour</span>
          </Link>
          <h1 className="text-2xl font-bold text-indigo-700">Modifier l'utilisateur</h1>
        </div>
        {loading ? (
          <div className="text-center text-gray-500">Chargement...</div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 flex flex-col gap-4">
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required className="px-3 py-2 border rounded-lg" />
            <input name="password" value={form.password} onChange={handleChange} placeholder="Nouveau mot de passe (laisser vide pour ne pas changer)" type="password" className="px-3 py-2 border rounded-lg" />
            <select name="role" value={form.role} onChange={handleChange} className="px-3 py-2 border rounded-lg">
              <option value="ADMIN">Admin RH</option>
              <option value="MANAGER">Manager</option>
              <option value="EMPLOYE">Employé</option>
            </select>
            <input name="employeId" value={form.employeId} onChange={handleChange} placeholder="ID Employé (optionnel)" type="number" className="px-3 py-2 border rounded-lg" />
            {error && <div className="text-red-500 text-center">{error}</div>}
            <div className="flex gap-4 mt-2">
              <button type="submit" disabled={saving} className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50">
                <FaSave /> <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
              </button>
              <button type="button" onClick={handleDelete} disabled={saving} className="flex items-center gap-2 bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50">
                <FaTrash /> <span>Supprimer</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
