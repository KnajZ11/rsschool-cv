// rs-react-app\src\main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { ThemeProvider } from './context/ThemeContext';

/**
 * 🌍 1. ИЗВЛЕЧЕНИЕ И НАСТРОЙКА TTL ИЗ .ENV
 * Читаем время жизни кэша из переменных окружения Vite.
 * Если файл .env пустой или не прочитался, сработает фолбек на 300000 мс (5 минут).
 */
const cacheTTL = Number(import.meta.env.VITE_CACHE_TTL) || 300000;

/**
 * 🏛️ 2. ИНИЦИАЛИЗАЦИЯ QUERY CLIENT (Стабильный синглтон вне рендера)
 * Мы создаем этот объект СТРОГО вне цикла рендеринга компонентов. 
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: cacheTTL,
      gcTime: cacheTTL,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const rootElement = document.getElementById('root');

/**
 * 🔲 3. ЧИСТЫЙ РЕНДЕРИНГ ПРИЛОЖЕНИЯ
 */
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>      
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </ThemeProvider>
        </BrowserRouter>
        
        {/* 
          🛠️ ПОДКЛЮЧЕНИЕ DEVTOOLS        
        */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  );
}