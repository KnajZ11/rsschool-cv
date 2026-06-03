// rsschool-cv\src\components\ControlledForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ControlledForm } from './ControlledForm';
import { useFormStore } from '../store/useFormStore';

describe('Интеграционные тесты: ControlledForm (React Hook Form)', () => {
  const handleSuccess = vi.fn();

  beforeEach(() => {
    // 🛡️ Исправлено: корректное обращение к именованному хуку Zustand стора
    useFormStore.getState().clearSubmissions();
    handleSuccess.mockClear();
  });

  it('должен фильтровать кастомный dropdown список стран при вводе символов', async () => {
    const user = userEvent.setup();
    render(<ControlledForm onSuccess={handleSuccess} />);

    const countryInput = screen.getByLabelText(
      'Страна проживания (Кастомный автокомплит):'
    );

    // 🛡️ Исправлено: Заменили user.focus на нативный user.click для user-event v14+
    await user.click(countryInput);
    await user.type(countryInput, 'Бел');

    // Ожидаем появление кастомного dropdown списка
    await waitFor(() => {
      const dropdown = screen.getByTestId('country-dropdown');
      expect(dropdown).toBeInTheDocument();
      expect(screen.getByText('Беларусь')).toBeInTheDocument();
    });

    // Кликаем по элементу подсказки для закрытия dropdown
    await user.click(screen.getByText('Беларусь'));

    expect(countryInput).toHaveValue('Беларусь');
  });

  it('должен проходить полный валидный цикл и блокировать кнопку при ошибках валидации', async () => {
    const user = userEvent.setup();
    render(<ControlledForm onSuccess={handleSuccess} />);

    const submitBtn = screen.getByRole('button', {
      name: 'Отправить (Controlled)',
    });
    expect(submitBtn).toBeDisabled(); // Кнопка отключена на старте (Функция 5)

    // Заполняем валидные данные
    await user.type(screen.getByLabelText('Имя пользователя:'), 'СМИТ');
    await user.type(screen.getByLabelText('Возраст:'), '45');
    await user.type(
      screen.getByLabelText('Электронная почта:'),
      'jerry@smith.com'
    );

    const countryInput = screen.getByLabelText(
      'Страна проживания (Кастомный автокомплит):'
    );
    await user.click(countryInput);
    await user.type(countryInput, 'Грузия');

    await user.selectOptions(screen.getByLabelText('Пол:'), 'male');
    await user.type(screen.getByLabelText('Пароль:'), 'JerrySmith123!');
    await user.type(
      screen.getByLabelText('Подтвердите пароль:'),
      'JerrySmith123!'
    );

    const fileInput = screen.getByLabelText(
      'Аватар профиля (PNG/JPEG, до 2МБ):'
    );
    const fakeFile = new File(['bytes'], 'jerry.jpg', { type: 'image/jpeg' });
    await user.upload(fileInput, fakeFile);

    await user.click(screen.getByLabelText('Я принимаю Условия использования'));

    // Ожидаем активации валентной валидации RHF в реальном времени
    await waitFor(() => {
      expect(submitBtn).not.toBeDisabled();
    });

    await user.click(submitBtn);
    expect(handleSuccess).toHaveBeenCalledTimes(1);
  });
});
