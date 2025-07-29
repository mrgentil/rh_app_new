import { sequelize } from '../models/sequelize';
import { User, Employee } from '../models';
import dotenv from 'dotenv';

dotenv.config();

async function fixUserEmails() {
  try {
    console.log('🔧 Correction des emails utilisateurs...\n');

    // Test de connexion à la base de données
    console.log('1. Test de connexion à la base de données...');
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie\n');

    // Récupérer tous les utilisateurs avec leurs employés
    console.log('2. Récupération des utilisateurs...');
    const users = await User.findAll({
      include: [
        {
          model: Employee,
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    console.log(`📊 ${users.length} utilisateurs trouvés\n`);

    let fixedCount = 0;
    let noEmailCount = 0;

    for (const user of users) {
      const employee = (user as any).Employee;
      const username = user.username;
      
      if (!employee) {
        console.log(`⚠️  Utilisateur "${username}" n'a pas d'employé associé`);
        noEmailCount++;
        continue;
      }

      if (!employee.email || !employee.email.includes('@')) {
        console.log(`❌ Utilisateur "${username}" (${employee.firstName} ${employee.lastName}) n'a pas d'email valide`);
        console.log(`   Email actuel: "${employee.email}"`);
        
        // Générer un email temporaire basé sur le nom d'utilisateur
        const tempEmail = `${username.toLowerCase()}@example.com`;
        console.log(`   Email temporaire suggéré: ${tempEmail}`);
        
        // Demander confirmation pour mettre à jour
        console.log(`   Voulez-vous mettre à jour l'email ? (y/n)`);
        // Pour l'instant, on ne fait que afficher les problèmes
        noEmailCount++;
      } else {
        console.log(`✅ Utilisateur "${username}" a un email valide: ${employee.email}`);
        fixedCount++;
      }
    }

    console.log('\n📈 Résumé:');
    console.log(`- Utilisateurs avec email valide: ${fixedCount}`);
    console.log(`- Utilisateurs sans email valide: ${noEmailCount}`);
    
    if (noEmailCount > 0) {
      console.log('\n🔧 Pour corriger les emails manquants:');
      console.log('1. Mettez à jour les employés dans la base de données');
      console.log('2. Ou utilisez le script de mise à jour automatique');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la correction des emails:', error);
  } finally {
    await sequelize.close();
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  fixUserEmails();
}

export { fixUserEmails }; 