// rsschool-cv\src\components\UncontrolledForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UncontrolledForm } from './UncontrolledForm';
import { useFormStore } from '../store/useFormStore';

describe('Интеграционные тесты: UncontrolledForm', () => {
  const handleSuccess = vi.fn();

  beforeEach(() => {
    useFormStore.getState().clearSubmissions();
    handleSuccess.mockClear();
  });

  it('должен выводить ошибки валидации под полями при сабмите пустой формы', async () => {
    const user = userEvent.setup();
    render(<UncontrolledForm onSuccess={handleSuccess} />);

    const submitBtn = screen.getByRole('button', {
      name: 'Отправить (Uncontrolled)',
    });

    // Сабмитим пустую форму для триггера safeParse веток ошибок (Функция 5)
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText('Имя обязательно для заполнения')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Возраст должен быть числом')
      ).toBeInTheDocument();
      expect(screen.getByText('Поле Email обязательно')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Загрузка аватарки обязательна (тип: png/jpeg, до 2МБ)'
        )
      ).toBeInTheDocument();
    });
  });

  it('должен успешно обрабатывать загрузку изображения и отправлять FormData в Zustand стор', async () => {
    const user = userEvent.setup();
    render(<UncontrolledForm onSuccess={handleSuccess} />);

    // Симулируем заполнение полей ввода через нативный FormData поток
    await user.type(screen.getByLabelText('Имя пользователя:'), 'САНЧЕЗ');
    await user.type(screen.getByLabelText('Возраст:'), '60');
    await user.type(
      screen.getByLabelText('Электронная почта:'),
      'rick@c137.com'
    );
    await user.type(
      screen.getByLabelText('Страна проживания (Автозаполнение из Zustand):'),
      'Казахстан'
    );
    await user.selectOptions(screen.getByLabelText('Пол:'), 'male');
    await user.type(screen.getByLabelText('Пароль:'), 'WubbaLubba123!');
    await user.type(
      screen.getByLabelText('Подтвердите пароль:'),
      'WubbaLubba123!'
    );

    // Симулируем успешную загрузку изображения для покрытия FileReader (fileReader.ts строк 10-31)
    const fileInput = screen.getByLabelText(
      'Аватар профиля (PNG/JPEG, до 2МБ):'
    );
    const fakeBlob = new Blob(['image-content'], { type: 'image/png' });
    const fakeFile = new File([fakeBlob], 'avatar.png', { type: 'image/png' });

    await user.upload(fileInput, fakeFile);

    // Принимаем соглашения
    await user.click(screen.getByLabelText('Я принимаю Условия использования'));

    const submitBtn = screen.getByRole('button', {
      name: 'Отправить (Uncontrolled)',
    });
    await user.click(submitBtn);

    // Ожидаем завершения асинхронной операции FileReader и сабмита в стор
    await waitFor(() => {
      expect(handleSuccess).toHaveBeenCalledTimes(1);
      const list = useFormStore.getState().submissionsList;
      expect(list.length).toBe(1);
      expect(list[0].username).toBe('САНЧЕЗ');
      expect(
        list[0].profilePictureUrl.startsWith('data:image/png;base64,')
      ).toBe(true);
    });
  });
});
