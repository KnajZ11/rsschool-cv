// rs-react-app\src\components\CardList.tsx
import { Component } from 'react';
import Card from './Card';
import { type Character } from '../types';

interface CardListProps {
  characters: Character[];
}

class CardList extends Component<CardListProps> {
  render() {
    const { characters } = this.props;

    if (characters.length === 0) {
      return <div>Nothing found</div>;
    }

    return (
      <div className="card-list">
        {characters.map((char) => (
          <Card key={char.id} character={char} />
        ))}
      </div>
    );
  }
}

export default CardList;