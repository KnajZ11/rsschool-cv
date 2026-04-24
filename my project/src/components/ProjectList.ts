// src/components/ProjectList.ts
import { MonthlyData, Project } from '../types';
import { getEmployeeRevenue, getEmployeeCost, deleteProject, getProjectRate } from '../services/dataService';
import { ProjectForm } from './ProjectForm';

export class ProjectList {
  private tbody: HTMLTableSectionElement;
  private currentData: MonthlyData | null = null;
  private monthKey: string = '';
  private sortState: { field: string; direction: 'asc' | 'desc' } = { field: 'projectName', direction: 'asc' };

  constructor(container: HTMLElement) {
    container.innerHTML = `
      <table class="project-list">
        <thead>
          <tr>
            <th class="sortable" data-field="projectName">Проект</th>
            <th class="sortable" data-field="budget">Бюджет</th>
            <th>Загрузка (Real/Cap)</th>
            <th>Профит</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody id="project-tbody"></tbody>
      </table>
    `;
    this.tbody = container.querySelector('#project-tbody')!;
    this.initSort();
  }

  public update(data: MonthlyData, monthKey: string): void {
    this.currentData = data;
    this.monthKey = monthKey;
    this.refresh();
  }

  private refresh(): void {
    if (!this.currentData) return;

    let projects = [...this.currentData.projects];
    this.applySort(projects);

    this.tbody.innerHTML = '';
    projects.forEach(proj => {
      this.tbody.appendChild(this.buildRow(proj));
    });

    this.updateSortHeaders();
  }

  private buildRow(project: Project): HTMLTableRowElement {
    const tr = document.createElement('tr');
    
    // Считаем показатели проекта
    const stats = this.calculateProjectStats(project.id);
    const profit = stats.revenue - stats.cost;
    tr.innerHTML = `
      <td>
        <strong>${project.projectName}</strong><br>
        <small>${project.companyName}</small>
      </td>
      <td>$${project.budget.toLocaleString()}</td>
      <td>
        <span title="Реальная загрузка / Требуемая емкость">
          ${stats.totalRealCapacity.toFixed(1)} / ${project.capacity || 1.0}
        </span>
      </td>
      <td class="${profit >= 0 ? 'positive' : 'negative'}">
        <strong>$${Math.round(profit).toLocaleString()}</strong>
      </td>
      <td>
        <button class="btn-edit" title="Редактировать">✎</button>
        <button class="btn-delete" title="Удалить">✕</button>
      </td>
    `;

    (tr.querySelector('.btn-edit') as HTMLButtonElement).onclick = () => {
      new ProjectForm(this.monthKey, () => (window as any).app.update(), project).show();
    };

    (tr.querySelector('.btn-delete') as HTMLButtonElement).onclick = () => {
      if (confirm(`Удалить проект "${project.projectName}"?`)) {
        deleteProject(this.monthKey, project.id);
        (window as any).app.update();
      }
    };

    return tr;
  }

  private calculateProjectStats(projectId: string) {
  let revenue = 0;
  let cost = 0;
  let totalRealCapacity = 0;

  if (!this.currentData) return { revenue, cost, totalRealCapacity };

  // 1. Сначала находим сам проект по его ID
  const project = this.currentData.projects.find(p => p.id === projectId);
  if (!project) return { revenue, cost, totalRealCapacity };

  // 2. Проходим по сотрудникам и считаем их вклад именно в ЭТОТ проект
  this.currentData.employees.forEach(emp => {
    const assignment = emp.assignments.find(a => a.projectId === projectId);
    if (assignment) {
      // ПЕРЕДАЕМ ВЕСЬ ОБЪЕКТ project, а не просто ID
      revenue += getEmployeeRevenue(emp, project, this.currentData!);
      cost += getEmployeeCost(emp, project.id);
      totalRealCapacity += assignment.capacity;
    }
  });

  return { revenue, cost, totalRealCapacity };
}

  private initSort(): void {
    const thead = this.tbody.parentElement?.querySelector('thead');
    if (thead) {
      thead.addEventListener('click', (e) => {
        const th = (e.target as HTMLElement).closest('th');
        if (th && th.classList.contains('sortable')) {
          const field = th.dataset.field!;
          this.sortState.direction = (this.sortState.field === field && this.sortState.direction === 'asc') ? 'desc' : 'asc';
          this.sortState.field = field;
          this.refresh();
        }
      });
    }
  }

  private applySort(projects: Project[]): void {
    const { field, direction } = this.sortState;
    const mod = direction === 'asc' ? 1 : -1;
    projects.sort((a, b) => {
      const v1 = (a as any)[field];
      const v2 = (b as any)[field];
      return v1 < v2 ? -1 * mod : v1 > v2 ? 1 * mod : 0;
    });
  }

  private updateSortHeaders(): void {
    this.tbody.parentElement?.querySelectorAll('th.sortable').forEach(th => {
      const field = (th as HTMLElement).dataset.field;
      th.classList.toggle('active', field === this.sortState.field);
      if (field === this.sortState.field) {
        th.classList.toggle('asc', this.sortState.direction === 'asc');
        th.classList.toggle('desc', this.sortState.direction === 'desc');
      }
    });
  }
}