// src/components/CapacityEditor.ts
import { Assignment, MonthlyData } from '../types';
import { getOrInitMonthData } from '../services/storageService';
import { assignEmployee, removeAssignment } from '../services/dataService';

export class CapacityEditor {
  constructor(
    private monthKey: string,
    private employeeId: string,
    private onUpdate: () => void
  ) {}

  public show(): void {
    const overlay = document.getElementById('modal-overlay')!;
    const content = document.getElementById('modal-content')!;
    
    // ВАЖНО: Получаем СВЕЖИЕ данные каждый раз при вызове show()
    const currentData = getOrInitMonthData(this.monthKey);
    const employee = currentData.employees.find(e => e.id === this.employeeId);
    
    if (!employee) return;

    overlay.style.display = 'flex';
    
    content.innerHTML = `
      <h3>Проекты сотрудника: ${employee.lastName}</h3>
      <div id="current-assignments">
        ${this.renderAssignments(employee.assignments, currentData)}
      </div>
      
      <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
      
      <h4>Добавить новое назначение</h4>
      <form id="assign-form">
        <label>Проект
          <select name="projectId" required>
            <option value="" disabled selected>Выберите проект...</option>
            ${currentData.projects.map(p => `<option value="${p.id}">${p.projectName}</option>`).join('')}
          </select>
        </label>
        <label>Загрузка (0.1 - 1.5)
          <input type="number" name="capacity" min="0.1" max="1.5" step="0.1" value="1.0" required>
        </label>
        <label>Фитнес-фактор (0 - 1.0)
          <input type="number" name="fitness" min="0" max="1" step="0.01" value="1.0" required>
        </label>
        <button type="submit" style="margin-top: 10px; width: 100%;">Добавить проект</button>
      </form>
    `;

    this.initEvents(content);
  }

  private renderAssignments(assignments: Assignment[], data: MonthlyData): string {
    if (assignments.length === 0) return '<p class="text-muted">Нет активных проектов</p>';
    
    return `
      <table class="employee-list">
        <thead>
          <tr>
            <th>Проект</th>
            <th>Cap/Fit</th>
            <th>Удалить</th>
          </tr>
        </thead>
        <tbody>
          ${assignments.map(a => {
            const project = data.projects.find(p => p.id === a.projectId);
            return `
              <tr>
                <td>${project?.projectName || 'Удаленный проект'}</td>
                <td>${a.capacity} / ${a.fitness}</td>
                <td><button class="btn-delete" data-project-id="${a.projectId}">✕</button></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  }

  private initEvents(content: HTMLElement): void {
    const form = content.querySelector('#assign-form') as HTMLFormElement;    
    form.onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(form);      
      const result = assignEmployee(
        this.monthKey, 
        this.employeeId, 
        fd.get('projectId') as string, 
        parseFloat(fd.get('capacity') as string), 
        parseFloat(fd.get('fitness') as string)
      );

      if (!result.success) {
        alert(result.error);
      } else {
        this.onUpdate(); // Обновляем главное окно (App)
        this.show();     // Перерисовываем текущее окно со свежими данными
      }
    };
    content.querySelectorAll('.btn-delete').forEach(btn => {
      (btn as HTMLButtonElement).onclick = () => {
        const pId = (btn as HTMLButtonElement).dataset.projectId!;
        removeAssignment(this.monthKey, this.employeeId, pId);
        this.onUpdate();
        this.show();
      };
    });
  }
}