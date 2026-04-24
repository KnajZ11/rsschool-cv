// src/components/ProjectList.ts
import { MonthlyData, Project } from '../types';
import { getRevenue, getCost, deleteProject, getProjectRate } from '../services/dataService';
import { ProjectForm } from './ProjectForm';

export class ProjectList {
  private tbody: HTMLTableSectionElement;
  private currentData: MonthlyData | null = null;
  private monthKey: string = '';
  private sortState: { field: string; direction: 'asc' | 'desc' } = { field: 'projectName', direction: 'asc' };

  constructor(container: HTMLElement) {
    // В index.html уже есть каркас таблицы, создаем только tbody один раз
    container.innerHTML = `
      <table class="project-list">
        <thead>
          <tr>
            <th class="sortable" data-field="projectName">Название</th>
            <th class="sortable" data-field="budget">Бюджет</th>
            <th>Ставка</th>
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
    
    // Считаем показатели проекта через общие сервисы
    const stats = this.calculateProjectStats(project.id);
    const profit = stats.revenue - stats.cost;
    const rate = getProjectRate(project);

    tr.innerHTML = `
      <td><strong>${project.projectName}</strong><br><small>${project.companyName}</small></td>
      <td>$${project.budget.toLocaleString()}</td>
      <td>$${rate.toFixed(0)}</td>
      <td class="${profit >= 0 ? 'positive' : 'negative'}">
        $${profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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

    this.currentData?.employees.forEach(emp => {
      const assignment = emp.assignments.find(a => a.projectId === projectId);
      if (assignment) {
        const project = this.currentData?.projects.find(p => p.id === projectId);
        if (project) {
          revenue += getRevenue(emp, project);
          cost += getCost(emp, project);
        }
      }
    });

    return { revenue, cost };
  }

  private initSort(): void {
    this.tbody.parentElement?.querySelector('thead')?.addEventListener('click', (e) => {
      const th = (e.target as HTMLElement).closest('th');
      if (th && th.classList.contains('sortable')) {
        const field = th.dataset.field!;
        this.sortState.direction = (this.sortState.field === field && this.sortState.direction === 'asc') ? 'desc' : 'asc';
        this.sortState.field = field;
        this.refresh();
      }
    });
  }

  private applySort(projects: Project[]): void {
    const { field, direction } = this.sortState;
    projects.sort((a, b) => {
      const v1 = (a as any)[field];
      const v2 = (b as any)[field];
      const modifier = direction === 'asc' ? 1 : -1;
      return v1 < v2 ? -1 * modifier : v1 > v2 ? 1 * modifier : 0;
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