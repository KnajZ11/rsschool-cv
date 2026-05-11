//rs-react-app\src\types.ts
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

export interface State {
  searchTerm: string;
  results: Character[];
  isLoading: boolean;
  hasError: boolean;
}