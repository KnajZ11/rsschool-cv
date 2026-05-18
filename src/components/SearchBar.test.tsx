// rs-react-app\src\components\SearchBar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SearchBar from './SearchBar';

const LS_KEY = 'search_term';

describe('SearchBar', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    mockOnSearch.mockClear();
  });

  it('сохраняет значение в localStorage при нажатии на кнопку Поиск', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /поиск/i });

    fireEvent.change(input, { target: { value: 'Rick' } });
    fireEvent.click(button);
   
    const savedValue = localStorage.getItem(LS_KEY);
    expect(savedValue).toBe(JSON.stringify('Rick'));
    expect(mockOnSearch).toHaveBeenCalledWith('Rick');
  });

  it('восстанавливает значение из localStorage при инициализации', () => {    
    localStorage.setItem(LS_KEY, JSON.stringify('Morty'));
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('Morty');
  });
});
