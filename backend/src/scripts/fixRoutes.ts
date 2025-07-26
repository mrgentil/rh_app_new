import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Fonction pour corriger un fichier
function fixFile(filePath: string, replacements: Array<{ old: string; new: string }>) {
  try {
    let content = readFileSync(filePath, 'utf8');
    
    replacements.forEach(({ old, new: newStr }) => {
      content = content.replace(new RegExp(old, 'g'), newStr);
    });
    
    writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${filePath} corrigé`);
  } catch (error) {
    console.error(`❌ Erreur lors de la correction de ${filePath}:`, error);
  }
}

// Corrections pour les routes
const corrections = [
  {
    file: 'src/routes/conges.ts',
    replacements: [
      { old: 'statut', new: 'status' },
      { old: 'employeId', new: 'employeeId' },
      { old: 'userId:', new: 'employeeId:' },
      { old: 'lu: false', new: 'isRead: false' },
      { old: 'lu: true', new: 'isRead: true' }
    ]
  },
  {
    file: 'src/routes/paie.ts',
    replacements: [
      { old: 'employeId', new: 'employeeId' },
      { old: 'mois', new: 'month' },
      { old: 'annee', new: 'year' },
      { old: 'salaireBase', new: 'basicSalary' },
      { old: 'montantFinal', new: 'netSalary' }
    ]
  },
  {
    file: 'src/routes/documents.ts',
    replacements: [
      { old: 'employeId', new: 'employeeId' }
    ]
  },
  {
    file: 'src/routes/notifications.ts',
    replacements: [
      { old: 'userId', new: 'employeeId' },
      { old: 'lu', new: 'isRead' }
    ]
  }
];

console.log('🔧 Correction des routes...\n');

corrections.forEach(({ file, replacements }) => {
  fixFile(file, replacements);
});

console.log('\n✅ Toutes les corrections appliquées !'); 