import { MIN_PRICE, MAX_PRICE } from './const';

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

export {getRandomArrayElement, getRandomInteger};
