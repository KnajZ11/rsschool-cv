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
  return workingDays || 22;
}

export function getVacationFactor(employee: Employee, monthKey: string): number {
  const workingDays = getWorkingDaysCount(monthKey);
  const [year, month] = monthKey.split('-').map(Number);
  
  const vacationWorkDays = (employee.vacationDays || []).filter(day => {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6;
  }).length;

  return Math.max(0, (workingDays - vacationWorkDays) / workingDays);
}

// --- 2. Основные финансовые формулы  ---

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
  const totalUsedEffective = monthData.employees.reduce((sum, emp) => 
    sum + getEffectiveCapacity(emp, project.id, monthData.monthKey), 0);
  
  const revenueCapacity = Math.max(project.capacity || 0, totalUsedEffective);
  if (revenueCapacity === 0) return 0;  
  
  const revenuePerUnit = (project.budget || 0) / revenueCapacity;
  return revenuePerUnit * empEffective;
}

/**
  Стоимость сотрудника на конкретном проекте (используется в ProjectList) */
export function getEmployeeProjectCost(employee: Employee, projectId: string): number {
  const assignment = employee.assignments?.find(a => a.projectId === projectId);
  if (!assignment) return 0;
  return (employee.salary || 0) * (assignment.capacity || 0);
}

/**
  Полная стоимость сотрудника (Проекты + 50% Bench на остаток ставки) */
export function getEmployeeTotalCost(employee: Employee): number {
  const salary = employee.salary || 0;
  const assignments = employee.assignments || [];
  
  const totalAssignmentCapacity = assignments.reduce((sum, a) => sum + (a.capacity || 0), 0);
  
  // 1. Прямая стоимость по проектам
  const projectsCost = totalAssignmentCapacity * salary;
  
  // 2. Стоимость простоя (бенч) до полной ставки (1.0) с коэффициентом 0.5
  const idleCapacity = Math.max(0, 1 - totalAssignmentCapacity);
  const benchCost = idleCapacity * salary * 0.5;
  
  return projectsCost + benchCost;
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
    return total + getEmployeeTotalCost(employee);
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
  // Каскадное удаление проекта из назначений всех сотрудников
  data.employees = data.employees.map(emp => ({
    ...emp,
    assignments: emp.assignments.filter(a => a.projectId !== id)
  }));
  setMonthData(monthKey, data);
}

/**
 * ИСПРАВЛЕНО: Объект ассайнмента теперь соответствует типу Assignment (без employeeId)
 */
export function assignEmployee(
  monthKey: string, 
  employeeId: string, 
  projectId: string, 
  capacity: number, 
  fitness: number
): { success: boolean; error?: string } {
  const data = getMonthData(monthKey);
  if (!data) return { success: false, error: 'Месяц не инициализирован' };
  
  const emp = data.employees.find(e => e.id === employeeId);
  if (!emp) return { success: false, error: 'Сотрудник не найден' };
  
  if (emp.assignments.some(a => a.projectId === projectId)) {
    return { success: false, error: 'Уже назначен на этот проект' };
  }

  // Больше не передаем employeeId внутрь ассайнмента
  emp.assignments.push({ 
    projectId, 
    capacity, 
    fitness 
  });

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

/**
 * ИСПРАВЛЕНО: При копировании месяца убрана привязка к старому employeeId внутри ассайнментов
 */
export function copyFromPreviousMonth(prevKey: string, newKey: string): boolean {
  const prevData = getMonthData(prevKey);
  if (!prevData) return false;

  // Мапа для связи старых ID проектов с новыми
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
      vacationDays: [], // Отпуска в новом месяце всегда пустые по ТЗ
      assignments: e.assignments.map(a => ({ 
        projectId: projectIdMap.get(a.projectId) || a.projectId,
        capacity: a.capacity,
        fitness: a.fitness
        // Поле employeeId удалено согласно новому интерфейсу
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