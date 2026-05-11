// rs-react-app\src\App.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn()); // Мокаем глобальный fetch
  });

  it('должен загружать и отображать персонажей при старте', async () => {
    // Имитируем успешный ответ от Rick and Morty API
    const mockResponse = {
      ok: true,
      json: async () => ({
        results: [{ id: 1, name: 'Rick Sanchez', species: 'Human', image: 'rick.png' }],
      }),
    };
    vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

    render(<App />);

    // Проверяем наличие заголовка
    expect(screen.getByText(/Rick and Morty Search/i)).toBeInTheDocument();

    // Проверяем появление персонажа (это покроет ветку успеха в fetchData)
    const characterName = await screen.findByText(/Rick Sanchez/i);
    expect(characterName).toBeInTheDocument();
  });

  it('должен отображать лоадер во время загрузки данных', async () => {
    // Задерживаем ответ, чтобы лоадер успел "повиснуть" в DOM
    vi.mocked(fetch).mockImplementation(() => 
      new Promise((resolve) => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ results: [] })
        } as Response), 50)
      )
    );

    render(<App />);

    // Проверяем лоадер по тексту из твоего App.tsx
    expect(screen.getByText(/Ищем персонажей в мультивселенной/i)).toBeInTheDocument();
  });

  it('должен отображать сообщение, если результаты не найдены', async () => {
    // Имитируем пустой ответ (например, 404 от API)
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ results: [] }),
    } as Response);

    render(<App />);

    // Ждем сообщения об отсутствии результатов
    const noResults = await screen.findByText(/По вашему запросу никого не нашли/i);
    expect(noResults).toBeInTheDocument();
  });
});