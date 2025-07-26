import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import Link from 'next/link';

export default function NouvellePaie() {
  const router = useRouter();
  const [form, setForm] = useState({
    employeId: '',
    mois: '',
    annee: '',
    montant: '',
    statut: 'en attente',
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
      await axios.post('http://localhost:4000/api/paie', {
        ...form,
        employeId: parseInt(form.employeId),
        annee: parseInt(form.annee),
        montant: parseFloat(form.montant),
      }, { withCredentials: true });
      router.push('/paie');
    } catch (err) {
      setError("Erreur lors de l'ajout de la paie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-indigo-100">
      <Navbar />
      <div className="max-w-xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/paie" className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1">
            <FaArrowLeft /> <span>Retour</span>
          </Link>
          <h1 className="text-2xl font-bold text-indigo-700">Nouvelle fiche de paie</h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <input name="employeId" value={form.employeId} onChange={handleChange} placeholder="ID Employé" required className="px-3 py-2 border rounded-lg" />
            <input name="mois" value={form.mois} onChange={handleChange} placeholder="Mois (ex: Janvier)" required className="px-3 py-2 border rounded-lg" />
            <input name="annee" value={form.annee} onChange={handleChange} placeholder="Année" type="number" required className="px-3 py-2 border rounded-lg" />
            <input name="montant" value={form.montant} onChange={handleChange} placeholder="Montant (€)" type="number" required className="px-3 py-2 border rounded-lg" />
          </div>
          {error && <div className="text-red-500 text-center">{error}</div>}
          <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50">
            <FaSave /> <span>{loading ? 'Envoi...' : 'Ajouter'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
