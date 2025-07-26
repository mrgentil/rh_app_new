import { useRef, useState } from 'react';
import axios from 'axios';

interface Props {
  employeId: number;
  onUpload?: () => void;
}

export default function DocumentUpload({ employeId, onUpload }: Props) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileInput.current?.files?.length) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', fileInput.current.files[0]);
    formData.append('employeId', employeId.toString());
    formData.append('type', 'contrat');
    formData.append('nom', fileInput.current.files[0].name);
    try {
      await axios.post('http://localhost:4000/api/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      if (onUpload) onUpload();
      fileInput.current.value = '';
    } catch (err) {
      setError('Erreur lors de l\'upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="flex items-center gap-2 mt-2">
      <input type="file" ref={fileInput} className="border rounded p-1" required />
      <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded disabled:opacity-50">{loading ? 'Envoi...' : 'Uploader'}</button>
      {error && <span className="text-red-500 text-xs ml-2">{error}</span>}
    </form>
  );
}
