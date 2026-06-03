// rsschool-cv\src\components\SubmissionsGrid.tsx
import React from 'react';
import { useFormStore } from '../store/useFormStore';
import styles from './SubmissionsGrid.module.css';

export const SubmissionsGrid: React.FC = () => {
  // Реактивно подписываемся на массив истории анкет из Zustand стора (Раздел 2)
  const submissionsList = useFormStore((state) => state.submissionsList);

  // Если история пуста, выводим семантическую заглушку
  if (submissionsList.length === 0) {
    return (
      <p className={styles.empty}>История отправленных анкет пока пуста.</p>
    );
  }

  return (
    <div className={styles.grid} data-testid="submissions-grid">
      {submissionsList.map((sub) => (
        <div key={sub.id} className={styles.card} data-testid="submission-card">
          {/* Выводим аватарку напрямую из строки Base64, сохраненной на Этапе 3 */}
          <img
            src={sub.profilePictureUrl}
            alt={sub.username}
            className={styles.avatar}
          />

          <div className={styles.cardContent}>
            <h3 className={styles.name}>{sub.username}</h3>
            <p>
              <strong>Возраст:</strong> {sub.age}
            </p>
            <p>
              <strong>Email:</strong> {sub.email}
            </p>
            <p>
              <strong>Страна:</strong> {sub.country}
            </p>
            <p>
              <strong>Пол:</strong>{' '}
              {sub.gender === 'male'
                ? 'Мужской'
                : sub.gender === 'female'
                  ? 'Женский'
                  : 'Другой'}
            </p>

            {/* Стилизованный бейдж сложности пароля на чистом CSS */}
            <span className={styles.badge} data-strength={sub.passwordStrength}>
              Пароль: {sub.passwordStrength}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
