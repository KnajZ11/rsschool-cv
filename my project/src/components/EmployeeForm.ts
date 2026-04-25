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

    const today = new Date();
    const maxBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
      .toISOString()
      .split('T')[0];

    content.innerHTML = `
      <h3>${isEdit ? 'Редактировать' : 'Добавить'} сотрудника</h3>
      <form id="emp-form">
        <label>Имя: 
          <input name="firstName" value="${this.employee?.firstName || ''}" required placeholder="Имя">
        </label>
        <label>Фамилия: 
          <input name="lastName" value="${this.employee?.lastName || ''}" required placeholder="Фамилия">
        </label>
        <label>Дата рождения: 
          <input type="date" name="birthDate" 
            value="${this.employee?.birthDate || ''}" 
            max="${maxBirthDate}" 
            required>
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
          <input type="number" name="salary" value="${this.employee?.salary || ''}" required min="1" step="1">
        </label>
        
        <div id="form-error" style="color: var(--danger-color); font-size: 0.85rem; margin: 10px 0;"></div>

        <div class="modal-actions" style="margin-top: 20px">
          <button type="submit" class="btn-primary" style="width: 100%">${isEdit ? 'Сохранить изменения' : 'Создать сотрудника'}</button>
        </div>
      </form>
    `;

    overlay.style.display = 'flex';

    const form = content.querySelector('#emp-form') as HTMLFormElement;
    const errorDiv = content.querySelector('#form-error') as HTMLDivElement;

    form.onsubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const birthDateValue = formData.get('birthDate') as string;
      const salary = Number(formData.get('salary'));
      
      // Дополнительная валидация (ТЗ RSSchool это любит)
      if (birthDateValue > maxBirthDate) {
        errorDiv.textContent = 'Сотрудник должен быть совершеннолетним (18+).';
        return;
      }

      if (salary <= 0) {
        errorDiv.textContent = 'Зарплата должна быть положительным числом.';
        return;
      }

      const data = {
        firstName: (formData.get('firstName') as string).trim(),
        lastName: (formData.get('lastName') as string).trim(),
        birthDate: birthDateValue,
        position: formData.get('position') as Position,
        salary: salary,
      };

      try {
        if (isEdit && this.employee) {
          updateEmployee(this.monthKey, this.employee.id, data);
        } else {
          addEmployee(this.monthKey, data);
        }
        
        overlay.style.display = 'none';
        this.onSave();
      } catch (err) {
        errorDiv.textContent = 'Ошибка при сохранении данных.';
      }
    };
  }
}