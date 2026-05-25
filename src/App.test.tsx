// rs-react-app\src\App.test.tsx
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { renderWithQueryClient } from './setupTests';
import { ThemeProvider } from './context/ThemeContext';
import { useCharacterStore } from './store/useCharacterStore';

describe('App Component Tests with TanStack Query', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn());   
    useCharacterStore.setState({ selectedCharacters: [] });
  });
  
  const renderApp = () => {
    return renderWithQueryClient(      
      <MemoryRouter initialEntries={['/?name=&page=1']}>        
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </MemoryRouter>
    );
  };

  it('должен загружать и отображать персонажей при старте', async () => {    
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => ({
        info: { count: 1, pages: 1, next: null, prev: null },
        results: [{ 
          id: 1, 
          name: 'Rick Sanchez', 
          species: 'Human', 
          image: 'rick.png',
          status: 'Alive',
          gender: 'Male',
          location: { name: 'Earth', url: '' }
        }],
      }),
    };
    vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

    renderApp();
    
    expect(screen.getByText(/Rick and Morty Search/i)).toBeInTheDocument();
    
    const characterName = await screen.findByText(/Rick Sanchez/i);
    expect(characterName).toBeInTheDocument();
  });

  it('должен отображать лоадер во время загрузки данных', async () => {    
     vi.mocked(fetch).mockImplementation(() => 
      new Promise((resolve) => 
        setTimeout(() => resolve({
          ok: true,
          status: 200,
          json: async () => ({ info: { pages: 1 }, results: [] })
        } as Response), 100)
      )
    );

    renderApp();  
    
    expect(screen.getByTestId('main-loader')).toBeInTheDocument();
    expect(screen.getByText(/Загрузка мультивселенной/i)).toBeInTheDocument();
  });

  it('должен отображать сообщение, если результаты не найдены', async () => {  
      vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: 'There is nothing here' }),
    } as Response);

    renderApp(); 
    
    const noResults = await screen.findByText(/Никого не нашли. Попробуйте другой поиск/i);
    expect(noResults).toBeInTheDocument();
  });
});