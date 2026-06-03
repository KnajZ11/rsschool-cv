// rsschool-cv\src\components\ControlledForm.tsx
import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormStore } from '../store/useFormStore';
import { createFormSchema } from '../utils/validators';
import type { FormFieldsData } from '../utils/validators';
import { convertFileToBase64 } from '../utils/fileReader';
import { PasswordStrength } from './PasswordStrength';
import styles from './Form.module.css';

interface ControlledFormProps {
  onSuccess: () => void;
}

export const ControlledForm: React.FC<ControlledFormProps> = ({
  onSuccess,
}) => {
  const { countries, addSubmission } = useFormStore();

  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [fileError, setFileError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<FormFieldsData>({
    resolver: zodResolver(createFormSchema(countries)),
    mode: 'onChange',
  });

  const passwordWatch = useWatch({
    control,
    name: 'password',
    defaultValue: '',
  });
  const countryWatch = useWatch({ control, name: 'country', defaultValue: '' });

  const handleCountryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue('country', value, { shouldValidate: true });

    if (value.trim()) {
      const filtered = countries.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCountries(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setFileError('Разрешены только форматы PNG и JPEG');
      setValue('profilePictureUrl', '', { shouldValidate: true });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFileError('Максимальный размер файла — 2МБ');
      setValue('profilePictureUrl', '', { shouldValidate: true });
      return;
    }

    try {
      const base64 = await convertFileToBase64(file);
      setValue('profilePictureUrl', base64, { shouldValidate: true });
    } catch {
      setFileError('Ошибка при обработке бинарного потока файла');
      setValue('profilePictureUrl', '', { shouldValidate: true });
    }
  };

  const onSubmit = (data: FormFieldsData) => {
    addSubmission(data);
    reset();
    setFileError('');
    onSuccess();
  };

  const renderDropdown = () => {
    if (!showDropdown || filteredCountries.length === 0) return null;

    return (
      <ul className={styles.dropdown} data-testid="country-dropdown">
        {filteredCountries.map((c) => {
          const handleMouseDown = () => {
            setValue('country', c, { shouldValidate: true });
            setShowDropdown(false);
          };
          return (
            <li key={c} onMouseDown={handleMouseDown}>
              {c}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
      <div className={styles.fieldGroup}>
        <label htmlFor="ctrl-username">Имя пользователя:</label>
        <input id="ctrl-username" type="text" {...register('username')} />
        {errors.username && (
          <span className={styles.error}>{errors.username.message}</span>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="ctrl-age">Возраст:</label>
        <input
          id="ctrl-age"
          type="number"
          {...register('age', { valueAsNumber: true })}
        />
        {errors.age && (
          <span className={styles.error}>{errors.age.message}</span>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="ctrl-email">Электронная почта:</label>
        <input id="ctrl-email" type="email" {...register('email')} />
        {errors.email && (
          <span className={styles.error}>{errors.email.message}</span>
        )}
      </div>

      <div className={styles.fieldGroup} style={{ position: 'relative' }}>
        <label htmlFor="ctrl-country">
          Страна проживания (Кастомный автокомплит):
        </label>
        <input
          id="ctrl-country"
          type="text"
          value={countryWatch}
          onChange={handleCountryInput}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
        {renderDropdown()}
        {errors.country && (
          <span className={styles.error}>{errors.country.message}</span>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="ctrl-gender">Пол:</label>
        <select id="ctrl-gender" {...register('gender')}>
          <option value="">-- Выберите пол --</option>
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
          <option value="other">Другой</option>
        </select>
        {errors.gender && (
          <span className={styles.error}>{errors.gender.message}</span>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="ctrl-password">Пароль:</label>
        <input id="ctrl-password" type="password" {...register('password')} />
        <PasswordStrength
          password={passwordWatch}
          onStrengthCalculated={(strength) =>
            setValue('passwordStrength', strength)
          }
        />
        {errors.password && (
          <span className={styles.error}>{errors.password.message}</span>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="ctrl-confirmPassword">Подтвердите пароль:</label>
        <input
          id="ctrl-confirmPassword"
          type="password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <span className={styles.error}>{errors.confirmPassword.message}</span>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="ctrl-file">Аватар профиля (PNG/JPEG, до 2МБ):</label>
        <input
          id="ctrl-file"
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
        />
        <input type="hidden" {...register('profilePictureUrl')} />
        {(fileError || errors.profilePictureUrl) && (
          <span className={styles.error}>
            {fileError || errors.profilePictureUrl?.message}
          </span>
        )}
      </div>

      <div className={styles.checkboxGroup}>
        <input id="ctrl-terms" type="checkbox" {...register('agreedToTerms')} />
        <label htmlFor="ctrl-terms">Я принимаю Условия использования</label>
        {errors.agreedToTerms && (
          <span className={styles.errorBlock}>
            {errors.agreedToTerms.message}
          </span>
        )}
      </div>

      <button type="submit" disabled={!isValid} className={styles.submitBtn}>
        Отправить (Controlled)
      </button>
    </form>
  );
};
