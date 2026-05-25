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
 
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentTerm = searchParams.get('name') || localStorage.getItem('search_term') || '';
  
  useEffect(() => {
    if (!searchParams.get('page')) {
      setSearchParams({ name: currentTerm, page: '1' }, { replace: true });
    }
  }, [searchParams, setSearchParams, currentTerm]);

  /**
   * 🛰️ 2. ВНЕДРЕНИЕ TANSTACK QUERY (ВМЕСТО ВСЕХ СТАРЫХ EFFECT И FETCH)
   * Хук возвращает реактивное состояние асинхронного запроса напрямую из RAM-кэша.
   * `data` содержит info и results.
   */
  const { data, isLoading, isFetching, isError, error } = useCharactersQuery(currentTerm, currentPage);

  // 🔄 3. РУЧНОЕ АННУЛИРОВАНИЕ КЭША
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

  /**
   * 🛡️ БЕЗОПАСНАЯ ОБРАБОТКА ОШИБОК    
   */
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
              
              {/* Группа управления: кнопка генерации искусственной ошибки и кнопка очистки RAM-кэша */}
              <div className="controls-group">
                <SearchBar onSearch={handleSearch} />
                <ErrorButton />
                <button 
                  onClick={handleGlobalRefresh} 
                  className="refresh-button"
                  type="button"
                  title="Очистить кэш в оперативной памяти и перезапросить API"
                >
                  🔄 Обновить данные
                </button>
              </div>

              {/* ⚡ НЕБЛОКИРУЮЩИЙ ЛОАДЕР (isFetching): показывается при фоновом обновлении устаревшего кэша */}
              {!isLoading && isFetching && (
                <div className="fetching-indicator" data-testid="fetching-loader">
                  ⚡ Актуализация данных...
                </div>
              )}

              <div className="main-content-layout">
                <div className="results-side" style={{ flex: 1, width: '100%' }}>
                  
                  {/* 🏛️ КЕЙС 1: ПЕРВИЧНАЯ ЗАГРУЗКА (isLoading - Кэш абсолютно пуст) */}
                  {isLoading && (
                    <div className="main-loader" data-testid="main-loader">
                      <div className="spinner"></div>
                      <p>Загрузка мультивселенной...</p>
                    </div>
                  )}

                  {/* 🏛️ КЕЙС 2: КРИТИЧЕСКАЯ ОШИБКА API (isError) */}
                  {isError && (
                    <div className="error-box" data-testid="main-error">
                      <p>⚠️ Ошибка загрузки данных</p>
                      <span>{getErrorMessage(error)}</span>
                    </div>
                  )}

                  {/* 🏛️ КЕЙС 3: УСПЕШНОЕ ОТОБРАЖЕНИЕ ДАННЫХ ИЗ КЭША / СЕТИ */}
                  {!isLoading && !isError && data && (
                    <>
                      <div className="card-grid">
                        {data.results.length > 0 ? (
                          data.results.map((char) => (
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
                          type="button"
                        >
                          Назад
                        </button>
                        <span className="page-info"> Страница {currentPage} </span>
                        <button 
                          disabled={currentPage >= (data.info.pages || 1)}
                          onClick={() => handlePageChange(currentPage + 1)}
                          type="button"
                        >
                          Вперед
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
