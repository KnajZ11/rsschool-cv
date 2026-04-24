// src/components/ProjectForm.ts
import { Project } from '../types';
import { addProject, updateProject, assignEmployee } from '../services/dataService';
import { getOrInitMonthData } from '../services/storageService';

// ВАЖНО: Добавлен export
export class ProjectForm {
  constructor(
    private monthKey: string,
    private onSave: () => void,
    private project?: Project
  ) {}

  public show(): void {
    const overlay = document.getElementById('modal-overlay')!;
    const content = document.getElementById('modal-content')!;    
    const isEdit = !!this.project;
    
    // Получаем список сотрудников для быстрого назначения (только при создании)
    const monthData = getOrInitMonthData(this.monthKey);

    content.innerHTML = `
      <h3>${isEdit ? 'Редактировать проект' : 'Новый проект'}</h3>
      <form id="project-form">
        <label>Название проекта *
          <input type="text" name="projectName" required value="${this.project?.projectName || ''}">
        </label>

        <label>Компания / Заказчик *
          <input type="text" name="companyName" required value="${this.project?.companyName || ''}">
        </label>

        <label>Бюджет проекта ($) *
          <input type="number" name="budget" min="1" step="0.01" required value="${this.project?.budget || ''}">
        </label>

        <label title="Целевое количество сотрудников. Влияет на доходность.">
          Требуемая ёмкость (capacity) *
          <input type="number" name="capacity" min="0.1" step="0.1" required value="${this.project?.capacity || 1.0}">
        </label>

        <!-- Блок быстрого назначения сотрудника (только при создании) -->
        ${!isEdit ? `
        <div style="background: #f9f9f9; padding: 12px; border-radius: 8px; margin: 15px 0; border: 1px dashed #ccc;">
          <h4 style="margin: 0 0 10px 0;">Назначить сотрудника сразу</h4>
          <label>Выбрать из команды:
            <select name="initialEmployeeId">
              <option value="">-- Не назначать --</option>
              ${monthData.employees.map(e => `
                <option value="${e.id}">${e.lastName} ${e.firstName} (ЗП: ${e.salary})</option>
              `).join('')}
            </select>
          </label>
          <label>Загрузка (capacity):
            <input type="number" name="empLoad" min="0.1" max="1.5" step="0.1" value="1.0">
          </label>
        </div>
        ` : ''}

        <div class="modal-actions-inline" style="margin-top: 20px">
          <button type="submit" class="btn-primary">${isEdit ? 'Сохранить изменения' : 'Создать проект'}</button>
        </div>
      </form>
    `;

    overlay.style.display = 'flex';

    const form = content.querySelector('#project-form') as HTMLFormElement;
    form.onsubmit = (e: Event) => {
      e.preventDefault();
      const formData = new FormData(form);
      
      const projectData = {
        projectName: formData.get('projectName') as string,
        companyName: formData.get('companyName') as string,
        budget: parseFloat(formData.get('budget') as string) || 0,
        capacity: parseFloat(formData.get('capacity') as string) || 1.0
      };

      if (isEdit && this.project) {
        updateProject(this.monthKey, this.project.id, projectData);
      } else {
        // 1. Создаем проект
        addProject(this.monthKey, projectData);
        
        // 2. Находим созданный проект (последний)
        const updatedMonth = getOrInitMonthData(this.monthKey);
        const createdProject = updatedMonth.projects[updatedMonth.projects.length - 1];

        // 3. Назначаем сотрудника, если он выбран
        const employeeId = formData.get('initialEmployeeId') as string;
        const empLoad = parseFloat(formData.get('empLoad') as string);

        if (employeeId && createdProject) {
          assignEmployee(this.monthKey, employeeId, createdProject.id, empLoad, 1.0);
        }
      }

      overlay.style.display = 'none';
      this.onSave(); 
    };
  }
}