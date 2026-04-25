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
    
    const currentData = getOrInitMonthData(this.monthKey);
    const employee = currentData.employees.find(e => e.id === this.employeeId);
    
    if (!employee) return;

    // ФИЛЬТРАЦИЯ: выбираем только те проекты, на которых сотрудника еще нет
    const availableProjects = currentData.projects.filter(p => 
      !employee.assignments.some(a => a.projectId === p.id)
    );

    overlay.style.display = 'flex';
    
    content.innerHTML = `
      <h3>Проекты сотрудника: ${employee.lastName} ${employee.firstName}</h3>
      <div id="current-assignments">
        ${this.renderAssignments(employee.assignments, currentData)}
      </div>
      
      <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
      
      <h4>Добавить новое назначение</h4>
      <form id="assign-form">
        <label>Проект
          <select name="projectId" required>
            <option value="" disabled selected>${availableProjects.length ? 'Выберите проект...' : 'Нет доступных проектов'}</option>
            ${availableProjects.map(p => `<option value="${p.id}">${p.projectName}</option>`).join('')}
          </select>
        </label>
        <div style="display: flex; gap: 10px; margin-top: 10px;">
          <label style="flex: 1;">Загрузка (0.1 - 1.5)
            <input type="number" name="capacity" min="0.1" max="1.5" step="0.1" value="1.0" required>
          </label>
          <label style="flex: 1;">Фитнес (0 - 1.0)
            <input type="number" name="fitness" min="0" max="1" step="0.01" value="1.0" required>
          </label>
        </div>
        <button type="submit" ${availableProjects.length === 0 ? 'disabled' : ''} style="margin-top: 15px; width: 100%;">
          Добавить проект
        </button>
      </form>
    `;

    this.initEvents(content);
  }

  private renderAssignments(assignments: Assignment[], data: MonthlyData): string {
    if (assignments.length === 0) return '<p style="color: gray; text-align: center; padding: 10px;">Нет активных проектов</p>';
    
    return `
      <table class="modal-table" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #eee;">
            <th style="text-align: left; padding: 8px;">Проект</th>
            <th style="text-align: center; padding: 8px;">Cap / Fit</th>
            <th style="text-align: right; padding: 8px;">Удалить</th>
          </tr>
        </thead>
        <tbody>
          ${assignments.map(a => {
            const project = data.projects.find(p => p.id === a.projectId);
            return `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px;">${project?.projectName || '<span style="color:red">Удален</span>'}</td>
                <td style="text-align: center; padding: 8px;">
                  <span class="badge-cap">${a.capacity.toFixed(1)}</span> / 
                  <span class="badge-fit">${a.fitness.toFixed(2)}</span>
                </td>
                <td style="text-align: right; padding: 8px;">
                  <button class="btn-delete-small" data-project-id="${a.projectId}" title="Удалить назначение">✕</button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  }

  private initEvents(content: HTMLElement): void {
    const form = content.querySelector('#assign-form') as HTMLFormElement;
    
    if (form) {
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
          this.onUpdate(); 
          this.show();     
        }
      };
    }

    content.querySelectorAll('.btn-delete-small').forEach(btn => {
      (btn as HTMLButtonElement).onclick = () => {
        const pId = (btn as HTMLButtonElement).dataset.projectId!;
        if (confirm('Удалить назначение сотрудника на этот проект?')) {
          removeAssignment(this.monthKey, this.employeeId, pId);
          this.onUpdate();
          this.show();
        }
      };
    });
  }
}