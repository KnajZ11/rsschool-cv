// rs-react-app\src\components\Card.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Card from './Card';
import { type Character } from '../types';

describe('Card Component', () => { 
  const mockCharacter: Character = {
    id: 1,
    name: 'Rick Sanchez',
    image: 'https://rickandmortyapi.com/',
    species: 'Human',   
  };

  it('должен успешно отрендерить имя персонажа', () => {
    render(<Card character={mockCharacter} />);
    
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('должен отображать вид (species) персонажа', () => {
    render(<Card character={mockCharacter} />);
    
    expect(screen.getByText('Human')).toBeInTheDocument();
  });

 it('должен рендерить изображение с правильным URL и alt-текстом', () => {
    render(<Card character={mockCharacter} />);
    
    const img = screen.getByRole('img') as HTMLImageElement;
    
    expect(img).toBeInTheDocument(); 
    expect(img.src).toContain(mockCharacter.image); 
    expect(img.alt).toBe(mockCharacter.name);
  });
});
