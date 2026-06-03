// rsschool-cv\src\utils\validators.ts
import { z } from 'zod';

/**
 * Валидатор Email, спроектированный полностью без регулярных выражений (RegEx).
 * Реализует строгую пошаговую проверку индексов и структуры строки по ТЗ.
 */
export const validateEmailWithoutRegex = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;

  const trimmed = email.trim();

  // Требование: Электронная почта не должна содержать внутренних пробелов
  if (trimmed.includes(' ')) return false;

  // Находим первый и последний индекс коммерческого символа '@'
  const firstAtIdx = trimmed.indexOf('@');
  const lastAtIdx = trimmed.lastIndexOf('@');

  // Требование: Ровно один символ '@', который не может быть первым или последним
  if (firstAtIdx === -1 || firstAtIdx !== lastAtIdx) return false;
  if (firstAtIdx === 0 || firstAtIdx === trimmed.length - 1) return false;

  // Разделяем строку на локальную (левую) и доменную (правую) части
  const localPart = trimmed.slice(0, firstAtIdx);
  const domainPart = trimmed.slice(firstAtIdx + 1);

  // Требование: Непустая левая (локальная) часть
  if (localPart.length === 0) return false;

  // Проверяем точку в доменной части
  const firstDotIdx = domainPart.indexOf('.');
  const lastDotIdx = domainPart.lastIndexOf('.');

  // Требование: Домен как минимум с одной точкой, которая не стоит в начале или конце домена
  if (firstDotIdx === -1) return false;
  if (firstDotIdx === 0 || lastDotIdx === domainPart.length - 1) return false;

  // Требование: Исключаем пустые подчасти между точками (например, 'user@domain..com')
  const domainSubParts = domainPart.split('.');
  const hasEmptySubPart = domainSubParts.some((part) => part.length === 0);
  if (hasEmptySubPart) return false;

  return true;
};

/**
 * Принимает актуальный массив стран из Zustand-стора для валидации поля страны.
 */
export const createFormSchema = (allowedCountries: string[]) => {
  return (
    z
      .object({
        username: z
          .string()
          .min(1, 'Имя обязательно для заполнения')
          .refine(
            // Требование: Первая буква должна быть заглавной
            (val) => val.length > 0 && val === val.toUpperCase(),
            'Первая буква имени обязана быть заглавной'
          ),
        age: z
          .number({ message: 'Возраст должен быть числом' })
          .int('Возраст должен быть целым числом')
          .nonnegative('Отрицательные значения возраста запрещены'), // Требование ТЗ
        email: z
          .string()
          .min(1, 'Поле Email обязательно')
          .refine(
            validateEmailWithoutRegex,
            'Некорректный формат почты (проверка выполнена без RegEx)'
          ),
        country: z
          .string()
          .min(1, 'Необходимо выбрать страну')
          // Требование ТЗ: Страна должна существовать в списке сохраненных стран Zustand
          .refine(
            (val) => allowedCountries.includes(val),
            'Выбранная страна должна соответствовать списку'
          ),
        gender: z.enum(['male', 'female', 'other'], {
          message: 'Пожалуйста, выберите пол из списка',
        }),
        profilePictureUrl: z
          .string()
          .min(1, 'Загрузка аватарки обязательна (тип: png/jpeg, до 2МБ)'),
        passwordStrength: z.string(), // Служебное поле для сохранения сложности в стор
        password: z
          .string()
          .min(6, 'Пароль должен быть длиной не менее 6 символов'),
        confirmPassword: z.string().min(1, 'Подтверждение пароля обязательно'),
        agreedToTerms: z.literal(true, {
          message: 'Вы обязаны принять Условия использования',
        }),
      })
      // Требование ТЗ: Пароли должны совпадать (используем метод .refine() на уровне всей схемы)
      .refine((data) => data.password === data.confirmPassword, {
        message: 'Пароли должны строго совпадать друг с другом',
        path: ['confirmPassword'], // Ошибка жестко привязывается к инпуту подтверждения
      })
  );
};

// Извлекаем строгий TypeScript-тип из возвращаемого значения фабрики Zod схемы.
export type FormFieldsData = z.infer<ReturnType<typeof createFormSchema>>;
