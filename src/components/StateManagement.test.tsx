// rsschool-cv\src\components\StateManagement.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Card from './Card';
import Flyout from './Flyout';
import { ThemeProvider } from '../context/ThemeContext';
import { useCharacterStore } from '../store/useCharacterStore';
import { type Character } from '../types';

const mockCharacter: Character = {
  id: 99,
  name: 'Test Character',
  image: 'test.png',
  species: 'Alien',
  status: 'Alive',
  gender: 'Male',
  location: { name: 'Citadel', url: '' },
};

describe('Module 4: Integration State & Context Tests', () => {
  beforeEach(() => {
    useCharacterStore.setState({ selectedCharacters: [] });
    localStorage.clear();
  });

  const renderComponent = (ui: React.ReactElement) => {
    return render(
      <BrowserRouter>
        <ThemeProvider>
          {ui}
        </ThemeProvider>
      </BrowserRouter>
    );
  };

  it('интеграция: клик по чекбоксу добавляет элемент в Store и вызывает Flyout', async () => {    
    const { container } = renderComponent(
      <>
        <Card character={mockCharacter} />
        <Flyout />
      </>
    );
    
    expect(screen.queryByText(/Выбрано персонажей/i)).not.toBeInTheDocument();
    
    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(checkbox).toBeInTheDocument();
    
    fireEvent.click(checkbox);
    
    expect(useCharacterStore.getState().selectedCharacters.length).toBe(1);
    
    expect(screen.getByText(/Выбрано персонажей:/i)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    
    const unselectBtn = screen.getByRole('button', { name: /Снять выделение со всех/i });
    fireEvent.click(unselectBtn);
    
    expect(useCharacterStore.getState().selectedCharacters.length).toBe(0);
    expect(screen.queryByText(/Выбрано персонажей/i)).not.toBeInTheDocument();
  });

  it('интеграция: нативное скачивание CSV триггерится без ошибок', () => {    
    useCharacterStore.setState({ selectedCharacters: [mockCharacter] });

    renderComponent(<Flyout />);
    
    const createUrlSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-url');
    const revokeUrlSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    const downloadBtn = screen.getByRole('button', { name: /Скачать CSV/i });
    expect(downloadBtn).toBeInTheDocument();
    
    fireEvent.click(downloadBtn);
    
    expect(createUrlSpy).toHaveBeenCalled();
    expect(revokeUrlSpy).toHaveBeenCalled();

    createUrlSpy.mockRestore();
    revokeUrlSpy.mockRestore();
  });
});