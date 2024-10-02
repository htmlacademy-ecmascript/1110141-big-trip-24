import dayjs from 'dayjs';

const DATE_FORMAT = 'D MMM';

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
 * @returns {string} Разница между двумя датами
 */
const calculateDateDifference = (dateFrom, dateTo) => {
  const start = dayjs(dateFrom);
  const end = dayjs(dateTo);
  const diffInMinutes = end.diff(start, 'minute');
  let minutes;
  if (diffInMinutes < 60) {
    return `${diffInMinutes}M`;
  }

  const diffInHours = end.diff(start, 'hour');
  if (diffInHours < 24) {
    minutes = diffInMinutes % 60;
    return `${diffInHours}H ${minutes}M`;
  }

  const diffInDays = end.diff(start, 'day');
  const hours = diffInHours % 24;
  minutes = diffInMinutes % 60;
  return `${diffInDays}D ${hours}H ${minutes}M`;
};

/**
 * Возвращает искомый по переданному ID город из массива переданных же городов
 * @param {Number} id ID искомого города
 * @param {array} cities Массив объектов городов
 * @returns {object} Объект искомого города
 */
const getCityInfoByID = (id, cities) => cities.find((city) => city.id === id);

/**
 * Возвращает информацию о предложении по его ID и типу
 * @param {Number} id ID искомого предложения
 * @param {Array} offers Массив объектов предложений, сгруппированных по типу
 * @param {String} type Тип предложения (например, "apartment", "house" и т.д.)
 * @returns {object|null} Объект искомого предложения или null, если предложение не найдено
 */
const getOfferInfoById = (id, offers, type) => {
  const offersByType = offers.find((offer) => offer.type.toLowerCase() === type.toLowerCase());

  if (offersByType && offersByType !== 'undefined') {
    return offersByType.offers.find((offer) => offer.id === id);
  }

  return null;
};

/**
 * Проверяет была ли нажата кнопка Escape
 * @param {Event} event - событие keydown
 * @returns {boolean} - возвращает true, если была нажата кнопка Escape
 */
const isEscapeKey = (event) => event.key === 'Escape';

export { humanizeEventDate, formatDate, calculateDateDifference, getCityInfoByID, getOfferInfoById, isEscapeKey };
