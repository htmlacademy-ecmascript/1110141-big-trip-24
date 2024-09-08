/**
 * Получает случайный элемент переданного массива
 * @param {Array} items Массив, случайный элемент которого не обходимо получить
 * @returns {any} Случайный элемент массива
 */
const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

export {getRandomArrayElement};
