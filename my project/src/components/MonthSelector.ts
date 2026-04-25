// src/components/MonthSelector.ts
import { copyFromPreviousMonth } from '../services/dataService';
import { getMonthData } from '../services/storageService';

export class MonthSelector {
  private container: HTMLElement;
  private currentKey: string;
  private onChange: (newKey: string) => void;
  private select!: HTMLSelectElement;

  constructor(container: HTMLElement, initialKey: string, onChange: (key: string) => void) {
    this.container = container;
    this.currentKey = initialKey;
    this.onChange = onChange;
    this.render();
  }

  private render(): void {
    this.container.innerHTML = '';
    
    const controlsWrapper = document.createElement('div');
    controlsWrapper.style.display = 'flex';
    controlsWrapper.style.gap = '10px';
    controlsWrapper.style.alignItems = 'center';

    this.select = document.createElement('select');
    
    // Генерируем опции на 2024-2026 годы
    const years = [2024, 2025, 2026];
    for (const year of years) {
      for (let m = 1; m <= 12; m++) {
        const month = String(m).padStart(2, '0');
        const key = `${year}-${month}`;
        const option = document.createElement('option');
        option.value = key;
        option.textContent = `${year} / ${month}`;
        if (key === this.currentKey) option.selected = true;
        this.select.appendChild(option);
      }
    }

    this.select.addEventListener('change', () => {
      this.currentKey = this.select.value;
      this.onChange(this.currentKey);
    });

    const copyBtn = document.createElement('button');
    copyBtn.textContent = '📋 Copy prev month';
    copyBtn.className = 'btn-copy'; // Стили в style.css
    
    copyBtn.addEventListener('click', () => {
      // ПРОВЕРКА: Есть ли уже данные в текущем месяце?
      const currentData = getMonthData(this.currentKey);
      if (currentData && (currentData.employees.length > 0 || currentData.projects.length > 0)) {
        if (!confirm('В текущем месяце уже есть данные. Копирование полностью удалит их и заменит данными из прошлого месяца. Продолжить?')) {
          return;
        }
      }

      const [year, month] = this.currentKey.split('-').map(Number);
      const prevDate = new Date(year, month - 2); 
      const prevKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
      
      if (copyFromPreviousMonth(prevKey, this.currentKey)) {
        this.onChange(this.currentKey);
      } else {
        alert(`Нет данных для копирования за предыдущий период (${prevKey})`);
      }
    });

    controlsWrapper.appendChild(this.select);
    controlsWrapper.appendChild(copyBtn);
    this.container.appendChild(controlsWrapper);
  }
}