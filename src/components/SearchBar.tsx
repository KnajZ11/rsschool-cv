//rs-react-app\src\components\SearchBar.tsx
import { Component, type ChangeEvent } from 'react';

interface SearchProps {
  onSearch: (term: string) => void;
}

// Описываем внутреннее состояние компонента
interface SearchState {
  searchTerm: string;
}

class SearchBar extends Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);
    
    // При инициализации сразу проверяем localStorage
    const savedTerm = localStorage.getItem('search_term') || '';
    
    this.state = {
      searchTerm: savedTerm,
    };
  }

  // Обработчик ввода в инпут
  handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value });
  };

  // Метод, который срабатывает при клике на кнопку Search
  handleSearchClick = () => {
    const term = this.state.searchTerm.trim();
    
    // Сохраняем в память браузера (требование ТЗ)
    localStorage.setItem('search_term', term);
    
    // Передаем значение наверх в компонент App
    this.props.onSearch(term);
  };

  render() {
    return (
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Type to search..."
          value={this.state.searchTerm}
          onChange={this.handleInputChange}
        />
        <button 
          type="button" 
          className="counter" 
          onClick={this.handleSearchClick}
        >
          Search
        </button>
      </div>
    );
  }
}

export default SearchBar;