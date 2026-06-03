// rsschool-cv\src\utils\validators.test.ts
import { describe, it, expect } from 'vitest';
import { validateEmailWithoutRegex, createFormSchema } from './validators';

describe('Компьютерно-теоретический модуль: validators.ts', () => {
  it('validateEmailWithoutRegex должен проверять email по всем веткам условий (100% Coverage)', () => {
    // Ветка: Идеально валидные адреса
    expect(validateEmailWithoutRegex('student@rsschool.com')).toBe(true);
    expect(validateEmailWithoutRegex('mentor.react@sub.domain.by')).toBe(true);
    expect(validateEmailWithoutRegex('a@b.cc')).toBe(true);

    // Ветка: Передача пустых значений, пробелов или нестроковых типов
    expect(validateEmailWithoutRegex('')).toBe(false);
    expect(validateEmailWithoutRegex('user name@domain.com')).toBe(false);
    expect(validateEmailWithoutRegex('user@dom ain.com')).toBe(false);

    // Ветка: Отсутствие или дублирование коммерческого символа @
    expect(validateEmailWithoutRegex('student-rsschool.com')).toBe(false);
    expect(validateEmailWithoutRegex('user@sub@domain.com')).toBe(false);

    // Ветка: Пограничные позиции @ (символ на краях строки)
    expect(validateEmailWithoutRegex('@domain.com')).toBe(false);
    expect(validateEmailWithoutRegex('user@')).toBe(false);

    // Ветка: Наличие и позиция точек в доменной части
    expect(validateEmailWithoutRegex('user@domaincom')).toBe(false);
    expect(validateEmailWithoutRegex('user@.com')).toBe(false);
    expect(validateEmailWithoutRegex('user@domain.')).toBe(false);

    // Ветка 29 (Покрытие Uncovered Line #29): Пустые подчасти домена между точками
    expect(validateEmailWithoutRegex('user@domain..com')).toBe(false);
  });

  it('createFormSchema должна генерировать Zod-схему, отсекающую невалидные типы данных', () => {
    const allowedCountries = ['Казахстан', 'Беларусь'];
    const schema = createFormSchema(allowedCountries);

    // Эталонный валидный объект данных для схемы
    const validData = {
      username: 'РИК', // Строго АППЕРКЕЙС
      age: 70, // Целое положительное
      email: 'rick@citadel.com',
      country: 'Казахстан',
      gender: 'male' as const,
      profilePictureUrl: 'data:image/png;base64,fakeString',
      passwordStrength: 'Надежный',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      agreedToTerms: true as const,
    };

    expect(schema.safeParse(validData).success).toBe(true);

    // Проверка ветки валидации Имени (Первая заглавная) и возраста (Положительное число)
    const invalidData = {
      ...validData,
      username: 'рик', // Ошибка: маленькие буквы
      age: -10, // Ошибка: отрицательное число
      country: 'США', // Ошибка: нет в списке Zustand стора
    };

    const result = schema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
