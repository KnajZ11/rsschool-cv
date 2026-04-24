// src/services/dataService.ts
import type { Employee, Project, MonthlyData } from '../types';
import { getMonthData, setMonthData, getOrInitMonthData } from './storageService';

const generateId = (): string => 
  Date.now().toString(36) + Math.random().toString(36).slice(2, 11);

// --- 1. Вспомогательные функции расчёта времени ---

/** Получение количества рабочих дней (будней) в месяце */
function getWorkingDaysCount(monthKey: string): number {
  const [year, month] = monthKey.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  let workingDays = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const dayOfWeek = new Date(year, month - 1, d).getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) workingDays++;
  }
  return workingDays;
}

/** Получение коэффициента отпуска (только будние дни) */
export function getVacationFactor(employee: Employee, monthKey: string): number {
  const workingDays = getWorkingDaysCount(monthKey);
  const [year, month] = monthKey.split('-').map(Number);
  
  const vacationWorkDays = employee.vacationDays.filter(day => {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6;
  }).length;

  return workingDays > 0 ? (workingDays - vacationWorkDays) / workingDays : 0;
}

// --- 2. Основные финансовые формулы ---

/** Эффективная мощность (эффективный потенциал) */
export function getEffectiveCapacity(employee: Employee, projectId: string, monthKey: string): number {
  const assignment = employee.assignments.find(a => a.projectId === projectId);
  if (!assignment) return 0;
  
  const vacationFactor = getVacationFactor(employee, monthKey);
  // Формула: назначенная мощность × подходить (fitness) × отдыхКоэффективный
  return assignment.capacity * assignment.fitness * vacationFactor;
}

/** Доход сотрудника на проекте */
export function getEmployeeRevenue(employee: Employee, project: Project, monthData: MonthlyData): number {
  const empEffective = getEffectiveCapacity(employee, project.id, monthData.monthKey);
  
  // использованныйЭффективныйМощность = сумма всех эффективных возможностей на проекте
  const totalUsedEffective = monthData.employees.reduce((sum, emp) => 
    sum + getEffectiveCapacity(emp, project.id, monthData.monthKey), 0);
  
  // емкость для доходов = макс(проектCapacity, использованныйЭффективныйМощность)
  const revenueCapacity = Math.max(project.capacity, totalUsedEffective);
  
  if (revenueCapacity === 0) return 0;
  
  // доходПерЭффективный потенциал = бюджет / емкость для доходов
  const revenuePerUnit = project.budget / revenueCapacity;
  
  return revenuePerUnit * empEffective;
}

/** Стоимость сотрудника на проекте */
export function getEmployeeCost(employee: Employee, projectId: string): number {
  const assignment = employee.assignments.find(a => a.projectId === projectId);
  if (!assignment) return 0;
  
  // Формула: зарплата × макс(0.5, назначенная мощность)
  return employee.salary * Math.max(0.5, assignment.capacity);
}

/** Стоимость скамейки (для неназначенных) */
export function getBenchCost(employee: Employee): number {
  return employee.salary * 0.5;
}

// --- 3. Итоговые показатели ---

export function getTotalRevenue(monthData: MonthlyData): number {
  return monthData.projects.reduce((total, project) => {
    return total + monthData.employees.reduce((sum, emp) => 
      sum + getEmployeeRevenue(emp, project, monthData), 0);
  }, 0);
}

export function getTotalCost(monthData: MonthlyData): number {
  return monthData.employees.reduce((total, employee) => {
    if (employee.assignments.length > 0) {
      return total + employee.assignments.reduce((sum, a) => 
        sum + getEmployeeCost(employee, a.projectId), 0);
    }
    return total + getBenchCost(employee);
  }, 0);
}

export function getTotalProfit(monthData: MonthlyData): number {
  return getTotalRevenue(monthData) - getTotalCost(monthData);
}

// --- 4. CRUD Операции ---

export function addEmployee(monthKey: string, employee: Omit<Employee, 'id' | 'assignments' | 'vacationDays'>): void {
  const data = getOrInitMonthData(monthKey);
  data.employees.push({ ...employee, id: generateId(), assignments: [], vacationDays: [] });
  setMonthData(monthKey, data);
}

export function updateEmployee(monthKey: string, id: string, changes: Partial<Omit<Employee, 'id' | 'assignments'>>): void {
  const data = getMonthData(monthKey);
  if (!data) return;
  const index = data.employees.findIndex(e => e.id === id);
  if (index !== -1) {
    data.employees[index] = { ...data.employees[index], ...changes };
    setMonthData(monthKey, data);
  }
}

export function deleteEmployee(monthKey: string, id: string): void {
  const data = getMonthData(monthKey);
  if (!data) return;
  data.employees = data.employees.filter(e => e.id !== id);
  setMonthData(monthKey, data);
}

export function addProject(monthKey: string, project: Omit<Project, 'id'>): void {
  const data = getOrInitMonthData(monthKey);
  data.projects.push({ ...project, id: generateId() });
  setMonthData(monthKey, data);
}

export function updateProject(monthKey: string, id: string, changes: Partial<Project>): void {
  const data = getMonthData(monthKey);
  if (!data) return;
  const index = data.projects.findIndex(p => p.id === id);
  if (index !== -1) {
    data.projects[index] = { ...data.projects[index], ...changes, id };
    setMonthData(monthKey, data);
  }
}

export function deleteProject(monthKey: string, id: string): void {
  const data = getMonthData(monthKey);
  if (!data) return;
  data.projects = data.projects.filter(p => p.id !== id);
  data.employees.forEach(emp => {
    emp.assignments = emp.assignments.filter(a => a.projectId !== id);
  });
  setMonthData(monthKey, data);
}

export function assignEmployee(monthKey: string, employeeId: string, projectId: string, capacity: number, fitness: number): { success: boolean; error?: string } {
  const data = getMonthData(monthKey);
  if (!data) return { success: false, error: 'Месяц не инициализирован' };
  const employee = data.employees.find(e => e.id === employeeId);
  if (!employee) return { success: false, error: 'Сотрудник не найден' };
  if (employee.assignments.some(a => a.projectId === projectId)) return { success: false, error: 'Уже назначен' };

  employee.assignments.push({ employeeId, projectId, capacity, fitness });
  setMonthData(monthKey, data);
  return { success: true };
}

export function removeAssignment(monthKey: string, employeeId: string, projectId: string): void {
  const data = getMonthData(monthKey);
  if (!data) return;
  const employee = data.employees.find(e => e.id === employeeId);
  if (employee) {
    employee.assignments = employee.assignments.filter(a => a.projectId !== projectId);
    setMonthData(monthKey, data);
  }
}

export function updateVacationDays(monthKey: string, employeeId: string, days: number[]): void {
  const data = getMonthData(monthKey);
  if (!data) return;
  const employee = data.employees.find(e => e.id === employeeId);
  if (employee) {
    employee.vacationDays = [...days].sort((a, b) => a - b);
    setMonthData(monthKey, data);
  }
}

export function copyFromPreviousMonth(prevKey: string, newKey: string): boolean {
  const prevData = getMonthData(prevKey);
  if (!prevData) return false;

  const projectIdMap = new Map<string, string>();
  const newProjects = prevData.projects.map(p => {
    const newId = generateId();
    projectIdMap.set(p.id, newId);
    return { ...p, id: newId };
  });

  const newEmployees = prevData.employees.map(e => {
    const newId = generateId();
    return { 
      ...e, 
      id: newId, 
      vacationDays: [], 
      assignments: e.assignments.map(a => ({ 
        ...a, 
        employeeId: newId,
        projectId: projectIdMap.get(a.projectId) || a.projectId 
      })) 
    };
  });

  setMonthData(newKey, {
    monthKey: newKey,
    employees: newEmployees,
    projects: newProjects,
    timestamp: Date.now()
  });
  return true;
}