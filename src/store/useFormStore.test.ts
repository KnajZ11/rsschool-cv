// rsschool-cv\src\store\useFormStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useFormStore } from './useFormStore'; // Теперь этот относительный импорт отработает идеально!

describe('Модуль управления состоянием: Zustand Store', () => {
  beforeEach(() => {
    // Очищаем стейт перед каждым тестом для детерминированности
    useFormStore.getState().clearSubmissions();
  });

  it('addSubmission должен иммутабельно добавлять анкету, генерируя id и дату', () => {
    const store = useFormStore.getState();
    expect(store.submissionsList.length).toBe(0);

    const testSubmission = {
      username: 'СМИТ',
      age: 40,
      email: 'jerry@smith.com',
      country: 'Грузия',
      gender: 'male' as const,
      passwordStrength: 'Слабый',
      profilePictureUrl: 'data:image/jpeg;base64,fakeBytes',
      agreedToTerms: true,
    };

    // Вызываем экшен стора
    store.addSubmission(testSubmission);

    const updatedList = useFormStore.getState().submissionsList;

    // Проверяем накопление истории (Раздел 2)
    expect(updatedList.length).toBe(1);
    expect(updatedList[0].username).toBe('СМИТ');

    // Проверяем автоматическую генерацию технических метаданных на стороне стора
    expect(updatedList[0].id).toBeDefined();
    expect(updatedList[0].id).toBeTypeOf('string');
    expect(updatedList[0].submittedAt).toBeDefined();
  });
});
