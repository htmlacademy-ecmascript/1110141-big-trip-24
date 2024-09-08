import { EVENT_POINTS_TYPES } from '../const';
import { getRandomArrayElement, getRandomInteger } from '../util';

const DESTINATION_POINTS = [ 'Tokyo', 'Berlin', 'Sydney', 'Buenos Aires', 'Cairo', 'Bangkok', 'Toronto', 'Rome', 'Cape Town', 'Istanbul'];

const mockEventPoints = [
  {
    type: getRandomArrayElement(EVENT_POINTS_TYPES),
    destination: getRandomArrayElement(DESTINATION_POINTS),
    startDate: new Date('2019-08-17 09:00'),
    endDate: new Date('2019-12-25 18:00'),
    cost: getRandomInteger(),
  },
  {
    type: getRandomArrayElement(EVENT_POINTS_TYPES),
    destination: getRandomArrayElement(DESTINATION_POINTS),
    startDate: new Date('2019-06-05 09:45'),
    endDate: new Date('2020-01-13 21:30'),
    cost: getRandomInteger(),
  },
  {
    type: getRandomArrayElement(EVENT_POINTS_TYPES),
    destination: getRandomArrayElement(DESTINATION_POINTS),
    startDate: new Date('2020-02-19 08:20'),
    endDate: new Date('2020-03-05 02:15'),
    cost: getRandomInteger(),
  },
  {
    type: getRandomArrayElement(EVENT_POINTS_TYPES),
    destination: getRandomArrayElement(DESTINATION_POINTS),
    startDate: new Date('2020-04-11 09:00'),
    endDate: new Date('2020-05-17 18:00'),
    cost: getRandomInteger(),
  },
  {
    type: getRandomArrayElement(EVENT_POINTS_TYPES),
    destination: getRandomArrayElement(DESTINATION_POINTS),
    startDate: new Date('2021-02-14 12:20'),
    endDate: new Date('2021-04-10 23:30'),
    cost: getRandomInteger(),
  },
];

const getRandomEventPoint = () => getRandomArrayElement(mockEventPoints);

export { getRandomEventPoint };
