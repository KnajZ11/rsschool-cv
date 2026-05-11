// rsschool-cv\src\components\CharacterDetails.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { type Character } from '../types';

const CharacterDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  const fetchSingleCharacter = async () => {
    if (!id) return;
    setIsLoading(true);
    try {      
      const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
      
      if (!response.ok) throw new Error('Ошибка сети');
      
      const data = await response.json();
      setCharacter(data);
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchSingleCharacter();
}, [id]);

  const handleClose = () => { 
    navigate(-1); 
  };

  if (isLoading) return <div className="loader">Загрузка деталей...</div>;
  if (!character) return null;

return (
  <div className="details-card">    
    <button className="close-btn" onClick={handleClose}>
      &times;
    </button>
    
    <img src={character.image} alt={character.name} />
    <div className="details-info">
      <h2>{character.name}</h2>
      <p><b>Статус:</b> {character.status}</p>
      <p><b>Вид:</b> {character.species}</p>
      <p><b>Пол:</b> {character.gender}</p>
      <p><b>Локация:</b> {character.location.name}</p>
    </div>
  </div>
);
};

export default CharacterDetails;