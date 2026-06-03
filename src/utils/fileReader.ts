/**
 * Асинхронно считывает бинарный объект File (или Blob) из HTML-инпута
 * и конвертирует его в текстовую ASCII-строку формата Data URL (Base64).
 *
 * @param file - Бинарный файл изображения (аватарка пользователя).
 * @returns Promise, разрешающийся валидной строкой Base64 для тега <img>.
 */
export const convertFileToBase64 = (file: File): Promise<string> => {
  // Оборачиваем нативный FileReader в объект Promise, так как чтение с диска асинхронно
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // Обработчик успешного завершения чтения бинарного потока в RAM
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result); // Успешно возвращаем готовую Base64 строку
      } else {
        reject(new Error('Некорректная структура результата чтения файла.'));
      }
    };

    // Обработчик непредвиденных сбоев ввода-вывода (I/O Errors)
    reader.onerror = () => {
      reject(
        reader.error ||
          new Error('Системная ошибка при чтении файла через FileReader.')
      );
    };

    // Инициируем асинхронное чтение файла как закодированную Data URL строку
    reader.readAsDataURL(file);
  });
};
