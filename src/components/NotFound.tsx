// rsschool-cv\src\components\NotFound.tsx
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>      
      <h1 className="not-found-title">404 - Страница не найдена</h1>
      <p>Похоже, вы забрели в другое измерение.</p>
      <button className="counter" onClick={() => navigate('/')}>
        Вернуться на главную
      </button>
    </div>
  );
};

export default NotFound;