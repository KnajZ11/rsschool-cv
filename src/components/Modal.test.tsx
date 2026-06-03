// rsschool-cv\src\components\Modal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from './Modal';

describe('Интерфейсный модуль: Компонент Modal (React Portals & A11y)', () => {
  it('декларативно возвращает null и не рендерится в DOM, если isOpen === false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Скрытое окно">
        <div data-testid="modal-content">Контент внутри</div>
      </Modal>
    );
    expect(screen.queryByTestId('modal-content')).toBeNull();
  });

  it('физически монтирует разметку в document.body, если isOpen === true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Тестовое окно">
        <div data-testid="modal-content">Контент внутри</div>
      </Modal>
    );
    expect(screen.getByText('Тестовое окно')).toBeInTheDocument();
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
  });

  it('должен вызывать onClose при нажатии физической клавиши Escape', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Окно">
        <div>Контент</div>
      </Modal>
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('должен закрываться при клике на затененный overlay фон за пределами контейнера', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Окно">
        <div>Контент</div>
      </Modal>
    );

    const overlay = screen.getByRole('presentation');
    fireEvent.click(overlay);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('НЕ должен закрываться при клике внутрь контейнера', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Окно">
        <button data-testid="inside-btn">Внутри</button>
      </Modal>
    );

    fireEvent.click(screen.getByTestId('inside-btn'));
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('должен циклически удерживать фокус внутри контейнера в обоих направлениях (Focus Trap - 100% Coverage)', async () => {
    const user = userEvent.setup();
    render(
      <Modal isOpen={true} onClose={() => {}} title="Ловушка фокуса">
        <button data-testid="btn-1">Элемент 1</button>
        <button data-testid="btn-2">Элемент 2</button>
      </Modal>
    );

    const closeBtn = screen.getByLabelText('Закрыть модальное окно');
    const btn1 = screen.getByTestId('btn-1');
    const btn2 = screen.getByTestId('btn-2');

    // Первичный фокус падает на крестик закрытия (строка 45 в Modal.tsx)
    expect(document.activeElement).toBe(closeBtn);

    // Движение ВПЕРЕД: Нажимаем Tab -> переходим на btn-1
    await user.tab();
    expect(document.activeElement).toBe(btn1);

    // Нажимаем Tab -> переходим на btn-2
    await user.tab();
    expect(document.activeElement).toBe(btn2);

    // Нажимаем Tab на последнем элементе -> фокус циклически возвращается на крестик
    await user.tab();
    expect(document.activeElement).toBe(closeBtn);

    // Движение НАЗАД (Покрытие строк 61-63 в Modal.tsx):
    // Зажимаем Shift + Tab находясь на самом первом элементе (крестике) -> фокус должен прыгнуть на самый последний (btn-2)
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(btn2);
  });
});
