// src/components/MonthSelector.ts
import { copyFromPreviousMonth } from '../services/dataService';

export class MonthSelector {
  private container: HTMLElement;
  private currentKey: string;
  private onChange: (newKey: string) => void;
  private select!: HTMLSelectElement; // используем !, так как инициализируем в render

  constructor(container: HTMLElement, initialKey: string, onChange: (key: string) => void) {
    this.container = container;
    this.currentKey = initialKey;
    this.onChange = onChange;
    this.render();
  }

  private render(): void {
    this.container.innerHTML = '';
    
    const controlsWrapper = document.createElement('div');
    controlsWrapper.className = 'month-selector-controls';

    this.select = document.createElement('select');
    
    // Генерируем опции
    const years = [2024, 2025, 2026];
    const months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    
    for (const year of years) {
      for (const month of months) {
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
    copyBtn.textContent = '📋 Copy from previous month';
    copyBtn.className = 'btn-copy';
    
    copyBtn.addEventListener('click', () => {
      const [year, month] = this.currentKey.split('-').map(Number);
      // month - 1 — это текущий месяц в формате Date (0-11)
      // month - 2 — это предыдущий месяц
      const prevDate = new Date(year, month - 2); 
      const prevKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
      
      if (copyFromPreviousMonth(prevKey, this.currentKey)) {
        this.onChange(this.currentKey);
        alert(`Данные успешно скопированы из ${prevKey}`);
      } else {
        alert(`Нет данных за предыдущий месяц (${prevKey})`);
      }
    });

    controlsWrapper.appendChild(this.select);
    controlsWrapper.appendChild(copyBtn);
    this.container.appendChild(controlsWrapper);
  }
}