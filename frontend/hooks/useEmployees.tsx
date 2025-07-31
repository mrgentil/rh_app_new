import { useState, useEffect, useCallback } from 'react';
import { employeeService, Employee, CreateEmployeeData, UpdateEmployeeData } from '../services/employeeService';

interface UseEmployeesReturn {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  fetchEmployees: () => Promise<void>;
  createEmployee: (data: CreateEmployeeData) => Promise<Employee>;
  updateEmployee: (id: number, data: UpdateEmployeeData) => Promise<Employee>;
  deleteEmployee: (id: number) => Promise<void>;
  searchEmployees: (query: string) => Promise<Employee[]>;
  getEmployeesByDepartment: (departmentId: number) => Promise<Employee[]>;
  getEmployeesByStatus: (status: string) => Promise<Employee[]>;
}

export function useEmployees(): UseEmployeesReturn {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des employés');
    } finally {
      setLoading(false);
    }
  }, []);

  const createEmployee = useCallback(async (data: CreateEmployeeData): Promise<Employee> => {
    setError(null);
    try {
      const newEmployee = await employeeService.createEmployee(data);
      setEmployees(prev => [...prev, newEmployee]);
      return newEmployee;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de l\'employé');
      throw err;
    }
  }, []);

  const updateEmployee = useCallback(async (id: number, data: UpdateEmployeeData): Promise<Employee> => {
    setError(null);
    try {
      const updatedEmployee = await employeeService.updateEmployee(id, data);
      setEmployees(prev => prev.map(emp => emp.id === id ? updatedEmployee : emp));
      return updatedEmployee;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de l\'employé');
      throw err;
    }
  }, []);

  const deleteEmployee = useCallback(async (id: number): Promise<void> => {
    setError(null);
    try {
      await employeeService.deleteEmployee(id);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'employé');
      throw err;
    }
  }, []);

  const searchEmployees = useCallback(async (query: string): Promise<Employee[]> => {
    try {
      return await employeeService.searchEmployees(query);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la recherche');
      throw err;
    }
  }, []);

  const getEmployeesByDepartment = useCallback(async (departmentId: number): Promise<Employee[]> => {
    try {
      return await employeeService.getEmployeesByDepartment(departmentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du filtrage par département');
      throw err;
    }
  }, []);

  const getEmployeesByStatus = useCallback(async (status: string): Promise<Employee[]> => {
    try {
      return await employeeService.getEmployeesByStatus(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du filtrage par statut');
      throw err;
    }
  }, []);

  // Charger les employés au montage du composant
  useEffect(() => {
    fetchEmployees();
  }, []); // Retirer fetchEmployees des dépendances

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployees,
    getEmployeesByDepartment,
    getEmployeesByStatus,
  };
} 