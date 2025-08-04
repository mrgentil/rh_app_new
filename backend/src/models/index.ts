export { sequelize } from './sequelize';

// Import all models
import { Employee } from './Employee';
import { User } from './User';
import { Leave } from './Leave';
import { Payroll } from './Payroll';
import { Document } from './Document';
import { Notification } from './Notification';
import { AuditLog } from './AuditLog';
import { JobTitle } from './JobTitle';
import { Department } from './Department';
import { Contract } from './Contract';
import { JobOffer } from './JobOffer';
import { Candidate } from './Candidate';
import { Application } from './Application';
import { Training } from './Training';
import { EmployeeTraining } from './EmployeeTraining';
import { LeaveType } from './LeaveType';
import { Message } from './Message';
import { Announcement } from './Announcement';
import { Role } from './Role';
import { Invoice } from './Invoice';
import { Team } from './Team';
import { Objective } from './Objective';
import { Project } from './Project';
import { PerformanceReview } from './PerformanceReview';

// A. Gestion des employés - Associations
Employee.belongsTo(JobTitle, { foreignKey: 'jobTitleId' });
JobTitle.hasMany(Employee, { foreignKey: 'jobTitleId' });

Employee.belongsTo(Department, { foreignKey: 'departmentId' });
Department.hasMany(Employee, { foreignKey: 'departmentId' });

Employee.hasOne(Contract, { foreignKey: 'employeeId' });
Contract.belongsTo(Employee, { foreignKey: 'employeeId' });

// Auto-relation pour la hiérarchie (manager/subordinates)
Employee.belongsTo(Employee, { as: 'manager', foreignKey: 'managerId' });
Employee.hasMany(Employee, { as: 'subordinates', foreignKey: 'managerId' });

// B. Recrutement - Associations
JobOffer.belongsTo(Department, { foreignKey: 'departmentId' });
Department.hasMany(JobOffer, { foreignKey: 'departmentId' });

Application.belongsTo(Candidate, { foreignKey: 'candidateId' });
Candidate.hasMany(Application, { foreignKey: 'candidateId' });

Application.belongsTo(JobOffer, { foreignKey: 'jobOfferId' });
JobOffer.hasMany(Application, { foreignKey: 'jobOfferId' });

// C. Formations - Associations
EmployeeTraining.belongsTo(Employee, { foreignKey: 'employeeId' });
Employee.hasMany(EmployeeTraining, { foreignKey: 'employeeId' });

EmployeeTraining.belongsTo(Training, { foreignKey: 'trainingId' });
Training.hasMany(EmployeeTraining, { foreignKey: 'trainingId' });

// D. Gestion des congés - Associations
Leave.belongsTo(Employee, { foreignKey: 'employeeId' });
Employee.hasMany(Leave, { foreignKey: 'employeeId' });

Leave.belongsTo(LeaveType, { foreignKey: 'leaveTypeId' });
LeaveType.hasMany(Leave, { foreignKey: 'leaveTypeId' });

// E. Paie - Associations
Payroll.belongsTo(Employee, { foreignKey: 'employeeId' });
Employee.hasMany(Payroll, { foreignKey: 'employeeId' });

// F. Communication interne - Associations
Message.belongsTo(Employee, { as: 'sender', foreignKey: 'senderId' });
Employee.hasMany(Message, { as: 'sentMessages', foreignKey: 'senderId' });

Message.belongsTo(Employee, { as: 'receiver', foreignKey: 'receiverId' });
Employee.hasMany(Message, { as: 'receivedMessages', foreignKey: 'receiverId' });

Announcement.belongsTo(Employee, { as: 'author', foreignKey: 'postedBy' });
Employee.hasMany(Announcement, { as: 'announcements', foreignKey: 'postedBy' });

// G. Sécurité & Rôles - Associations
User.belongsTo(Employee, { foreignKey: 'employeeId' });
Employee.hasOne(User, { foreignKey: 'employeeId' });

User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

// H. Documents - Associations (existantes)
Employee.hasMany(Document, { foreignKey: 'employeeId' });
Document.belongsTo(Employee, { foreignKey: 'employeeId' });

// Notifications - Associations
Employee.hasMany(Notification, { foreignKey: 'employeeId' });
Notification.belongsTo(Employee, { foreignKey: 'employeeId' });

// I. Gestion d'équipe et Management - Associations
// Teams
Team.belongsTo(Employee, { as: 'manager', foreignKey: 'managerId' });
Employee.hasMany(Team, { as: 'managedTeams', foreignKey: 'managerId' });

Team.belongsTo(Department, { foreignKey: 'departmentId' });
Department.hasMany(Team, { foreignKey: 'departmentId' });

// Team Members (Many-to-Many via Employee.teamId)
Employee.belongsTo(Team, { as: 'team', foreignKey: 'teamId' });
Team.hasMany(Employee, { as: 'members', foreignKey: 'teamId' });

// Objectives
Objective.belongsTo(Employee, { as: 'employee', foreignKey: 'employeeId' });
Employee.hasMany(Objective, { as: 'objectives', foreignKey: 'employeeId' });

Objective.belongsTo(Employee, { as: 'assignedByEmployee', foreignKey: 'assignedBy' });
Employee.hasMany(Objective, { as: 'assignedObjectives', foreignKey: 'assignedBy' });

Objective.belongsTo(Team, { foreignKey: 'teamId' });
Team.hasMany(Objective, { foreignKey: 'teamId' });

// Projects
Project.belongsTo(Team, { foreignKey: 'teamId' });
Team.hasMany(Project, { foreignKey: 'teamId' });

Project.belongsTo(Employee, { as: 'manager', foreignKey: 'managerId' });
Employee.hasMany(Project, { as: 'managedProjects', foreignKey: 'managerId' });

// Performance Reviews
PerformanceReview.belongsTo(Employee, { as: 'employee', foreignKey: 'employeeId' });
Employee.hasMany(PerformanceReview, { as: 'performanceReviews', foreignKey: 'employeeId' });

PerformanceReview.belongsTo(Employee, { as: 'reviewer', foreignKey: 'reviewerId' });
Employee.hasMany(PerformanceReview, { as: 'reviewedPerformanceReviews', foreignKey: 'reviewerId' });

// Export all models
export {
  Employee,
  User,
  Leave,
  Payroll,
  Document,
  Notification,
  AuditLog,
  JobTitle,
  Department,
  Contract,
  JobOffer,
  Candidate,
  Application,
  Training,
  EmployeeTraining,
  LeaveType,
  Message,
  Announcement,
  Role,
  Invoice,
  Team,
  Objective,
  Project,
  PerformanceReview,
};

