import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import Link from 'next/link';

export default function NouveauUser() {
  const router = useRouter();
  const { user } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'EMPLOYE',
    employeId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirige si non admin
  useEffect(() => {
    if (user && user.role !== 'ADMIN') router.replace('/users');
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('http://localhost:4000/api/users', {
        ...form,
        employeId: form.employeId ? parseInt(form.employeId) : undefined,
      }, { withCredentials: true });
      router.push('/users');
    } catch (err) {
      setError("Erreur lors de la création de l'utilisateur");
    } finally {
      setLoading(false);
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
          <h1 className="text-2xl font-bold text-indigo-700">Nouvel utilisateur</h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 flex flex-col gap-4">
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required className="px-3 py-2 border rounded-lg" />
          <input name="password" value={form.password} onChange={handleChange} placeholder="Mot de passe" type="password" required className="px-3 py-2 border rounded-lg" />
          <select name="role" value={form.role} onChange={handleChange} className="px-3 py-2 border rounded-lg">
            <option value="ADMIN">Admin RH</option>
            <option value="MANAGER">Manager</option>
            <option value="EMPLOYE">Employé</option>
          </select>
          <input name="employeId" value={form.employeId} onChange={handleChange} placeholder="ID Employé (optionnel)" type="number" className="px-3 py-2 border rounded-lg" />
          {error && <div className="text-red-500 text-center">{error}</div>}
          <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50">
            <FaSave /> <span>{loading ? 'Envoi...' : 'Créer'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
