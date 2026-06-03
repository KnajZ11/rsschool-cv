// rsschool-cv\src\components\PasswordStrength.tsx
import React, { useEffect } from 'react';
import styles from './PasswordStrength.module.css';

interface PasswordStrengthProps {
  password?: string;
  onStrengthCalculated?: (strength: 'Слабый' | 'Средний' | 'Надежный') => void;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  password = '',
  onStrengthCalculated,
}) => {
  // Атомарные проверки соответствия жестким критериям ТЗ
  const criteria = {
    hasDigit: /\d/.test(password), // 1 цифра
    hasUpper: /[A-ZА-Я]/.test(password), // 1 заглавная буква
    hasLower: /[a-zа-я]/.test(password), // 1 строчная буква
    hasSpecial: /[^A-Za-z0-9А-Яа-я\s]/.test(password), // 1 спецсимвол
  };

  // Рассчитываем сумму успешно пройденных барьеров безопасности (от 0 до 4)
  const passedCount = Object.values(criteria).filter(Boolean).length;

  const getStrengthConfig = () => {
    if (!password) {
      return { text: 'Слабый' as const, color: '#e2e8f0', width: '0%' };
    }
    if (passedCount <= 2) {
      return { text: 'Слабый' as const, color: '#e53e3e', width: '33%' };
    }
    if (passedCount === 3) {
      return { text: 'Средний' as const, color: '#dd6b20', width: '66%' };
    }
    return { text: 'Надежный' as const, color: '#38a169', width: '100%' };
  };

  const config = getStrengthConfig();

  // 🛡️ ХУК НАХОДИТСЯ ДО РАННЕГО ВОЗВРАТА: Правила React полностью соблюдены!
  useEffect(() => {
    if (password && onStrengthCalculated) {
      onStrengthCalculated(config.text);
    }
  }, [password, config.text, onStrengthCalculated]);

  // Если пароль пустой, мы скрываем визуальную часть интерфейса,
  // но логика хуков выше уже безопасно выполнилась в правильном порядке
  if (!password) return null;

  return (
    <div className={styles.wrapper} data-testid="password-strength-container">
      <div className={styles.track}>
        <div
          className={styles.bar}
          style={{ width: config.width, backgroundColor: config.color }}
          data-testid="password-strength-bar"
        />
      </div>
      <span className={styles.label} style={{ color: config.color }}>
        Сложность пароля: {config.text}
      </span>
    </div>
  );
};
