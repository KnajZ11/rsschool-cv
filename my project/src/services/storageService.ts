// src/services/storageService.ts
import type { MonthlyData } from '../types';

const STORAGE_KEY = 'monthlyData';

export function getAllData(): Record<string, MonthlyData> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveAllData(data: Record<string, MonthlyData>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getMonthData(monthKey: string): MonthlyData | null {
  const allData = getAllData();
  return allData[monthKey] || null;
}

export function setMonthData(monthKey: string, data: MonthlyData): void {
  const allData = getAllData();
  allData[monthKey] = data;
  saveAllData(allData);
}

export function getMonthKeys(): string[] {
  return Object.keys(getAllData()).sort();
}

export function getOrInitMonthData(monthKey: string): MonthlyData {
  const existing = getMonthData(monthKey);
  if (existing) return existing;

  const newData: MonthlyData = {
    monthKey,
    employees: [],
    projects: [],
    timestamp: Date.now()
  };
  
  setMonthData(monthKey, newData);
  return newData;
}