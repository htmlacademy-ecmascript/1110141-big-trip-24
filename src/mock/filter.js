import { filter } from '../utils/filter';

/**
 * Функция генерирует массив объектов с данными о количестве событий по каждому фильтру
 * @param {Array} events массив событий
 * @return {Array} массив объектов с данными о количестве событий по каждому фильтру
 * @example
 * generateFilter(events);
 */
function generateFilter (events) {
  return Object.entries(filter).map(
    ([filterType, filterEvents]) => ({
      type: filterType,
      count: filterEvents(events).length,
    }),
  );
}

export { generateFilter };
