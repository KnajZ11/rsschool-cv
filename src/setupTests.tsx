// rs-react-app\src\setupTests.ts
import '@testing-library/jest-dom';
import React from 'react';
import { cleanup, render, type RenderResult } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup(); 
});

/**
 * 🎯 ИНТЕРФЕЙС ДЛЯ VERBATIM MODULE SYNTAX 
 */
interface RenderWithQueryClientResult extends RenderResult {
  queryClient: QueryClient;
}

/**
 * 🛠️ ТЕСТОВАЯ ФАБРИКА: renderWithQueryClient (Модуль 5) 
 */
export const renderWithQueryClient = (
  ui: React.ReactElement
): RenderWithQueryClientResult => {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
        staleTime: Infinity,
      },
    },
  });

  const renderResult = render(
    <QueryClientProvider client={testQueryClient}>
      {ui}
    </QueryClientProvider>
  );

  return {
    ...renderResult,
    queryClient: testQueryClient,
  };
};