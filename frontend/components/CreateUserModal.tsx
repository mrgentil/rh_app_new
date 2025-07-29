import { useState, useCallback, memo, useRef } from 'react';

interface CreateUserModalProps {
  roles: any[];
  departments: any[];
  jobTitles: any[];
  users: any[];
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
}

const CreateUserModal = memo(({ 
  roles, 
  departments, 
  jobTitles, 
  users, 
  onClose, 
  onSubmit, 
  loading 
}: CreateUserModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    roleId: '',
    departmentId: '',
    jobTitleId: '',
    address: '',
    birthDate: '',
    hireDate: '',
    status: 'actif',
    managerId: ''
  });
  
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  const isSubmitting = useRef(false);

  const totalSteps = 3;

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, totalSteps]);

  const handlePrev = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      console.log('Form submission started');
      
      // Validation côté client
      const errors: {[key: string]: string} = {};
      
      if (!formData.username.trim()) errors.username = 'Le nom d\'utilisateur est requis';
      if (!formData.email.trim()) errors.email = 'L\'email est requis';
      if (!formData.firstName.trim()) errors.firstName = 'Le prénom est requis';
      if (!formData.lastName.trim()) errors.lastName = 'Le nom est requis';
      if (!formData.phone.trim()) errors.phone = 'Le téléphone est requis';
      if (!formData.roleId) errors.roleId = 'Le rôle est requis';
      if (!formData.departmentId) errors.departmentId = 'Le département est requis';
      if (!formData.jobTitleId) errors.jobTitleId = 'Le poste est requis';
      
      // Validation email
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Format d\'email invalide';
      }
      
      setValidationErrors(errors);
      
      if (Object.keys(errors).length > 0) {
        console.error('Validation failed:', errors);
        return false;
      }
      
      // Confirmation avant soumission
      if (!window.confirm('Êtes-vous sûr de vouloir créer cet utilisateur ?')) {
        return false;
      }
      
      console.log('Submitting user data:', formData);
      
      const userData = {
        ...formData,
        roleId: parseInt(formData.roleId),
        departmentId: parseInt(formData.departmentId),
        jobTitleId: parseInt(formData.jobTitleId),
        managerId: formData.managerId ? parseInt(formData.managerId) : undefined
      };
      
      // Utiliser setTimeout pour éviter les problèmes de timing
      setTimeout(() => {
        onSubmit(userData);
      }, 0);
      
      return false; // Empêcher la soumission par défaut
    } catch (error) {
      console.error('Error in form submission:', error);
      return false;
    }
  }, [formData, onSubmit]);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur de validation pour ce champ
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [validationErrors]);

  // Réinitialiser le formulaire quand le modal se ferme
  const handleClose = useCallback(() => {
    setFormData({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      roleId: '',
      departmentId: '',
      jobTitleId: '',
      address: '',
      birthDate: '',
      hireDate: '',
      status: 'actif',
      managerId: ''
    });
    setCurrentStep(1);
    setValidationErrors({});
    isSubmitting.current = false;
    onClose();
  }, [onClose]);

  const canProceedToNext = useCallback(() => {
    switch (currentStep) {
      case 1:
        return formData.username && formData.email && formData.firstName && formData.lastName && formData.phone;
      case 2:
        return formData.roleId && formData.departmentId && formData.jobTitleId;
      default:
        return true;
    }
  }, [currentStep, formData]);

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations de base</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom d'utilisateur *
          </label>
          <input
            type="text"
            required
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              validationErrors.username ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="john.doe"
          />
          {validationErrors.username && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.username}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              validationErrors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="john.doe@entreprise.com"
          />
          {validationErrors.email && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prénom *
          </label>
          <input
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              validationErrors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John"
          />
          {validationErrors.firstName && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.firstName}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom *
          </label>
          <input
            type="text"
            required
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              validationErrors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Doe"
          />
          {validationErrors.lastName && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Téléphone *
        </label>
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            validationErrors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="+33 6 12 34 56 78"
        />
        {validationErrors.phone && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Rôle et affectation</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rôle *
        </label>
        <select
          required
          value={formData.roleId}
          onChange={(e) => handleInputChange('roleId', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            validationErrors.roleId ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Sélectionner un rôle</option>
          {roles.map((role: any) => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>
        {validationErrors.roleId && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.roleId}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Département *
          </label>
          <select
            required
            value={formData.departmentId}
            onChange={(e) => handleInputChange('departmentId', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              validationErrors.departmentId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Sélectionner un département</option>
            {departments.map((dept: any) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
          {validationErrors.departmentId && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.departmentId}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Poste/Fonction *
          </label>
          <select
            required
            value={formData.jobTitleId}
            onChange={(e) => handleInputChange('jobTitleId', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              validationErrors.jobTitleId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Sélectionner un poste</option>
            {jobTitles && jobTitles.length > 0 ? (
              jobTitles.map((job: any) => (
                <option key={job.id} value={job.id}>{job.name}</option>
              ))
            ) : (
              <option value="" disabled>Aucun poste disponible</option>
            )}
          </select>
          {validationErrors.jobTitleId && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.jobTitleId}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Manager (optionnel)
        </label>
        <select
          value={formData.managerId}
          onChange={(e) => handleInputChange('managerId', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Aucun manager</option>
          {users?.map((user: any) => (
            <option key={user.id} value={user.id}>
              {user.employee?.firstName} {user.employee?.lastName} ({user.username})
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Détails optionnels</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Adresse
        </label>
        <textarea
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="123 Rue de la Paix, 75001 Paris"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de naissance
          </label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleInputChange('birthDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date d'embauche
          </label>
          <input
            type="date"
            value={formData.hireDate}
            onChange={(e) => handleInputChange('hireDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Statut employé
        </label>
        <select
          value={formData.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
          <option value="en_conge">En congé</option>
          <option value="termine">Terminé</option>
        </select>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Créer un nouvel utilisateur</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Indicateur de progression */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Informations de base</span>
            <span>Rôle & Affectation</span>
            <span>Détails optionnels</span>
          </div>
        </div>

        <form 
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target !== e.currentTarget) {
              e.preventDefault();
            }
          }}
        >
          {renderCurrentStep()}
          
          <div className="flex justify-between pt-6 border-t mt-6">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            
            <div className="flex space-x-3">
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceedToNext()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="button"
                  disabled={loading || Object.keys(validationErrors).length > 0}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Submit button clicked');
                    
                    // Protection contre les soumissions multiples
                    if (isSubmitting.current) {
                      console.log('Already submitting, ignoring click');
                      return;
                    }
                    
                    // Validation côté client
                    const errors: {[key: string]: string} = {};
                    
                    if (!formData.username.trim()) errors.username = 'Le nom d\'utilisateur est requis';
                    if (!formData.email.trim()) errors.email = 'L\'email est requis';
                    if (!formData.firstName.trim()) errors.firstName = 'Le prénom est requis';
                    if (!formData.lastName.trim()) errors.lastName = 'Le nom est requis';
                    if (!formData.phone.trim()) errors.phone = 'Le téléphone est requis';
                    if (!formData.roleId) errors.roleId = 'Le rôle est requis';
                    if (!formData.departmentId) errors.departmentId = 'Le département est requis';
                    if (!formData.jobTitleId) errors.jobTitleId = 'Le poste est requis';
                    
                    // Validation email
                    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                      errors.email = 'Format d\'email invalide';
                    }
                    
                    setValidationErrors(errors);
                    
                    if (Object.keys(errors).length > 0) {
                      console.error('Validation failed:', errors);
                      return;
                    }
                    
                    // Confirmation avant soumission
                    if (!window.confirm('Êtes-vous sûr de vouloir créer cet utilisateur ?')) {
                      return;
                    }
                    
                    console.log('Submitting user data:', formData);
                    
                    const userData = {
                      ...formData,
                      roleId: parseInt(formData.roleId),
                      departmentId: parseInt(formData.departmentId),
                      jobTitleId: parseInt(formData.jobTitleId),
                      managerId: formData.managerId ? parseInt(formData.managerId) : undefined
                    };
                    
                    isSubmitting.current = true;
                    onSubmit(userData);
                  }}
                >
                  {loading ? 'Création...' : 'Créer l\'utilisateur'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
});

CreateUserModal.displayName = 'CreateUserModal';

export default CreateUserModal; 