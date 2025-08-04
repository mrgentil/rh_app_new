import { Team, Employee, Department, Objective, Project } from '../src/models';

async function createTestTeams() {
  try {
    console.log('🔄 Création des équipes de test...');

    // Récupérer les départements existants
    const departments = await Department.findAll();
    if (departments.length === 0) {
      console.log('❌ Aucun département trouvé. Créez d\'abord des départements.');
      return;
    }

    // Récupérer les employés managers
    const managers = await Employee.findAll({
      where: { status: 'actif' },
      limit: 5
    });

    if (managers.length === 0) {
      console.log('❌ Aucun employé trouvé. Créez d\'abord des employés.');
      return;
    }

    // Créer des équipes
    const teamsData = [
      {
        name: 'Équipe Développement Web',
        description: 'Équipe responsable du développement des applications web',
        managerId: managers[0].id,
        departmentId: departments.find(d => d.name.includes('IT') || d.name.includes('Tech'))?.id || departments[0].id,
        status: 'active'
      },
      {
        name: 'Équipe Marketing Digital',
        description: 'Équipe spécialisée dans le marketing en ligne et les réseaux sociaux',
        managerId: managers[1]?.id || managers[0].id,
        departmentId: departments.find(d => d.name.includes('Marketing'))?.id || departments[0].id,
        status: 'active'
      },
      {
        name: 'Équipe Ventes',
        description: 'Équipe commerciale responsable des ventes et de la relation client',
        managerId: managers[2]?.id || managers[0].id,
        departmentId: departments.find(d => d.name.includes('Vente') || d.name.includes('Commercial'))?.id || departments[0].id,
        status: 'active'
      },
      {
        name: 'Équipe RH',
        description: 'Équipe des ressources humaines',
        managerId: managers[3]?.id || managers[0].id,
        departmentId: departments.find(d => d.name.includes('RH') || d.name.includes('Human'))?.id || departments[0].id,
        status: 'active'
      }
    ];

    const createdTeams = [];
    for (const teamData of teamsData) {
      const team = await Team.create(teamData);
      createdTeams.push(team);
      console.log(`✅ Équipe créée: ${team.name} (Manager: ${managers.find(m => m.id === team.managerId)?.firstName} ${managers.find(m => m.id === team.managerId)?.lastName})`);
    }

    // Assigner des employés aux équipes
    const employees = await Employee.findAll({
      where: { status: 'actif' },
      limit: 10
    });

    for (let i = 0; i < employees.length; i++) {
      const teamIndex = i % createdTeams.length;
      await employees[i].update({ teamId: createdTeams[teamIndex].id });
      console.log(`👤 ${employees[i].firstName} ${employees[i].lastName} assigné à l'équipe ${createdTeams[teamIndex].name}`);
    }

    // Créer des objectifs pour les équipes
    const objectivesData = [
      {
        title: 'Améliorer la performance du site web',
        description: 'Optimiser les temps de chargement et l\'expérience utilisateur',
        type: 'team',
        teamId: createdTeams[0].id,
        assignedBy: managers[0].id,
        priority: 'high',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
        status: 'in_progress',
        progress: 25
      },
      {
        title: 'Augmenter la présence sur les réseaux sociaux',
        description: 'Développer la stratégie de contenu et l\'engagement',
        type: 'team',
        teamId: createdTeams[1]?.id || createdTeams[0].id,
        assignedBy: managers[1]?.id || managers[0].id,
        priority: 'medium',
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 jours
        status: 'pending',
        progress: 0
      },
      {
        title: 'Atteindre l\'objectif de vente Q1',
        description: 'Réaliser 120% de l\'objectif de vente du premier trimestre',
        type: 'team',
        teamId: createdTeams[2]?.id || createdTeams[0].id,
        assignedBy: managers[2]?.id || managers[0].id,
        priority: 'critical',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 jours
        status: 'in_progress',
        progress: 60
      }
    ];

    for (const objectiveData of objectivesData) {
      const objective = await Objective.create(objectiveData);
      console.log(`🎯 Objectif créé: ${objective.title} pour l'équipe ${createdTeams.find(t => t.id === objective.teamId)?.name}`);
    }

    // Créer des projets
    const projectsData = [
      {
        name: 'Refonte du site e-commerce',
        description: 'Modernisation complète de la plateforme de vente en ligne',
        teamId: createdTeams[0].id,
        managerId: managers[0].id,
        status: 'active',
        priority: 'high',
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 jours
        progress: 35,
        budget: 50000,
        client: 'Interne'
      },
      {
        name: 'Campagne marketing printemps 2024',
        description: 'Campagne marketing saisonnière pour le printemps',
        teamId: createdTeams[1]?.id || createdTeams[0].id,
        managerId: managers[1]?.id || managers[0].id,
        status: 'planning',
        priority: 'medium',
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 jours
        progress: 0,
        budget: 25000,
        client: 'Interne'
      }
    ];

    for (const projectData of projectsData) {
      const project = await Project.create(projectData);
      console.log(`📋 Projet créé: ${project.name} pour l'équipe ${createdTeams.find(t => t.id === project.teamId)?.name}`);
    }

    console.log('🎉 Données de test créées avec succès !');
    console.log(`📊 Résumé:`);
    console.log(`   - ${createdTeams.length} équipes créées`);
    console.log(`   - ${objectivesData.length} objectifs créés`);
    console.log(`   - ${projectsData.length} projets créés`);
    console.log(`   - ${employees.length} employés assignés aux équipes`);

  } catch (error: any) {
    console.error('❌ Erreur lors de la création des données de test:', error.message);
  } finally {
    process.exit(0);
  }
}

createTestTeams(); 