// rs-react-app\api.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchData } from './src/api';

describe('API fetchData', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('должен возвращать данные при успешном запросе', async () => {
    const mockData = { results: [{ id: 1, name: 'Rick' }] };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as Response);

    const result = await fetchData('Rick');

    expect(result.results[0].name).toBe('Rick');

    const expectedUrl = 'https://rickandmortyapi.com/api/character/?name=Rick';
    expect(fetch).toHaveBeenCalledWith(expectedUrl);
  });

  it('должен выбрасывать ошибку при сетевом сбое', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    await expect(fetchData('Rick')).rejects.toThrow('Network error');
  });
});
