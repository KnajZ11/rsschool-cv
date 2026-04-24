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

    // Расчет количества дней в месяце
    const [year, m] = monthKey.split('-').map(Number);
    this.daysInMonth = new Date(year, m, 0).getDate();

    // Загрузка текущих данных отпуска
    const data = getOrInitMonthData(monthKey);
    const employee = data.employees.find(e => e.id === employeeId);
    this.selectedDays = new Set(employee?.vacationDays || []);
  }

  public show(): void {
    const overlay = document.getElementById('modal-overlay')!;
    const content = document.getElementById('modal-content')!;
    
    overlay.style.display = 'flex';
    content.innerHTML = `
      <h3>Выберите дни отпуска</h3>
      <div class="vacation-calendar" id="calendar-grid">
        ${this.generateCalendarHTML()}
      </div>
      <div class="modal-actions-inline" style="margin-top: 20px">
        <button id="save-vacation">Сохранить</button>
      </div>
    `;

    // Делегирование события клика на сетку календаря
    const grid = content.querySelector('#calendar-grid')!;
    grid.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.day') as HTMLButtonElement;
      if (!btn) return;

      const day = parseInt(btn.dataset.day!);
      if (this.selectedDays.has(day)) {
        this.selectedDays.delete(day);
        btn.classList.remove('selected');
      } else {
        this.selectedDays.add(day);
        btn.classList.add('selected');
      }
    });

    // Кнопка сохранения
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
    const firstDay = new Date(year, m - 1, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;

    let html = dayNames.map(d => `<div class="day-header">${d}</div>`).join('');

    for (let i = 0; i < offset; i++) {
      html += `<div class="empty"></div>`;
    }

    for (let day = 1; day <= this.daysInMonth; day++) {
      const isSelected = this.selectedDays.has(day);
      html += `
        <button type="button" class="day ${isSelected ? 'selected' : ''}" data-day="${day}">
          ${day}
        </button>
      `;
    }

    return html;
  }
}