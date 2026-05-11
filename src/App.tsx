// rs-react-app\src\App.tsx
import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Outlet, useSearchParams, Link } from 'react-router-dom';
import './App.css';
import SearchBar from './components/SearchBar';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorButton from './components/ErrorButton';
import Card from './components/Card';
import CharacterDetails from './components/CharacterDetails';
import NotFound from './components/NotFound';
import About from './components/About';
import { type Character } from './types';

const App = () => {
  const [results, setResults] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Источник правды — URL
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentTerm = searchParams.get('name') || localStorage.getItem('search_term') || '';

  // Автоматическая установка параметров в URL при первом входе
  useEffect(() => {
    if (!searchParams.get('page')) {
      setSearchParams({ name: currentTerm, page: '1' }, { replace: true });
    }
  }, [searchParams, setSearchParams, currentTerm]);

   const fetchData = useCallback(async (term: string, page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(term)}&page=${page}`
      );
      
      if (!response.ok) {
        setResults([]);
        return;
      }
      
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Ошибка загрузки:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentTerm, currentPage);
  }, [currentPage, currentTerm, fetchData]);

  const handleSearch = (term: string) => {
    setSearchParams({ name: term, page: '1' });
    localStorage.setItem('search_term', term);
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ name: currentTerm, page: newPage.toString() });
  };

  return (
    <ErrorBoundary>
      <header className="main-header">
        <nav className="nav-container">
          <Link to="/">Главная</Link>
          <Link to="/about">О приложении</Link>
        </nav>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <section id="center">
              <h1 className="main-title">Rick and Morty Search</h1>
              <SearchBar onSearch={handleSearch} />
              <ErrorButton />

              <div className="main-content-layout">
                <div className="results-side">
                  {isLoading ? (
                    <div className="loader">Загрузка мультивселенной...</div>
                  ) : (
                    <>
                      <div className="card-grid">
                        {results.length > 0 ? (
                          results.map((char) => (
                            <Card key={char.id} character={char} />
                          ))
                        ) : (
                          <p className="no-results">Никого не нашли. Попробуйте другой поиск!</p>
                        )}
                      </div>
                      
                      <div className="pagination">
                        <button 
                          disabled={currentPage === 1} 
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          Назад
                        </button>
                        <span className="page-info"> Страница {currentPage} </span>
                        <button onClick={() => handlePageChange(currentPage + 1)}>Вперед</button>
                      </div>
                    </>
                  )}
                </div>

                <aside className="details-side">
                  <Outlet />
                </aside>
              </div>
            </section>
          }
        >
          <Route path="details/:id" element={<CharacterDetails />} />
        </Route>
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;