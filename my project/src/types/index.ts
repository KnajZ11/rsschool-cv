// src/types/index.ts
export type Position = 'junior' | 'middle' | 'senior' | 'lead' | 'architect' | 'BO';

export interface Assignment {
  employeeId: string;
  projectId: string;
  capacity: number; // от 0.0 до 1.5 (шаг 0.1)
  fitness: number;  // от 0.0 до 1.0 (шаг 0.01)
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string; // "YYYY-MM-DD"
  position: Position;
  salary: number;
  assignments: Assignment[];
  vacationDays: number[]; // дни отпуска в текущем месяце (1-31)
}

export interface Project {
  id: string;
  projectName: string;
  companyName: string;
  budget: number;
  capacity: number; // общая требуемая вместимость проекта
}

export interface MonthlyData {
  monthKey: string; // например, "2026-05"
  employees: Employee[];
  projects: Project[];
  timestamp: number;
}

export interface PopupPosition {
  top: number;
  left: number;
}