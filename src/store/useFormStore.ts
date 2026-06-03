// rsschool-cv\src\store\useFormStore.ts
import { create } from 'zustand';

// 1. Описываем интерфейс структуры анкеты (Раздел 2 и Функция 4)
export interface UserSubmission {
  id: string; // Автогенерация: уникальный UUID карточки
  username: string; // Поле: Имя
  age: number; // Поле: Возраст
  email: string; // Поле: Email (проверенный вручную без RegEx)
  country: string; // Поле: Страна (выбранная из автокомплита)
  gender: 'male' | 'female' | 'other'; // Поле: Пол (строгий enum)
  passwordStrength: string; // Поле: Сложность пароля (из индикатора надежности)
  profilePictureUrl: string; // Поле: Аватар (Base64 текстовая строка)
  agreedToTerms: boolean; // Поле: Чекбокс согласия с Условиями
  submittedAt: string; // Метаданные: ISO штамп времени добавления
}

// 2. Описываем интерфейс самого хранилища (State и Actions)
interface FormState {
  countries: string[]; // Справочник стран для автозаполнения
  submissionsList: UserSubmission[]; // Накопительный массив истории анкет
  addSubmission: (
    submission: Omit<UserSubmission, 'id' | 'submittedAt'>
  ) => void;
  clearSubmissions: () => void;
}

export const useFormStore = create<FormState>((set) => ({
  countries: [
    'Казахстан',
    'Беларусь',
    'Узбекистан',
    'Грузия',
    'Армения',
    'Азербайджан',
    'Кыргызстан',
  ],

  submissionsList: [],

  addSubmission: (data) => {
    const newSubmission: UserSubmission = {
      ...data,
      id: crypto.randomUUID(),
      submittedAt: new Date().toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    };

    set((state) => ({
      // Иммутабельный спред массива без прямых мутаций (Раздел 2)
      submissionsList: [...state.submissionsList, newSubmission],
    }));
  },

  clearSubmissions: () => set({ submissionsList: [] }),
}));
