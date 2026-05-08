// rs-react-app\src\components\SearchBar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = vi.fn();
  // Ключ как в компоненте!
  const LS_KEY = 'search_term'; 

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('сохраняет значение в localStorage при нажатии на кнопку Search', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'Rick' } });
    fireEvent.click(button);

    expect(setItemSpy).toHaveBeenCalledWith(LS_KEY, 'Rick');    
    expect(mockOnSearch).toHaveBeenCalledWith('Rick');
  });

  it('восстанавливает значение из localStorage при инициализации', () => {
    // 1. Сначала записываем данные в LS
    localStorage.setItem(LS_KEY, 'Morty');
    
    // 2. Рендерим компонент (в конструкторе сработает getItem)
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    
    // 3. Теперь значение должно быть в инпуте
    expect(input.value).toBe('Morty');
  });
});