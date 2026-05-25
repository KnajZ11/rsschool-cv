// src/components/ApiQueries.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { renderWithQueryClient } from '../setupTests';
import { ThemeProvider } from '../context/ThemeContext';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('Module 5: Валидация TanStack Query (Кэширование и Инвалидация)', () => {
  beforeEach(() => {    
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => ''),
      setItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

 it('должен корректно обрабатывать сценарий кэширования страниц списка и ручной инвалидации', async () => {    
    const user = userEvent.setup();

    /**
     * 🛰️ СОЗДАЕМ ИМИТАЦИЮ СЕРВЕРА (Strict Mock Fetch)     
     */
    const mockFetch = vi.fn().mockImplementation(async (url: string) => {      
      if (url.includes('page=1')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            info: { count: 2, pages: 2, next: 'url?page=2', prev: null },
            results: [{ id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', image: '', location: { name: 'Earth' } }]
          })
        };
      }
      
      if (url.includes('page=2')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            info: { count: 2, pages: 2, next: null, prev: 'url?page=1' },
            results: [{ id: 2, name: 'Morty Smith', status: 'Alive', species: 'Human', image: '', location: { name: 'Earth' } }]
          })
        };
      }
      return { ok: false, status: 500 };
    });

    vi.stubGlobal('fetch', mockFetch);    
    
    renderWithQueryClient(
      <MemoryRouter initialEntries={['/?name=&page=1']}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </MemoryRouter>
    );
    
    await screen.findByText('Rick Sanchez');
    expect(mockFetch).toHaveBeenCalledTimes(1);
    
    const nextButton = screen.getByRole('button', { name: /вперед/i });
    await user.click(nextButton);
    
    await screen.findByText('Morty Smith');
    expect(mockFetch).toHaveBeenCalledTimes(2);
    
    const prevButton = screen.getByRole('button', { name: /назад/i });
    await user.click(prevButton);
    
    await screen.findByText('Rick Sanchez');
    
    /**
     * 🎯 КЛЮЧЕВАЯ ПРОВЕРКА КЭША:   
     */
    expect(mockFetch).toHaveBeenCalledTimes(2);
    
    const refreshButton = screen.getByRole('button', { name: /обновить данные/i });
    await user.click(refreshButton);
    
    await waitFor(() => {
      /**
       * 🎯 КЛЮЧЕВАЯ ПРОВЕРКА ИНВАЛИДАЦИИ:       
       */
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });
  });
});
