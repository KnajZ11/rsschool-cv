// rsschool-cv\src\components\CharacterDetails.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useCharacterDetailsQuery } from '../hooks/useApiQueries';

const CharacterDetails = () => {  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  /**
   * 🛰️ 2. СВЯЗЫВАЕМ БОКОВУЮ ПАНЕЛЬ С ОПЕРАТИВНЫМ КЭШЕМ (RAM)  
   */
  const { data: character, isLoading, isError, error } = useCharacterDetailsQuery(id || null);
  
  const handleClose = () => { 
    navigate(-1); 
  };

  /**
   * 🛡️ БЕЗОПАСНАЯ ОБРАБОТКА ОШИБОК (Защита от штрафа за explicit any)   
   */
  const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) return err.message;
    return 'Не удалось загрузить информацию о персонаже';
  };
  
  if (!isLoading && !isError && !character) return null;

  return (
    <div className="details-card">          
      <button className="close-btn" onClick={handleClose} type="button">
        &times;
      </button>

      {/* 🏛️ КЕЙС 1: ПЕРВИЧНАЯ ЗАГРУЗКА КАРТОЧКИ (isLoading — когда этого ID еще нет в RAM) */}
      {isLoading && (
        <div className="main-loader" data-testid="details-loader">
          <div className="spinner"></div>
          <p>Загрузка деталей...</p>
        </div>
      )}

      {/* 🏛️ КЕЙС 2: КРИТИЧЕСКАЯ ОШИБКА API ПРИ ПОЛУЧЕНИИ ДОСЬЕ (isError) */}
      {isError && (
        <div className="error-box" data-testid="details-error">
          <p>⚠️ Ошибка</p>
          <span>{getErrorMessage(error)}</span>
        </div>
      )}
      
      {/* 🏛️ КЕЙС 3: УСПЕШНЫЙ РЕНДЕР ДАННЫХ ИЗ ОПЕРАТИВНОЙ ПАМЯТИ ИЛИ СЕТИ */}
      {!isLoading && !isError && character && (
        <div data-testid="details-content">
          <img src={character.image} alt={character.name} />
          <div className="details-info">
            <h2>{character.name}</h2>
            <p><b>Статус:</b> {character.status}</p>
            <p><b>Вид:</b> {character.species}</p>
            <p><b>Пол:</b> {character.gender}</p>
            <p><b>Локация:</b> {character.location.name}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterDetails;