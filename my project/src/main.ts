// src/main.ts
import { App } from './components/App';

document.addEventListener('DOMContentLoaded', () => {
  // Инициализируем главное приложение
  const app = new App();
  (window as any).app = app;
});