# Rick and Morty Search App (Module 3: Hooks & Routing) 🚀

Современное SPA-приложение для поиска персонажей вселенной "Рик и Морти", переведенное на функциональный подход в рамках обучения в **RS School**. Проект демонстрирует работу с хуками, сложной маршрутизацией и глубоким тестированием.

## 🔗 Ссылки

- **App Link (Deploy):** [https://github.io](https://knajz11.github.io/rsschool-cv/)
- **Pull Request (Task 2):** [View PR #14](https://github.com/KnajZ11/rsschool-cv/pull/14)

## 🛠 Технологии

- **React 19** (Functional Components)
- **React Router 7** (Routing & Master-Detail)
- **TypeScript** (Strict mode)
- **Vite** (Build tool)
- **Vitest & React Testing Library** (Testing)
- **GitHub Pages** (Deployment)

## 🛠 Новое в этом модуле

- **Refactoring:** Все классовые компоненты (кроме Error Boundary) полностью переведены на функции и хуки.
- **Hooks:** Использование `useState`, `useEffect`, `useCallback` и `useSearchParams`.
- **Custom Hook:** Реализован авторский хук `useLocalStorage` для инкапсуляции работы с браузерным хранилищем.
- **Master-Detail View:** Реализован вывод деталей персонажа через `<Outlet />`. Список остается активным и доступным для навигации.
- **Routing:** Полноценная навигация:
  - `Main Page` (с пагинацией в URL)
  - `About Page` (информация об авторе)
  - `404 Page` (обработка ошибок навигации)

## 📊 Качество кода

- **TypeScript:** Полная типизация API-ответов и пропсов (без использования any).
- **Тесты:** Сохранено высокое покрытие **91.37%**.
- **UX/UI:** Адаптивная верстка, Sticky-эффект для панели деталей и современный темный интерфейс.

## 💻 Команды

- `npm run dev` — запуск локально
- `npm run test:coverage` — отчет по покрытию тестами
- `npm run deploy` — деплой на GitHub Pages
