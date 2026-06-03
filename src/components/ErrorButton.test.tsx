// rs-react-app\src\components\ErrorButton.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { it, expect, vi, describe } from 'vitest';
import ErrorButton from './ErrorButton';

describe('ErrorButton', () => {
  it('должен выбрасывать ошибку при нажатии на кнопку', () => {
    // 1. Скрываем "красноту" в консоли, так как ошибка ожидаемая
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<ErrorButton />);

    // 2. Находим кнопку (убедись, что текст совпадает с тем, что на кнопке)
    const button = screen.getByRole('button');

    // 3. Проверяем, что вызов клика приводит к ошибке (throw)
    expect(() => {
      fireEvent.click(button);
    }).toThrow();

    // 4. Чистим за собой
    consoleSpy.mockRestore();
  });
});
