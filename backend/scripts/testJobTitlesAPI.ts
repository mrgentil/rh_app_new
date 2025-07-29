import axios from 'axios';

async function testJobTitlesAPI() {
  try {
    console.log('🔍 Test de l\'API des jobTitles...');
    
    const response = await axios.get('http://localhost:3001/api/job-titles');
    const jobTitles = response.data;
    
    console.log(`📊 Nombre de jobTitles reçus: ${jobTitles.length}`);
    console.log('📋 Structure du premier jobTitle:');
    console.log(JSON.stringify(jobTitles[0], null, 2));
    
    // Vérifier que la transformation 'title' -> 'name' fonctionne
    const hasNameProperty = jobTitles.every((job: any) => job.name && typeof job.name === 'string');
    const hasTitleProperty = jobTitles.every((job: any) => job.title && typeof job.title === 'string');
    
    console.log(`✅ Tous les jobTitles ont la propriété 'name': ${hasNameProperty}`);
    console.log(`✅ Tous les jobTitles ont la propriété 'title': ${hasTitleProperty}`);
    
    if (hasNameProperty) {
      console.log('🎉 La transformation fonctionne correctement !');
      console.log('📋 Liste des jobTitles avec la propriété "name":');
      jobTitles.forEach((job: any, index: number) => {
        console.log(`${index + 1}. ${job.name} (ID: ${job.id})`);
      });
    } else {
      console.log('❌ La transformation ne fonctionne pas correctement');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du test de l\'API:', error);
    process.exit(1);
  }
}

testJobTitlesAPI(); 