import React, { useState } from 'react';
import Layout from '../components/Layout';

export default function TestFormPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    console.log('Test form submitted:', formData);
    alert('Formulaire soumis avec succès !');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Test de Formulaire</h1>
        
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Votre nom"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Tester la soumission
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
} 