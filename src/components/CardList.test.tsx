// rs-react-app\src\components\CardList.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CardList from './CardList';
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

  it('рендерит правильное количество карточек', () => {   
    render(<CardList characters={mockCharacters} />);
    
    expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument();
    expect(screen.getByText(/Morty Smith/i)).toBeInTheDocument();
  });

  it('отображает сообщение, если список пуст', () => {
    render(<CardList characters={[]} />);
 
    expect(screen.getByText(/nothing found|ничего не найдено/i)).toBeInTheDocument();
  });
});
