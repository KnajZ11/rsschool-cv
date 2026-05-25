// rs-react-app\src\components\ErrorBoundary.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  
  it('должен сбрасывать состояние ошибки при клике на кнопку "Попробовать снова"', async () => {    
    vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const TestWrapper = ({ shouldThrow }: { shouldThrow: boolean }) => (
      <ErrorBoundary>
        {shouldThrow ? <ThrowError /> : <div>Исправленный контент</div>}
      </ErrorBoundary>
    );
    
    const { rerender } = render(<TestWrapper shouldThrow={true} />);
    expect(screen.getByText(/Что-то пошло не так/i)).toBeInTheDocument();
    
    rerender(<TestWrapper shouldThrow={false} />);
    
    const button = screen.getByRole('button', { name: /попробовать снова/i });    
    
    await userEvent.click(button);
    
    expect(screen.getByText('Исправленный контент')).toBeInTheDocument();
    expect(screen.queryByText(/Что-то пошло не так/i)).not.toBeInTheDocument();
  });
});