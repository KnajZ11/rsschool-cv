// src/components/EmployeeList.ts
import { Employee, MonthlyData } from '../types';
// ИСПРАВЛЕНО: импортируем getEmployeeTotalCost вместо старых функций
import { deleteEmployee, getEmployeeRevenue, getEmployeeTotalCost } from '../services/dataService';
import { EmployeeForm } from './EmployeeForm';
import { CapacityEditor } from './CapacityEditor';
import { VacationEditor } from './VacationEditor';

export class EmployeeList {
  private container: HTMLElement;
  private tbody!: HTMLTableSectionElement;
  private currentData: MonthlyData | null = null;
  private monthKey: string = '';
  private sortState: { field: string; direction: 'asc' | 'desc' } = { field: 'name', direction: 'asc' };

  constructor(container: HTMLElement) {
    this.container = container;
    this.renderBase();
  }

  private renderBase(): void {
    this.container.innerHTML = `
      <table class="employee-list">
        <thead>
          <tr>
            <th class="sortable" data-field="name">Сотрудник</th>
            <th>Загрузка</th>
            <th>Доход ($)</th>
            <th>Стоимость ($)</th>
            <th>Профит ($)</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    `;
    this.tbody = this.container.querySelector('tbody')!;
    
    this.container.querySelector('thead')!.addEventListener('click', (e) => {
      const th = (e.target as HTMLElement).closest('th');
      if (th?.dataset.field) this.handleSort(th.dataset.field);
    });
  }

  public update(data: MonthlyData, monthKey: string): void {
    this.currentData = data;
    this.monthKey = monthKey;
    this.refresh();
  }

  private refresh(): void {
    if (!this.currentData) return;

    this.container.querySelectorAll('th.sortable').forEach(th => {
      const field = (th as HTMLElement).dataset.field;
      th.classList.toggle('active', field === this.sortState.field);
      if (field === this.sortState.field) {
        th.classList.toggle('asc', this.sortState.direction === 'asc');
        th.classList.toggle('desc', this.sortState.direction === 'desc');
      }
    });

    let employees = [...this.currentData.employees];
    this.applySort(employees);

    this.tbody.innerHTML = '';
    employees.forEach(emp => {
      this.tbody.appendChild(this.buildRow(emp));
    });
  }

  private buildRow(emp: Employee): HTMLTableRowElement {
    const tr = document.createElement('tr');
    
    // 1. Расчет загрузки
    const totalCapacity = emp.assignments.reduce((sum, a) => sum + a.capacity, 0);
    const capacityStatus = totalCapacity > 1.2 ? 'overload' : totalCapacity < 0.5 ? 'warning' : 'normal';

    // 2. Расчет финансов (ИСПРАВЛЕНО СОГЛАСНО ТЗ)
    let totalRevenue = 0;
    
    // Считаем выручку по каждому проекту
    emp.assignments.forEach(assign => {
      const project = this.currentData?.projects.find(p => p.id === assign.projectId);
      if (project && this.currentData) {
        totalRevenue += getEmployeeRevenue(emp, project, this.currentData);
      }
    });

    // ИСПРАВЛЕНО: Получаем итоговую стоимость (проекты + бенч) одной функцией
    const totalCost = getEmployeeTotalCost(emp);
    const profit = totalRevenue - totalCost;

    tr.innerHTML = `
      <td>
        <strong>${emp.lastName} ${emp.firstName}</strong><br>
        <span class="badge">${(emp.position || 'N/A').toUpperCase()}</span>
        <small style="display:block; color: gray;">Возраст: ${this.calculateAge(emp.birthDate)}</small>
      </td>
      <td>
        <div class="capacity-bar" style="cursor: pointer" title="Управлять проектами">
          <div class="capacity-fill ${capacityStatus}" style="width: ${Math.min((totalCapacity / 1.5) * 100, 100)}%"></div>
        </div>
        <small>${totalCapacity.toFixed(1)} / 1.5</small>
      </td>
      <td>${Math.round(totalRevenue).toLocaleString()}</td>
      <td title="Включает проектную ставку и частичный бенч (50%)">
        ${Math.round(totalCost).toLocaleString()}
      </td>
      <td class="${profit >= 0 ? 'positive' : 'negative'}">
        <strong>${Math.round(profit).toLocaleString()}</strong>
      </td>
      <td>
        <button class="btn-edit" title="Редактировать">✎</button>
        <button class="btn-vacation" title="Отпуска">📅</button>
        <button class="btn-delete" title="Удалить">✕</button>
      </td>
    `;

    // Обработчики событий
    (tr.querySelector('.capacity-bar') as HTMLElement).onclick = () => {
      new CapacityEditor(this.monthKey, emp.id, () => (window as any).app.update()).show();
    };

    (tr.querySelector('.btn-vacation') as HTMLElement).onclick = () => {
      new VacationEditor(this.monthKey, emp.id, () => (window as any).app.update()).show();
    };

    (tr.querySelector('.btn-edit') as HTMLElement).onclick = () => {
      new EmployeeForm(this.monthKey, () => (window as any).app.update(), emp).show();
    };

    (tr.querySelector('.btn-delete') as HTMLElement).onclick = () => {
      if (confirm(`Удалить сотрудника ${emp.lastName}?`)) {
        deleteEmployee(this.monthKey, emp.id);
        (window as any).app.update(); 
      }
    };

    return tr;
  }

  private handleSort(field: string): void {
    if (this.sortState.field === field) {
      this.sortState.direction = this.sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortState.field = field;
      this.sortState.direction = 'asc';
    }
    this.refresh();
  }

  private applySort(emps: Employee[]): void {
    const { field, direction } = this.sortState;
    const mod = direction === 'asc' ? 1 : -1;

    emps.sort((a, b) => {
      let v1: any, v2: any;
      if (field === 'name') { v1 = a.lastName; v2 = b.lastName; }
      else if (field === 'age') { v1 = a.birthDate; v2 = b.birthDate; }
      else { v1 = (a as any)[field]; v2 = (b as any)[field]; }
      
      return v1 < v2 ? -1 * mod : v1 > v2 ? 1 * mod : 0;
    });
  }

  private calculateAge(dateStr: string): number {
    if (!dateStr) return 0;
    const birth = new Date(dateStr);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return isNaN(age) ? 0 : age;
  }
}