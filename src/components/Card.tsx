//src/components/Card.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { type Character } from '../types';

interface CardProps {
  character: Character;
}

const Card: React.FC<CardProps> = ({ character }) => {
  return (    
    <Link to={`/details/${character.id}`} className="card-link">
      <div className="card">
        <img src={character.image} alt={character.name} />
        <div className="card-info">
          <h3>{character.name}</h3>
          <p>{character.species}</p>
        </div>
      </div>
    </Link>
  );
};
export default Card;