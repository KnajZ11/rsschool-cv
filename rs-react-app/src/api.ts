// rs-react-app/src/api.ts
import { type Character } from './types';

export interface ApiResponse {
  results: Character[];
  info?: {
    count: number;
    pages: number;
  };
}

export const fetchData = async (searchTerm: string): Promise<ApiResponse> => {  
  const url = `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(searchTerm)}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {   
    if (response.status === 404) return { results: [] };
    throw new Error('Network response was not ok');
  }
  
  return response.json();
};