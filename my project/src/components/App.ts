//src/components/App.ts
import { MonthSelector } from './MonthSelector';
import { EmployeeList } from './EmployeeList';
import { ProjectList } from './ProjectList';
import { EmployeeForm } from './EmployeeForm';
import { ProjectForm } from './ProjectForm';
import { getOrInitMonthData } from '../services/storageService';
import { getTotalProfit } from '../services/dataService'; 

export class App {
  private monthKey: string = '';
  private employeeList: EmployeeList;
  private projectList: ProjectList;
  private profitDisplay: HTMLElement;

  constructor() {
    // 1. Инициализация даты
    const now = new Date();
    this.monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    getOrInitMonthData(this.monthKey);

    // 2. Привязка к существующему HTML
    this.profitDisplay = document.getElementById('total-profit')!;
    this.employeeList = new EmployeeList(document.getElementById('employee-list')!);
    this.projectList = new ProjectList(document.getElementById('project-list')!);

    this.initEvents();
    this.update();
  }

    private initEvents() {
    const overlay = document.getElementById('modal-overlay')!;

    // 1. Добавление сотрудника
    document.getElementById('add-employee-btn')!.onclick = () => {
      // Передаем колбэк this.update, чтобы после сохранения App перерисовал всё
      new EmployeeForm(this.monthKey, () => this.update()).show();
    };

    // 2. Добавление проекта
    document.getElementById('add-project-btn')!.onclick = () => {
      new ProjectForm(this.monthKey, () => this.update()).show();
    };

    // 3. Управление модальным окном (Глобально)
    document.getElementById('modal-close')!.onclick = () => {
      overlay.style.display = 'none';
    };

    overlay.onclick = (e) => {
      // Закрываем, только если кликнули по серому фону, а не по самой модалке
      if (e.target === overlay) overlay.style.display = 'none';
    };

    // 4. Инициализация селектора месяца
    new MonthSelector(
      document.getElementById('month-selector-container')!,
      this.monthKey,
      (newKey) => {
        this.monthKey = newKey;
        this.update(); // Обновляем всё приложение при смене месяца
      }
    );
  }
  public update(): void {
    const data = getOrInitMonthData(this.monthKey);
    const profit = getTotalProfit(data);

    this.employeeList.update(data, this.monthKey);
    this.projectList.update(data, this.monthKey);

    this.profitDisplay.textContent = `${profit.toLocaleString()} $`;
    this.profitDisplay.className = profit >= 0 ? 'positive' : 'negative';
  }
}