# Rick and Morty Search App (React + Vitest) 🚀

Приложение для поиска персонажей вселенной "Рик и Морти", созданное в рамках обучения в **RS School**. Проект демонстрирует работу с классовыми компонентами React, типизацию на TypeScript и глубокое юнит-тестирование.

## 🔗 Ссылки
- **App Link (Deploy):** [https://github.io](https://knajz11.github.io/rsschool-cv/)
- **Pull Request (Task 2):** [View PR #13](https://github.com/KnajZ11/rsschool-cv/pull/13)

## 🛠 Технологии
- **React 19** (Class Components)
- **TypeScript** (Strict mode)
- **Vite** (Build tool)
- **Vitest & React Testing Library** (Testing)
- **GitHub Pages** (Deployment)

## 📊 Тестирование и Покрытие
В проекте реализовано 16 интеграционных и юнит-тестов, покрывающих основные сценарии работы приложения.
- **Итоговое покрытие (Statements):** `91.37%`
- **Компоненты:** `100%` покрытие всех файлов в директории `src/components`.

## 📊 Отчет о покрытии (Coverage Report)

Итоговое покрытие (Statements) составляет **91.37%**.

| File | % Stmts | % Branch | % Funcs | % Lines |
| :--- | :---: | :---: | :---: | :---: |
| **All files** | **91.37** | **86.36** | **100** | **92.98** |
| `src/App.tsx` | 88.88 | 100 | 100 | 88.88 |
| `src/components/*` | 100 | 100 | 100 | 100 |

## 📋 Реализованный функционал
- **Class Components:** Использование исключительно классового подхода согласно ТЗ.
- **LocalStorage:** Сохранение поискового запроса между сессиями.
- **ErrorBoundary:** Перехват и обработка ошибок рендеринга с Fallback UI.
- **API Mocking:** Тестирование асинхронных запросов без реальных обращений к серверу.
- **Loading State:** Отображение индикатора загрузки во время запросов.

## 💻 Запуск проекта
1. Установка зависимостей: `npm install`
2. Запуск dev-сервера: `npm run dev`
3. Запуск тестов: `npm run test`
4. Отчет по покрытию: `npm run test:coverage`