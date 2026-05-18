// rs-react-app\src\components\CardList.test.tsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import CardList from './CardList';
import { ThemeProvider } from '../context/ThemeContext';
import { useCharacterStore } from '../store/useCharacterStore';
import { type Character } from '../types';

describe('CardList Component', () => { 
  const mockCharacters: Character[] = [
    { 
      id: 1, 
      name: 'Rick Sanchez', 
      species: 'Human', 
      image: 'rick.png',
      status: 'Alive',
      gender: 'Male',
      location: { name: 'Earth', url: '' }
    },
    { 
      id: 2, 
      name: 'Morty Smith', 
      species: 'Human', 
      image: 'morty.png',
      status: 'Alive',
      gender: 'Male',
      location: { name: 'Earth', url: '' }
    },
  ];
  
  beforeEach(() => {
    useCharacterStore.setState({ selectedCharacters: [] });  });

  
  const renderCardList = (chars: Character[]) => {
    return render(
      <BrowserRouter>
        <ThemeProvider>
          <CardList characters={chars} />
        </ThemeProvider>
      </BrowserRouter>
    );
  };

  it('рендерит правильное количество карточек', () => {   
    renderCardList(mockCharacters);
    
    expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument();
    expect(screen.getByText(/Morty Smith/i)).toBeInTheDocument();
  });

   it('отображает сообщение, если список пуст', () => {
    renderCardList([]); 
    
    expect(screen.getByText(/nothing found/i)).toBeInTheDocument();
  });
});