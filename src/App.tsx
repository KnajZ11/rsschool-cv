// rs-react-app\src\App.tsx
import { useEffect } from 'react';
import { Routes, Route, Outlet, useSearchParams, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useCharactersQuery } from './hooks/useApiQueries';
import { useTheme } from './hooks/useTheme';
import SearchBar from './components/SearchBar';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorButton from './components/ErrorButton';
import Card from './components/Card';
import CharacterDetails from './components/CharacterDetails';
import NotFound from './components/NotFound';
import About from './components/About';
import Flyout from './components/Flyout';
import './App.css';

const App = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme, toggleTheme } = useTheme();
  const queryClient = useQueryClient();
  
  const currentPage = parseInt(searchParams.get('page') ?? '1', 10);
  const currentTerm = searchParams.get('name') ?? localStorage.getItem('search_term') ?? '';

  useEffect(() => {
    if (!searchParams.get('page')) {
      setSearchParams({ name: currentTerm, page: '1' }, { replace: true });
    }
  }, [searchParams, setSearchParams, currentTerm]);

  // Вызов хука TanStack Query
  const { data, isLoading, isFetching, isError, error } = useCharactersQuery(currentTerm, currentPage);

  // Ручное аннулирование кэша в RAM (Функция 4)
  const handleGlobalRefresh = async () => {
    await queryClient.invalidateQueries();
  };

  const handleSearch = (term: string) => {
    setSearchParams({ name: term, page: '1' });
    localStorage.setItem('search_term', term);
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ name: currentTerm, page: newPage.toString() });
  };

  const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) return err.message;
    return 'Неизвестная ошибка сети';
  };

  return (
    <ErrorBoundary>
      <header className="main-header">
        <nav className="nav-container">
          <div className="nav-links">
            <Link to="/">Главная</Link>
            <Link to="/about">О приложении</Link>
          </div>
          
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Включить светлую тему' : 'Включить темную тему'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </nav>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <section id="center">
              <h1 className="main-title">Rick and Morty Search</h1>
              
              <div className="controls-group">
                <SearchBar onSearch={handleSearch} />
                <ErrorButton />
                <button 
                  onClick={handleGlobalRefresh} 
                  className="refresh-button"
                  type="button"
                >
                  🔄 Обновить данные
                </button>
              </div>

              {/* Фоновый индикатор обновления кэша */}
              {!isLoading && isFetching && (
                <div className="fetching-indicator" data-testid="fetching-loader">
                  ⚡ Актуализация данных...
                </div>
              )}

              <div className="main-content-layout">
                <div className="results-side" style={{ flex: 1, width: '100%' }}>
                  
                  {/* КЕЙС 1: ПЕРВИЧНАЯ ЗАГРУЗКА (Кэш пуст) */}
                  {isLoading && (
                    <div className="main-loader" data-testid="main-loader">
                      <div className="spinner"></div>
                      <p>Загрузка мультивселенной...</p>
                    </div>
                  )}

                  {/* CASE 2: API ERROR */}
                  {isError && (
                    <div className="error-box" data-testid="main-error">
                      <p>⚠️ Error loading data</p>
                      <span>{getErrorMessage(error)}</span>
                    </div>
                  )}

                  {/* CASE 3: SUCCESSFUL RENDER FROM RAM OR NETWORK */}
                  {!isLoading && !isError && data && (
                    <>
                      <div className="card-grid">
                        {data.results.length > 0 ? (
                          data.results.map((char) => (
                            <Card key={char.id} character={char} />
                          ))
                        ) : (
                          <p className="no-results">No results found. Try a different search!</p>
                        )}
                      </div>

                      <div className="pagination">
                        <button 
                          disabled={currentPage === 1} 
                          onClick={() => handlePageChange(currentPage - 1)}
                          type="button"
                        >
                          Previous
                        </button>
                        <span className="page-info"> Page {currentPage} </span>
                        <button 
                          disabled={currentPage >= (data.info.pages || 1)}
                          onClick={() => handlePageChange(currentPage + 1)}
                          type="button"
                        >
                          Next
                        </button>
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
          {/* Nested Route for character details */}
          <Route path="details/:id" element={<CharacterDetails />} />
        </Route>
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Flyout />
    </ErrorBoundary>
  );
};

export default App;
