import { MIN_PRICE, MAX_PRICE } from './const';
import dayjs from 'dayjs';

const DATE_FORMAT = 'D MMM';

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
 * Задаёт человекопонятный формат даты точки события
 * @param {Date} eventDate - Дата точки события
 * @returns {string} Человекопонятную дату
 */
const humanizeEventDate = (eventDate) => eventDate ? dayjs(eventDate).format(DATE_FORMAT) : '';

/**
 * Форматирует переданную дату при помощи dayjs по переданному формату
 * @param {Date} date Дата для форматирования
 * @param {string} format Формат для новой даты
 * @returns {string} Новая отформатированная дата
 */
const formatDate = (date, format) => dayjs(date).format(format);

/**
 * Выводит разницу в двух переданных датах по принципу:
 * менее часа — минуты;
 * менее суток — часы минуты;
 * более суток — дни часы минуты.
 * @param {Date} dateFrom Дата начала события
 * @param {Date} dateTo Дата конца события
 * @returns Разница между двумя датами
 */
const calculateDifference = (dateFrom, dateTo) => {
  const start = dayjs(dateFrom);
  const end = dayjs(dateTo);
  const diffInMinutes = end.diff(start, 'minute');
  if (diffInMinutes < 60) {
    return `${diffInMinutes}M`;
  }

  const diffInHours = end.diff(start, 'hour');
  if (diffInHours < 24) {
    const minutes = diffInMinutes % 60;
    return `${diffInHours}H ${minutes}M`;
  }

  const diffInDays = end.diff(start, 'day');
  const hours = diffInHours % 24;
  const minutes = diffInMinutes % 60;
  return `${diffInDays}D ${hours}H ${minutes}M`;
};

/**
 * Возвращает искомый по переданному ID город из массива переданных же городов
 * @param {Number} id ID искомого города
 * @param {Array} cities Массив объектов городов
 * @returns {Object} Объект искомого города
 */
const getCityInfoByID = (id, cities) => cities.find((city) => city.id === id);

const getOfferInfoById = (id, offers, type) => {
  const offersByType = offers.find((offer) => offer.type.toLowerCase() === type.toLowerCase());

  if (offersByType && offersByType !== 'undefined') {
    return offersByType.offers.find((offer) => offer.id === id);
  }

  return null;
};

const capitalizeFirstLetter = (word) => {
  if (!word) {
    return '';
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export {getRandomArrayElement, getRandomInteger, humanizeEventDate, formatDate, calculateDifference, getCityInfoByID, getOfferInfoById, capitalizeFirstLetter };
