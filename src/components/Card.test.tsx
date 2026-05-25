// rs-react-app\src\components\Card.test.tsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import Card from './Card';
import { ThemeProvider } from '../context/ThemeContext';
import { useCharacterStore } from '../store/useCharacterStore';
import { type Character } from '../types';

describe('Card Component', () => { 
  const mockCharacter: Character = {
    id: 1,
    name: 'Rick Sanchez',
    image: 'https://rickandmortyapi.com/',
    species: 'Human',
    status: 'Alive',
    gender: 'Male',
    location: { name: 'Earth', url: '' },   
  };

  // Изолируем тесты — очищаем Zustand Store перед каждым тестом
  beforeEach(() => {
    useCharacterStore.setState({ selectedCharacters: [] });
  });

  // Вспомогательная функция рендера со всеми провайдерами
  const renderCard = (char: Character) => {
    return render(
      <BrowserRouter>
        <ThemeProvider>
          <Card character={char} />
        </ThemeProvider>
      </BrowserRouter>
    );
  };

  it('должен успешно отрендерить имя персонажа', () => {
    // Использована вспомогательная функция вместо прямого render
    renderCard(mockCharacter);
    
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('должен отображать вид (species) персонажа', () => {
    renderCard(mockCharacter);
    
    expect(screen.getByText('Human')).toBeInTheDocument();
  });

  it('должен рендерить изображение с правильным URL и alt-текстом', () => {
    renderCard(mockCharacter);
    
    const img = screen.getByRole('img') as HTMLImageElement;
    
    expect(img).toBeInTheDocument(); 
    expect(img.src).toContain(mockCharacter.image); 
    expect(img.alt).toBe(mockCharacter.name);
  });
});
