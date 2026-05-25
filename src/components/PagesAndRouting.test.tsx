// rsschool-cv\src\components\PagesAndRouting.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import About from './About';
import NotFound from './NotFound';
import CharacterDetails from './CharacterDetails';
import { renderWithQueryClient } from '../setupTests';

describe('Module 4 & 5: Pages and Routing Coverage', () => {
  it('должен корректно рендерить страницу About', () => {
    render(<About />);
    expect(screen.getByText(/О приложении/i)).toBeInTheDocument();
    expect(screen.getByText(/Автор: KnajZ11/i)).toBeInTheDocument();
  });

  it('должен корректно рендерить страницу NotFound и реагировать на клик кнопки', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByText(/404 - Страница не найдена/i)).toBeInTheDocument();
    
    const backBtn = screen.getByRole('button', { name: /Вернуться на главную/i });
    expect(backBtn).toBeInTheDocument();    
    
    fireEvent.click(backBtn);
  });

  it('должен рендерить лоадер и загружать данные в CharacterDetails при наличии ID', async () => {    
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        id: 1,
        name: 'Rick Sanchez',
        image: 'rick.png',
        status: 'Alive',
        species: 'Human',
        gender: 'Male',
        location: { name: 'Earth', url: '' }
      })
    }));
    
    renderWithQueryClient(
      <MemoryRouter initialEntries={['/details/1']}>
        <Routes>
          <Route path="/details/:id" element={<CharacterDetails />} />
        </Routes>
      </MemoryRouter>
    );
 
    expect(screen.getByTestId('details-loader')).toBeInTheDocument();

    const title = await screen.findByText('Rick Sanchez');
    expect(title).toBeInTheDocument();    
    
    expect(screen.getByText(/Alive/i)).toBeInTheDocument();
    expect(screen.getByText(/Human/i)).toBeInTheDocument();
    expect(screen.getByText(/Earth/i)).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /×/i });
    fireEvent.click(closeBtn);
    
    vi.restoreAllMocks();
  });
});