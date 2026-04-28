//rs-react-app\src\types.ts
export interface Character {
  id: number;
  name: string;
  image: string;
  species: string;
}

export interface State {
  searchTerm: string;
  results: Character[];
  isLoading: boolean;
  hasError: boolean;
}