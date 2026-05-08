//src/components/Card.tsx
import { Component } from 'react';
import { type Character } from '../types';

interface CardProps {
  character: Character;
}

class Card extends Component<CardProps> {
  render() {
    const { character } = this.props;
    return (
      <div className="card">
        <img src={character.image} alt={character.name} />
        <p>{character.name}</p>
        <span>{character.species}</span>
      </div>
    );
  }
}

export default Card;