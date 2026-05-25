//rs-react-app\src\components\SearchBar.tsx
import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SearchProps {
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchProps> = ({ onSearch }) => {  
  const [searchTerm, setSearchTerm] = useLocalStorage('search_term', '');
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    const term = searchTerm.trim();    
    onSearch(term);
  };
  
  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Type to search..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      {/* ИСПРАВЛЕНО: Текст кнопки изменен на "Поиск" по требованиям ТЗ */}
      <button 
        type="button" 
        className="counter" 
        onClick={handleSearchClick}
      >
        Поиск
      </button>
    </div>
  );
};

export default SearchBar;