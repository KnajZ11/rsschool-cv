// src/components/VacationEditor.ts
import { getOrInitMonthData } from '../services/storageService';
import { updateVacationDays } from '../services/dataService';

export class VacationEditor {
  private selectedDays: Set<number>;
  private daysInMonth: number;
  private monthKey: string;
  private employeeId: string;
  private onSave: () => void;

  constructor(monthKey: string, employeeId: string, onSave: () => void) {
    this.monthKey = monthKey;
    this.employeeId = employeeId;
    this.onSave = onSave;

    const [year, m] = monthKey.split('-').map(Number);
    this.daysInMonth = new Date(year, m, 0).getDate();

    const data = getOrInitMonthData(monthKey);
    const employee = data.employees.find(e => e.id === employeeId);
    this.selectedDays = new Set(employee?.vacationDays || []);
  }

  public show(): void {
    const overlay = document.getElementById('modal-overlay')!;
    const content = document.getElementById('modal-content')!;
    
    overlay.style.display = 'flex';
    content.innerHTML = `
      <h3 style="margin-bottom: 10px;">Дни отпуска</h3>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 15px;">
        Нажмите на рабочий день, чтобы отметить его как отпуск.
      </p>
      <div class="days-grid" id="calendar-grid">
        ${this.generateCalendarHTML()}
      </div>
      <div class="modal-actions" style="margin-top: 20px">
        <button id="save-vacation" class="btn-primary" style="width: 100%">Сохранить изменения</button>
      </div>
    `;

    const grid = content.querySelector('#calendar-grid')!;
    grid.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.day-checkbox') as HTMLButtonElement;
      if (!btn || btn.classList.contains('off')) return; // Игнорируем клики по пустым ячейкам

      const day = parseInt(btn.dataset.day!);
      if (this.selectedDays.has(day)) {
        this.selectedDays.delete(day);
        btn.classList.remove('selected');
        // Синхронизируем с твоим CSS :has(input:checked) если используешь чекбоксы, 
        // но здесь проще управлять классом .selected
      } else {
        this.selectedDays.add(day);
        btn.classList.add('selected');
      }
    });

    (content.querySelector('#save-vacation') as HTMLButtonElement).onclick = () => {
      const daysArray = Array.from(this.selectedDays).sort((a, b) => a - b);
      updateVacationDays(this.monthKey, this.employeeId, daysArray);
      
      overlay.style.display = 'none';
      this.onSave();
    };
  }

  private generateCalendarHTML(): string {
    const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const [year, m] = this.monthKey.split('-').map(Number);
    
    // Определяем день недели для 1-го числа
    const firstDayDate = new Date(year, m - 1, 1);
    let firstDayOfWeek = firstDayDate.getDay(); 
    const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    let html = dayNames.map(d => `<div class="day-header">${d}</div>`).join('');

    // Пустые ячейки в начале месяца
    for (let i = 0; i < offset; i++) {
      html += `<div class="day-checkbox off"></div>`;
    }

    for (let day = 1; day <= this.daysInMonth; day++) {
      const date = new Date(year, m - 1, day);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isSelected = this.selectedDays.has(day);
      
      // Добавляем класс 'selected' для подсветки по твоему стилю
      // И отдельный стиль для выходных, чтобы их было видно
      html += `
        <div class="day-checkbox day ${isSelected ? 'selected' : ''} ${isWeekend ? 'weekend' : ''}" 
             data-day="${day}"
             style="${isWeekend ? 'background: #fff0f0; border-color: #ffdadb;' : ''}">
          ${day}
        </div>
      `;
    }

    return html;
  }
}