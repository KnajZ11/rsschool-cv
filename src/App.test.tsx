// rs-react-app\src\App.test.tsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { useCharacterStore } from './store/useCharacterStore';

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn());    
    useCharacterStore.setState({ selectedCharacters: [] });
  });

  const renderApp = () => {
    return render(
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    );
  };

  it('должен загружать и отображать персонажей при старте', async () => {    
    const mockResponse = {
      ok: true,
      json: async () => ({
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
          json: async () => ({ results: [] })
        } as Response), 50)
      )
    );

    renderApp();    
    
    expect(screen.getByText(/Загрузка мультивселенной/i)).toBeInTheDocument();
  });

  it('должен отображать сообщение, если результаты не найдены', async () => {    
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ results: [] }),
    } as Response);

    renderApp();    
    
    const noResults = await screen.findByText(/Никого не нашли. Попробуйте другой поиск/i);
    expect(noResults).toBeInTheDocument();
  });
});