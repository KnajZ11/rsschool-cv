// rsschool-cv\src\hooks\useApiQueries.ts
import { useQuery } from '@tanstack/react-query';
import type { ApiResponse, Character } from '../types';

/**
 * 🛰️ ХУК №1: Получение и кэширование списка персонажей (Пагинация + Поиск)
 * 
 * @param term - Текущая поисковая строка из SearchBar
 * @param page - Текущая страница, выбранная в пагинации
 */
export const useCharactersQuery = (term: string, page: number) => {
  return useQuery<ApiResponse>({
    /**
     * 🔑 queryKey — это уникальный идентификатор запроса в оперативной памяти (RAM).    
     */
    queryKey: ['characters', term, page],

    /**
     * 🔄 queryFn — асинхронная функция, которая обязана вернуть промис с данными или выбросить ошибку.
     */
    queryFn: async () => {      
      const response = await fetch(
        `https://rickandmortyapi.com${encodeURIComponent(term)}&page=${page}`
      );
      
      if (!response.ok) {        
        if (response.status === 404) {
          return {
            info: { count: 0, pages: 1, next: null, prev: null },
            results: []
          };
        }
        
        throw new Error('Не удалось загрузить список персонажей. Попробуйте позже.');
      }

      return response.json();
    },
  });
};

/**
 * 🗂️ ХУК №2: Получение и кэширование детальной информации о выбранном персонаже
 * 
 * @param id - Уникальный ID персонажа (string) или null, если Flyout-панель закрыта
 */
export const useCharacterDetailsQuery = (id: string | null) => {
  return useQuery<Character>({    
    queryKey: ['character', id],

    queryFn: async () => {      
      if (!id) throw new Error('Идентификатор персонажа отсутствует');

      const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);

      if (!response.ok) {
        throw new Error('Информация о персонаже не найдена на сервере.');
      }

      return response.json();
    },
   
    enabled: !!id,
  });
};