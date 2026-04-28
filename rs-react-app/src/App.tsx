// rs-react-app\src\App.tsx
import { Component } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorButton from './components/ErrorButton';
import Card from './components/Card';
import { type State } from './types';

class App extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      results: [],
      isLoading: false,
      searchTerm: localStorage.getItem('search_term') || '',
      hasError: false,
    };
  }

  componentDidMount() {
    // Сразу подгружаем данные при старте (если есть сохраненный термин)
    this.fetchData(this.state.searchTerm);
  }

  fetchData = async (term: string) => {
    const trimmedTerm = term.trim();
    this.setState({ isLoading: true, searchTerm: trimmedTerm });
    
    // Сохраняем в localStorage
    localStorage.setItem('search_term', trimmedTerm);

    try {           
      const response = await fetch(
       `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(trimmedTerm)}`
      );
      
      const data = await response.json();

      if (response.ok && data.results) {
        this.setState({ 
          results: data.results, 
          isLoading: false,
          hasError: false 
        });
      } else {
        // Если API вернул 404 (не найдено), просто очищаем массив
        this.setState({ results: [], isLoading: false });
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);    
      this.setState({ results: [], isLoading: false });
    }
  };

  render() {
    const { results, isLoading } = this.state;

    return (
      <ErrorBoundary>
        <section id="center">
          <h1>Rick and Morty Search</h1>
          
          <SearchBar onSearch={this.fetchData} />
          <ErrorButton />

          <div className="results-area">
            {isLoading ? (
              <div className="loader">Ищем персонажей в мультивселенной...</div>
            ) : (
              <div className="card-grid">
                {results.length > 0 ? (
                  results.map((char) => (
                    <Card key={char.id} character={char} />
                  ))
                ) : (
                  <p className="no-results">По вашему запросу никого не нашли. Попробуйте другой поиск!</p>
                )}
              </div>
            )}
          </div>
        </section>

        <div className="ticks"></div>
        <section id="spacer"></section>
      </ErrorBoundary>
    );
  }
}

export default App;