// src/components/Card.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../store/useCharacterStore';
import type { Character } from '../types';

interface CardProps {
  character: Character;
}

const Card: React.FC<CardProps> = ({ character }) => {
  const navigate = useNavigate();
  
  const { selectedCharacters, toggleCharacter } = useCharacterStore();  
  
  const isSelected = selectedCharacters.some((c: Character) => c.id === character.id);
  
  const handleCheckboxClick = (e: React.MouseEvent) => {  
    e.stopPropagation(); 
    toggleCharacter(character);
  };
  
  const handleCardClick = () => {    
    navigate(`/details/${character.id}`);
  };

  return (
    <div 
      className={`card ${isSelected ? 'selected' : ''}`} 
      onClick={handleCardClick}
    >
      {/* Контейнер чекбокса */}
      <div className="checkbox-container" onClick={handleCheckboxClick}>
        <input 
          type="checkbox" 
          checked={isSelected} 
          readOnly
        />
      </div>

      <img src={character.image} alt={character.name} />
      <div className="card-info">
        <h3>{character.name}</h3>
        <p>{character.species}</p>
      </div>
    </div>
  );
};

export default Card;