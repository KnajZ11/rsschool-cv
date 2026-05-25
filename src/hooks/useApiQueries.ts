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
    queryKey: ['characters', term, page],

    queryFn: async () => {
      // 1. Properly construct the URL
      // Base path: /api/character/
      // Query params: name=${term}&page=${page}
      const baseUrl = 'https://rickandmortyapi.com/api/character/';
      const url = `${baseUrl}?name=${encodeURIComponent(term)}&page=${page}`;

      const response = await fetch(url);
      
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