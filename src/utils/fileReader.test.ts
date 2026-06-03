// rsschool-cv\src\utils\fileReader.test.ts
import { describe, it, expect } from 'vitest';
import { convertFileToBase64 } from './fileReader';

describe('Юнит-тесты: fileReader.ts', () => {
  it('convertFileToBase64 должен преобразовывать бинарный File в Base64 строку', async () => {
    const fakeBlob = new Blob(['content'], { type: 'image/png' });
    const fakeFile = new File([fakeBlob], 'avatar.png', { type: 'image/png' });

    const result = await convertFileToBase64(fakeFile);
    expect(result).toBeTypeOf('string');
    expect(result.startsWith('data:image/png;base64,')).toBe(true);
  });
});
