// src/components/ProjectForm.ts
import { Project } from '../types';
import { addProject, updateProject } from '../services/dataService';

export class ProjectForm {
  constructor(
    private monthKey: string,
    private onSave: () => void,
    private project?: Project // Если передан — режим редактирования
  ) {}

  public show(): void {
    // 1. Находим элементы в index.html
    const overlay = document.getElementById('modal-overlay')!;
    const content = document.getElementById('modal-content')!;
    
    const isEdit = !!this.project;

    // 2. Впрыскиваем только поля формы в modal-content
    content.innerHTML = `
      <h3>${isEdit ? 'Редактировать проект' : 'Новый проект'}</h3>
      <form id="project-form">
        <label>Название проекта *
          <input type="text" name="projectName" required value="${this.project?.projectName || ''}">
        </label>

        <label>Компания / Заказчик *
          <input type="text" name="companyName" required value="${this.project?.companyName || ''}">
        </label>

        <label>Бюджет ($) *
          <input type="number" name="budget" min="0" step="0.01" required value="${this.project?.budget || ''}">
        </label>

        <label>Требуемая ёмкость (capacity) *
          <input type="number" name="capacity" min="0.1" step="0.1" required value="${this.project?.capacity || 1.0}">
        </label>

        <div class="modal-actions-inline" style="margin-top: 20px">
          <button type="submit">${isEdit ? 'Сохранить изменения' : 'Создать проект'}</button>
        </div>
      </form>
    `;

    // 3. Показываем оверлей
    overlay.style.display = 'flex';

    // 4. Логика сохранения
    const form = content.querySelector('#project-form') as HTMLFormElement;
    form.onsubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      
      const projectData = {
        projectName: formData.get('projectName') as string,
        companyName: formData.get('companyName') as string,
        budget: parseFloat(formData.get('budget') as string),
        capacity: parseFloat(formData.get('capacity') as string)
      };

      if (isEdit && this.project) {
        updateProject(this.monthKey, this.project.id, projectData);
      } else {
        addProject(this.monthKey, projectData);
      }

      // Закрываем и обновляем App
      overlay.style.display = 'none';
      this.onSave();
    };
  }
}