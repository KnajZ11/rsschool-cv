// rsschool-cv\src\components\UncontrolledForm.tsx
import React, { useState, useRef } from 'react';
import { useFormStore } from '../store/useFormStore';
import { createFormSchema } from '../utils/validators';
import { convertFileToBase64 } from '../utils/fileReader';
import { PasswordStrength } from './PasswordStrength';
import styles from './Form.module.css';

interface UncontrolledFormProps {
  onSuccess: () => void;
}

export const UncontrolledForm: React.FC<UncontrolledFormProps> = ({
  onSuccess,
}) => {
  const { countries, addSubmission } = useFormStore();

  const formRef = useRef<HTMLFormElement>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordValue, setPasswordValue] = useState('');
  const [computedStrength, setComputedStrength] = useState('Слабый');
  const [base64Image, setBase64Image] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Критерий ТЗ: Проверка расширения файла
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        profilePictureUrl: 'Допускаются только форматы PNG и JPEG',
      }));
      return;
    }

    // Критерий ТЗ: Проверка размера файла (лимит 2МБ)
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        profilePictureUrl: 'Максимальный размер файла не должен превышать 2МБ',
      }));
      return;
    }

    try {
      // Переводим бинарный Blob в Base64 строку для сохранения в стор (Функция 4)
      const base64 = await convertFileToBase64(file);
      setBase64Image(base64);

      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.profilePictureUrl;
        return copy;
      });
    } catch {
      setErrors((prev) => ({
        ...prev,
        profilePictureUrl: 'Ошибка при чтении бинарного потока файла',
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({}); // Сброс предыдущего стейта ошибок перед валидацией

    // Нативный сбор данных через объект FormData строго в момент отправки (Пункт 6)
    const formData = new FormData(e.currentTarget);
    const rawAge = formData.get('age');

    // Формируем плоский объект для валидации нашей Zod-схемой
    const rawData = {
      username: formData.get('username') as string,
      age: rawAge ? Number(rawAge) : NaN,
      email: formData.get('email') as string,
      country: formData.get('country') as string,
      gender: formData.get('gender') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      profilePictureUrl: base64Image,
      passwordStrength: computedStrength,
      agreedToTerms: formData.get('agreedToTerms') === 'on',
    };

    // Инициализируем схему, передавая массив валидных стран из Zustand стора
    const schema = createFormSchema(countries);

    const result = schema.safeParse(rawData);

    // Если валидация Zod завершилась провалом (Функция 5)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // Раздел 2: Если данные валидны, отправляем их в глобальный стейт-менеджер Zustand
    addSubmission(result.data);

    // Критерий Пункт 6: Полный сброс полей формы и очистка локальных стейтов
    formRef.current?.reset();
    setBase64Image('');
    setPasswordValue('');

    onSuccess();
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={styles.form}
      noValidate
    >
      {/* Критерий ТЗ: Жесткая связка тегов label с инпутами через атрибуты htmlFor и id */}
      <div className={styles.fieldGroup}>
        <label htmlFor="unc-username">Имя пользователя:</label>
        <input id="unc-username" name="username" type="text" />
        {errors.username && (
          <span className={styles.error}>{errors.username}</span>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="unc-age">Возраст:</label>
        <input id="unc-age" name="age" type="number" />
        {errors.age && <span className={styles.error}>{errors.age}</span>}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="unc-email">Электронная почта:</label>
        <input id="unc-email" name="email" type="email" />
        {errors.email && <span className={styles.error}>{errors.email}</span>}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="unc-country">
          Страна проживания (Автозаполнение из Zustand):
        </label>
        {/* Функция 4: Автозаполнение по странам нативного типа через тег datalist */}
        <input
          id="unc-country"
          name="country"
          type="text"
          list="unc-countries-list"
        />
        <datalist id="unc-countries-list">
          {countries.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        {errors.country && (
          <span className={styles.error}>{errors.country}</span>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="unc-gender">Пол:</label>
        <select id="unc-gender" name="gender">
          <option value="">-- Выберите пол --</option>
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
          <option value="other">Другой</option>
        </select>
        {errors.gender && <span className={styles.error}>{errors.gender}</span>}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="unc-password">Пароль:</label>
        <input
          id="unc-password"
          name="password"
          type="password"
          onChange={(e) => setPasswordValue(e.target.value)}
        />
        {/* Подключаем переиспользуемый индикатор надежности пароля */}
        <PasswordStrength
          password={passwordValue}
          onStrengthCalculated={setComputedStrength}
        />
        {errors.password && (
          <span className={styles.error}>{errors.password}</span>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="unc-confirmPassword">Подтвердите пароль:</label>
        <input
          id="unc-confirmPassword"
          name="confirmPassword"
          type="password"
        />
        {errors.confirmPassword && (
          <span className={styles.error}>{errors.confirmPassword}</span>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="unc-file">Аватар профиля (PNG/JPEG, до 2МБ):</label>
        <input
          id="unc-file"
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
        />
        {errors.profilePictureUrl && (
          <span className={styles.error}>{errors.profilePictureUrl}</span>
        )}
      </div>

      <div className={styles.checkboxGroup}>
        <input id="unc-terms" name="agreedToTerms" type="checkbox" />
        <label htmlFor="unc-terms">Я принимаю Условия использования</label>
        {errors.agreedToTerms && (
          <span className={styles.errorBlock}>{errors.agreedToTerms}</span>
        )}
      </div>

      {/* Кнопка отправки Uncontrolled формы ВСЕГДА активна по ТЗ — валидация только при клике */}
      <button type="submit" className={styles.submitBtn}>
        Отправить (Uncontrolled)
      </button>
    </form>
  );
};
