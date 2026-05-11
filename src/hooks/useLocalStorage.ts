// rsschool-cv\src\hooks\useLocalStorage.ts
import { useState, useEffect } from 'react';

/**
 * Хук для синхронизации состояния с LocalStorage.
 * @param key Ключ, по которому данные хранятся в браузере.
 * @param initialValue Начальное значение, если в памяти ничего нет.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {  
 const [storedValue, setStoredValue] = useState<T>(() => {
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return initialValue;

    try {
      return JSON.parse(item);
    } catch {      
      return item as unknown as T;
    }
  } catch (error) {
    console.error(error);
    return initialValue;
  }
});
  
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Ошибка записи в LocalStorage по ключу "${key}":`, error);
    }
  }, [key, storedValue]);
  
  return [storedValue, setStoredValue] as const;
}