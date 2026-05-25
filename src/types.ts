// rs-react-app\src\types.ts

// 1. Базовый интерфейс персонажа
export interface Character {
  id: number;
  name: string;
  image: string;
  species: string;
  status: string;
  gender: string;
  location: {
    name: string;
    url: string;
  };
}

// 2. Старый интерфейс состояния
export interface State {
  searchTerm: string;
  results: Character[];
  isLoading: boolean;
  hasError: boolean;
}

/**
 * 🛰️ НОВАЯ СТРУКТУРА ДЛЯ MODULE 5: Мета-информация пагинации от сервера
 * Описывает количество страниц, элементов и ссылки на переключение
 */
export interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

/**
 * 🛰️ НОВАЯ СТРУКТУРА ДЛЯ MODULE 5: Полный ответ API для списка персонажей
 * Связывает мета-информацию пагинации (info) и массив результатов поиска (results)
 */
export interface ApiResponse {
  info: ApiInfo;
  results: Character[];
}
