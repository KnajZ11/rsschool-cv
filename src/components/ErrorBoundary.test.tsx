// rs-react-app\src\components\ErrorBoundary.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test Error');
};

describe('ErrorBoundary', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('должен отображать дочерние элементы, если ошибки нет', () => {
    render(
      <ErrorBoundary>
        <div data-testid="safe-child">Всё хорошо</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('safe-child')).toBeInTheDocument();
    expect(screen.queryByText(/Что-то пошло не так/i)).not.toBeInTheDocument();
  });

  it('должен отображать запасной UI и кнопку "Попробовать снова" при ошибке', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Что-то пошло не так/i)).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /попробовать снова/i });
    expect(button).toBeInTheDocument();

    expect(consoleSpy).toHaveBeenCalled();
  });

  it('должен сбрасывать состояние ошибки при клике на кнопку "Попробовать снова"', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const TestWrapper = ({ shouldThrow }: { shouldThrow: boolean }) => (
      <ErrorBoundary>
        {shouldThrow ? <ThrowError /> : <div>Исправленный контент</div>}
      </ErrorBoundary>
    );

    // 1. Рендерим с ошибкой
    const { rerender } = render(<TestWrapper shouldThrow={true} />);
    expect(screen.getByText(/Что-то пошло не так/i)).toBeInTheDocument();

    // 2. Сначала "исправляем" проп (чтобы при сбросе состояния не вылетела новая ошибка)
    rerender(<TestWrapper shouldThrow={false} />);

    // 3. Теперь кликаем по кнопке сброса
    const button = screen.getByRole('button', { name: /попробовать снова/i });
    fireEvent.click(button);

    // 4. Проверяем результат
    expect(screen.getByText('Исправленный контент')).toBeInTheDocument();
    expect(screen.queryByText(/Что-то пошло не так/i)).not.toBeInTheDocument();
  });
});
