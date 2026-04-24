// src/services/dataService.ts
import type { Employee, Project, Assignment, MonthlyData } from '../types';
import { getMonthData, setMonthData, getOrInitMonthData } from './storageService';

const generateId = (): string => 
  Date.now().toString(36) + Math.random().toString(36).slice(2, 11);

// --- 1. Вспомогательные функции расчёта времени ---

function getWorkingDaysCount(monthKey: string): number {
  const [year, month] = monthKey.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  let workingDays = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const dayOfWeek = new Date(year, month - 1, d).getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) workingDays++;
  }
  return workingDays || 22; // Защита: возвращаем 22, если что-то пошло не так
}

export function getVacationFactor(employee: Employee, monthKey: string): number {
  const workingDays = getWorkingDaysCount(monthKey);
  const [year, month] = monthKey.split('-').map(Number);
  
  const vacationWorkDays = (employee.vacationDays || []).filter(day => {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6;
  }).length;

  // Коэффициент не может быть меньше 0
  return Math.max(0, (workingDays - vacationWorkDays) / workingDays);
}

// --- 2. Основные финансовые формулы ---

export function getProjectRate(project: Project): number {
  return (project.capacity || 0) === 0 ? 0 : (project.budget || 0) / project.capacity;
}

export function getEffectiveCapacity(employee: Employee, projectId: string, monthKey: string): number {
  const assignment = employee.assignments?.find(a => a.projectId === projectId);
  if (!assignment) return 0;
  
  const vacationFactor = getVacationFactor(employee, monthKey);
  return (assignment.capacity || 0) * (assignment.fitness || 0) * vacationFactor;
}

export function getEmployeeRevenue(employee: Employee, project: Project, monthData: MonthlyData): number {
  const empEffective = getEffectiveCapacity(employee, project.id, monthData.monthKey);  
  
  // Сумма эффективных мощностей всех сотрудников на этом проекте
  const totalUsedEffective = monthData.employees.reduce((sum, emp) => 
    sum + getEffectiveCapacity(emp, project.id, monthData.monthKey), 0);
  
  // Емкость для доходов = макс(проектCapacity, использованныйЭффективныйМощность)
  const revenueCapacity = Math.max(project.capacity || 0, totalUsedEffective);
  
  if (revenueCapacity === 0) return 0;  
  const revenuePerUnit = (project.budget || 0) / revenueCapacity;
  
  return revenuePerUnit * empEffective;
}

export function getEmployeeCost(employee: Employee, projectId: string): number {
  const assignment = employee.assignments?.find(a => a.projectId === projectId);
  if (!assignment) return 0;
  // стоимость сотрудника = зарплата × макс(0,5, назначенная мощность)
  return (employee.salary || 0) * Math.max(0.5, assignment.capacity || 0);
}

export function getBenchCost(employee: Employee): number {
  return (employee.salary || 0) * 0.5;
}

// --- 3. Итоговые показатели ---

export function getTotalRevenue(monthData: MonthlyData): number {
  if (!monthData.projects || !monthData.employees) return 0;
  return monthData.projects.reduce((total, project) => {
    return total + monthData.employees.reduce((sum, emp) => 
      sum + getEmployeeRevenue(emp, project, monthData), 0);
  }, 0);
}

export function getTotalCost(monthData: MonthlyData): number {
  if (!monthData.employees) return 0;
  return monthData.employees.reduce((total, employee) => {
    if ((employee.assignments || []).length > 0) {
      // Итого стоимость назначений сотрудника
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
  const newEmployee: Employee = {
    ...employee,
    id: generateId(),
    assignments: [],
    vacationDays: []
  };
  data.employees = [...data.employees, newEmployee];
  setMonthData(monthKey, data);
}

export function updateEmployee(monthKey: string, id: string, changes: Partial<Employee>): void {
  const data = getMonthData(monthKey);
  if (!data) return;
  data.employees = data.employees.map(e => e.id === id ? { ...e, ...changes } : e);
  setMonthData(monthKey, data);
}

export function deleteEmployee(monthKey: string, id: string): void {
  const data = getMonthData(monthKey);
  if (!data) return;
  data.employees = data.employees.filter(e => e.id !== id);
  setMonthData(monthKey, data);
}

export function addProject(monthKey: string, project: Omit<Project, 'id'>): void {
  const data = getOrInitMonthData(monthKey);
  const newProject: Project = { ...project, id: generateId() };
  data.projects = [...data.projects, newProject];
  setMonthData(monthKey, data);
}

export function updateProject(monthKey: string, id: string, changes: Partial<Project>): void {
  const data = getMonthData(monthKey);
  if (!data) return;
  data.projects = data.projects.map(p => p.id === id ? { ...p, ...changes } : p);
  setMonthData(monthKey, data);
}

export function deleteProject(monthKey: string, id: string): void {
  const data = getMonthData(monthKey);
  if (!data) return;
  data.projects = data.projects.filter(p => p.id !== id);
  // Каскадное удаление проекта из назначений сотрудников
  data.employees = data.employees.map(emp => ({
    ...emp,
    assignments: emp.assignments.filter(a => a.projectId !== id)
  }));
  setMonthData(monthKey, data);
}

export function assignEmployee(monthKey: string, employeeId: string, projectId: string, capacity: number, fitness: number): { success: boolean; error?: string } {
  const data = getMonthData(monthKey);
  if (!data) return { success: false, error: 'Месяц не инициализирован' };
  
  const emp = data.employees.find(e => e.id === employeeId);
  if (!emp) return { success: false, error: 'Сотрудник не найден' };
  
  if (emp.assignments.some(a => a.projectId === projectId)) {
    return { success: false, error: 'Уже назначен на этот проект' };
  }

  emp.assignments.push({ employeeId, projectId, capacity, fitness });
  setMonthData(monthKey, data);
  return { success: true };
}

export function removeAssignment(monthKey: string, employeeId: string, projectId: string): void {
  const data = getMonthData(monthKey);
  if (!data) return;
  data.employees = data.employees.map(emp => {
    if (emp.id === employeeId) {
      return { ...emp, assignments: emp.assignments.filter(a => a.projectId !== projectId) };
    }
    return emp;
  });
  setMonthData(monthKey, data);
}

export function updateVacationDays(monthKey: string, employeeId: string, days: number[]): void {
  const data = getMonthData(monthKey);
  if (!data) return;
  data.employees = data.employees.map(emp => 
    emp.id === employeeId ? { ...emp, vacationDays: [...days].sort((a, b) => a - b) } : emp
  );
  setMonthData(monthKey, data);
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
    const newEmpId = generateId();
    return { 
      ...e, 
      id: newEmpId, 
      vacationDays: [], 
      assignments: e.assignments.map(a => ({ 
        ...a, 
        employeeId: newEmpId,
        // Если проект был скопирован - берем новый ID, иначе оставляем как есть
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