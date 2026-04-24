// src/components/EmployeeForm.ts
import { addEmployee, updateEmployee } from '../services/dataService';
import { Employee, Position } from '../types';

export class EmployeeForm {
  constructor(
    private monthKey: string,
    private onSave: () => void,
    private employee?: Employee
  ) {}

  public show(): void {
    const overlay = document.getElementById('modal-overlay')!;
    const content = document.getElementById('modal-content')!;
    const isEdit = !!this.employee;
    const positions: Position[] = ['junior', 'middle', 'senior', 'lead', 'architect', 'BO'];

    content.innerHTML = `
      <h3>${isEdit ? 'Редактировать' : 'Добавить'} сотрудника</h3>
      <form id="emp-form">
        <label>Имя: 
          <input name="firstName" value="${this.employee?.firstName || ''}" required>
        </label>
        <label>Фамилия: 
          <input name="lastName" value="${this.employee?.lastName || ''}" required>
        </label>
        <label>Дата рождения: 
          <input type="date" name="birthDate" value="${this.employee?.birthDate || ''}" required>
        </label>
        <label>Позиция: 
          <select name="position" required>
            ${positions.map(p => `
              <option value="${p}" ${this.employee?.position === p ? 'selected' : ''}>
                ${p.toUpperCase()}
              </option>
            `).join('')}
          </select>
        </label>
        <label>Зарплата ($): 
          <input type="number" name="salary" value="${this.employee?.salary || ''}" required min="1">
        </label>
        
        <div class="modal-actions-inline" style="margin-top: 20px">
          <button type="submit" class="btn-primary">${isEdit ? 'Сохранить' : 'Создать'}</button>
        </div>
      </form>
    `;

    overlay.style.display = 'flex';

    const form = content.querySelector('#emp-form') as HTMLFormElement;
    form.onsubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      const data = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        birthDate: formData.get('birthDate') as string,
        position: formData.get('position') as Position,
        salary: Number(formData.get('salary')),
      };

      if (isEdit && this.employee) {
        updateEmployee(this.monthKey, this.employee.id, data);
      } else {
        addEmployee(this.monthKey, data);
      }

      overlay.style.display = 'none';
      this.onSave();
    };
  }
}