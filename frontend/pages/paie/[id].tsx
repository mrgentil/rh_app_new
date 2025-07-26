import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { FaArrowLeft, FaSave, FaTrash } from 'react-icons/fa';
import Link from 'next/link';

export default function EditPaie() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState({
    employeId: '',
    mois: '',
    annee: '',
    montant: '',
    statut: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:4000/api/paie/${id}`, { withCredentials: true })
      .then(res => setForm({ ...res.data, montant: res.data.montant.toString(), annee: res.data.annee.toString() }))
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
      await axios.put(`http://localhost:4000/api/paie/${id}`, {
        ...form,
        employeId: parseInt(form.employeId),
        annee: parseInt(form.annee),
        montant: parseFloat(form.montant),
      }, { withCredentials: true });
      router.push('/paie');
    } catch (err) {
      setError("Erreur lors de la modification de la paie");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Supprimer cette fiche de paie ?')) return;
    setSaving(true);
    try {
      await axios.delete(`http://localhost:4000/api/paie/${id}`, { withCredentials: true });
      router.push('/paie');
    } catch {
      setError('Erreur lors de la suppression');
    } finally {
      setSaving(false);
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
          <h1 className="text-2xl font-bold text-indigo-700">Modifier la fiche de paie</h1>
        </div>
        {loading ? (
          <div className="text-center text-gray-500">Chargement...</div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <input name="employeId" value={form.employeId} onChange={handleChange} placeholder="ID Employé" required className="px-3 py-2 border rounded-lg" />
              <input name="mois" value={form.mois} onChange={handleChange} placeholder="Mois (ex: Janvier)" required className="px-3 py-2 border rounded-lg" />
              <input name="annee" value={form.annee} onChange={handleChange} placeholder="Année" type="number" required className="px-3 py-2 border rounded-lg" />
              <input name="montant" value={form.montant} onChange={handleChange} placeholder="Montant (€)" type="number" required className="px-3 py-2 border rounded-lg" />
              <input name="statut" value={form.statut} onChange={handleChange} placeholder="Statut (payé, en attente, etc.)" required className="px-3 py-2 border rounded-lg col-span-2" />
            </div>
            {error && <div className="text-red-500 text-center">{error}</div>}
            <div className="flex gap-4 mt-2">
              <button type="submit" disabled={saving} className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50">
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
