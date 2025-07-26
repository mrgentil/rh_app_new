import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import Link from 'next/link';

export default function NouveauConge() {
  const router = useRouter();
  const [form, setForm] = useState({
    employeId: '',
    type: '',
    dateDebut: '',
    dateFin: '',
    statut: 'en attente',
    commentaire: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('http://localhost:4000/api/conges', {
        ...form,
        employeId: parseInt(form.employeId),
      }, { withCredentials: true });
      router.push('/conges');
    } catch (err) {
      setError("Erreur lors de la demande de congé");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-indigo-100">
      <Navbar />
      <div className="max-w-xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/conges" className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1">
            <FaArrowLeft /> <span>Retour</span>
          </Link>
          <h1 className="text-2xl font-bold text-indigo-700">Nouvelle demande de congé</h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <input name="employeId" value={form.employeId} onChange={handleChange} placeholder="ID Employé" required className="px-3 py-2 border rounded-lg" />
            <input name="type" value={form.type} onChange={handleChange} placeholder="Type de congé (payé, maladie, etc.)" required className="px-3 py-2 border rounded-lg" />
            <input name="dateDebut" value={form.dateDebut} onChange={handleChange} placeholder="Date de début" type="date" required className="px-3 py-2 border rounded-lg" />
            <input name="dateFin" value={form.dateFin} onChange={handleChange} placeholder="Date de fin" type="date" required className="px-3 py-2 border rounded-lg" />
            <input name="commentaire" value={form.commentaire} onChange={handleChange} placeholder="Commentaire" className="px-3 py-2 border rounded-lg col-span-2" />
          </div>
          {error && <div className="text-red-500 text-center">{error}</div>}
          <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50">
            <FaSave /> <span>{loading ? 'Envoi...' : 'Demander'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
