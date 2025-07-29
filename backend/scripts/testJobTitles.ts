import { JobTitle } from '../src/models';

async function testJobTitles() {
  try {
    console.log('🔍 Vérification des postes/fonctions dans la base de données...');
    
    const jobTitles = await JobTitle.findAll({
      attributes: ['id', 'title', 'description']
    });
    
    console.log(`📊 Nombre total de postes trouvés: ${jobTitles.length}`);
    
    if (jobTitles.length === 0) {
      console.log('⚠️  Aucun poste trouvé dans la base de données!');
      console.log('💡 Création de quelques postes de test...');
      
      const testJobTitles = [
        { title: 'Développeur', description: 'Développeur d\'applications' },
        { title: 'Chef de projet', description: 'Gestion de projets informatiques' },
        { title: 'Analyste', description: 'Analyse des besoins utilisateurs' },
        { title: 'Testeur', description: 'Tests et assurance qualité' },
        { title: 'Administrateur système', description: 'Gestion des infrastructures' }
      ];
      
      for (const jobTitle of testJobTitles) {
        await JobTitle.create(jobTitle);
        console.log(`✅ Poste créé: ${jobTitle.title}`);
      }
      
      console.log('🎉 Postes de test créés avec succès!');
    } else {
      console.log('📋 Liste des postes existants:');
      jobTitles.forEach((job, index) => {
        console.log(`${index + 1}. ${job.title} (ID: ${job.id})`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des postes:', error);
    process.exit(1);
  }
}

testJobTitles(); 