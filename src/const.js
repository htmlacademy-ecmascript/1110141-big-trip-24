const EVENT_POINTS_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const MIN_PRICE = 10;
const MAX_PRICE = 5000;

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const SortType = {
  DEFAULT: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export {EVENT_POINTS_TYPES, MAX_PRICE, MIN_PRICE, FilterType, SortType};
