import axios from 'axios';

async function testProfileUpdate() {
  try {
    console.log('🧪 Test de mise à jour du profil...');

    // Configurer axios pour gérer les cookies
    const axiosInstance = axios.create({
      withCredentials: true,
      baseURL: 'http://localhost:3001'
    });

    // D'abord, se connecter pour obtenir un cookie
    const loginResponse = await axiosInstance.post('/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });

    console.log('✅ Connexion réussie, cookie obtenu');
    console.log('📊 Réponse de connexion:', JSON.stringify(loginResponse.data, null, 2));

    // Extraire le token du cookie (simulation)
    // En réalité, nous allons utiliser une approche différente
    const token = loginResponse.headers['set-cookie']?.[0]?.split(';')[0]?.split('=')[1];
    
    if (!token) {
      console.log('⚠️ Token non trouvé dans les cookies, utilisation d\'une approche alternative...');
      
      // Utiliser directement les cookies avec withCredentials
      const profileResponse = await axiosInstance.get('/api/profile/me');
      console.log('📊 Profil actuel:', JSON.stringify(profileResponse.data, null, 2));

      // Données de test pour la mise à jour
      const updateData = {
        city: 'Paris Test',
        postalCode: '75001',
        country: 'France Test',
        emergencyContactName: 'Contact Test',
        emergencyContactPhone: '0123456789',
        emergencyContactRelationship: 'Parent'
      };

      console.log('📤 Envoi de la mise à jour...');
      console.log('📋 Données:', JSON.stringify(updateData, null, 2));

      // Mettre à jour le profil
      const updateResponse = await axiosInstance.put('/api/profile/me', updateData);

      console.log('✅ Profil mis à jour avec succès !');
      console.log('📊 Réponse:', JSON.stringify(updateResponse.data, null, 2));

      // Récupérer le profil mis à jour pour vérifier
      console.log('📤 Récupération du profil mis à jour...');
      const updatedProfileResponse = await axiosInstance.get('/api/profile/me');

      console.log('📊 Profil mis à jour:', JSON.stringify(updatedProfileResponse.data, null, 2));

      // Vérifier que les champs ont été mis à jour
      const updatedProfile = updatedProfileResponse.data;
      console.log('🔍 Vérification des champs mis à jour:');
      console.log(`  - city: ${updatedProfile.city} (attendu: ${updateData.city})`);
      console.log(`  - postalCode: ${updatedProfile.postalCode} (attendu: ${updateData.postalCode})`);
      console.log(`  - country: ${updatedProfile.country} (attendu: ${updateData.country})`);
      console.log(`  - emergencyContact.name: ${updatedProfile.emergencyContact?.name} (attendu: ${updateData.emergencyContactName})`);
      console.log(`  - emergencyContact.phone: ${updatedProfile.emergencyContact?.phone} (attendu: ${updateData.emergencyContactPhone})`);
      console.log(`  - emergencyContact.relationship: ${updatedProfile.emergencyContact?.relationship} (attendu: ${updateData.emergencyContactRelationship})`);

      console.log('🎉 Test terminé avec succès !');
    } else {
      console.log('🔑 Token extrait:', token);
      
      // Utiliser le token dans les headers Authorization
      const authAxios = axios.create({
        baseURL: 'http://localhost:3001',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Récupérer le profil actuel
      console.log('📤 Récupération du profil actuel...');
      const profileResponse = await authAxios.get('/api/profile/me');

      console.log('📊 Profil actuel:', JSON.stringify(profileResponse.data, null, 2));

      // Données de test pour la mise à jour
      const updateData = {
        city: 'Paris Test',
        postalCode: '75001',
        country: 'France Test',
        emergencyContactName: 'Contact Test',
        emergencyContactPhone: '0123456789',
        emergencyContactRelationship: 'Parent'
      };

      console.log('📤 Envoi de la mise à jour...');
      console.log('📋 Données:', JSON.stringify(updateData, null, 2));

      // Mettre à jour le profil
      const updateResponse = await authAxios.put('/api/profile/me', updateData);

      console.log('✅ Profil mis à jour avec succès !');
      console.log('📊 Réponse:', JSON.stringify(updateResponse.data, null, 2));

      // Récupérer le profil mis à jour pour vérifier
      console.log('📤 Récupération du profil mis à jour...');
      const updatedProfileResponse = await authAxios.get('/api/profile/me');

      console.log('📊 Profil mis à jour:', JSON.stringify(updatedProfileResponse.data, null, 2));

      // Vérifier que les champs ont été mis à jour
      const updatedProfile = updatedProfileResponse.data;
      console.log('🔍 Vérification des champs mis à jour:');
      console.log(`  - city: ${updatedProfile.city} (attendu: ${updateData.city})`);
      console.log(`  - postalCode: ${updatedProfile.postalCode} (attendu: ${updateData.postalCode})`);
      console.log(`  - country: ${updatedProfile.country} (attendu: ${updateData.country})`);
      console.log(`  - emergencyContact.name: ${updatedProfile.emergencyContact?.name} (attendu: ${updateData.emergencyContactName})`);
      console.log(`  - emergencyContact.phone: ${updatedProfile.emergencyContact?.phone} (attendu: ${updateData.emergencyContactPhone})`);
      console.log(`  - emergencyContact.relationship: ${updatedProfile.emergencyContact?.relationship} (attendu: ${updateData.emergencyContactRelationship})`);

      console.log('🎉 Test terminé avec succès !');
    }

  } catch (error) {
    const err = error as any;
    console.error('❌ Erreur lors du test:', err.message);
    if (err.response) {
      console.error(`📊 Status: ${err.response.status}`);
      console.error(`📋 Data:`, err.response.data);
    } else if (err.request) {
      console.error('📡 Erreur de connexion - le serveur ne répond pas');
    } else {
      console.error('❓ Erreur inconnue:', err);
    }
  }
}

testProfileUpdate(); 