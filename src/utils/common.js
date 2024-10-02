import { MIN_PRICE, MAX_PRICE } from '../const';

/**
 * Возвращает случайное целое число в диапазоне от min до max
 * @param {Number} min Целое число нижней границы генерации
 * @param {Number} max Целое число верхней границы генерации
 * @returns Случайное число в диапазоне от min до max
 */
const getRandomInteger = (min = MIN_PRICE, max = MAX_PRICE) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Получает случайный элемент переданного массива
 * @param {Array} items Массив, случайный элемент которого не обходимо получить
 * @returns {any} Случайный элемент массива
 */
const getRandomArrayElement = (items) => items[getRandomInteger(0, items.length - 1)];

/**
 * Делает первую букву переданной строки заглавной
 * @param {String} word Строка, первую букву которой нужно сделать заглавной
 * @returns {String} Строка с заглавной первой буквой или пустая строка, если на вход передана пустая строка или null/undefined
 */
const capitalizeFirstLetter = (word) => {
  if (!word) {
    return '';
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
};

/**
 * Проверяет была ли нажата кнопка Escape
 * @param {Event} event - событие keydown
 * @returns {boolean} - возвращает true, если была нажата кнопка Escape
 */
const isEscapeKey = (event) => event.key === 'Escape';

export { getRandomInteger, getRandomArrayElement, capitalizeFirstLetter, isEscapeKey };
