export const generateId = (mask = 'xxxxxxxxxx', map = '0123456789abcdef') => {
  const { length } = map;
  return mask.replace(/x/g, () => map[Math.floor(Math.random() * length)]);
};

export const parseUrlParams = (url: string): Record<string, string> => {
  // Извлекаем строку запроса из URL
  const queryString = url.split('?')[1];

  // Если нет строки запроса, возвращаем пустой объект
  if (!queryString) {
    return {};
  }

  // Разбиваем строку запроса на массив параметров
  const paramsArray = queryString.split('&');

  // Инициализируем объект для хранения параметров
  const paramsObject: Record<string, string> = {};

  // Итерируем по массиву параметров
  paramsArray.forEach((param) => {
    // Разбиваем каждый параметр на имя и значение
    const [key, value] = param.split('=');

    // Декодируем значения и добавляем их в объект
    paramsObject[key] = decodeURIComponent(value);
  });

  return paramsObject;
};
