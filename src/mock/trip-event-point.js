import { EVENT_POINTS_TYPES } from '../const';
import { getRandomArrayElement, getRandomInteger } from '../utils/common';

const DESTINATION_POINTS = [
  {
    id: 1,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    name:'London',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomInteger()}`,
        description: 'Chamonix parliament building'
      },
    ]
  },
  {
    id: 0,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    name:'Tokyo',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomInteger()}`,
        description: 'Chamonix parliament building'
      },
    ]
  },
  {
    id: 2,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    name:'Berlin',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomInteger()}`,
        description: 'Chamonix parliament building'
      },
    ]
  },
  {
    id: 3,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    name:'Sydney',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomInteger()}`,
        description: 'Chamonix parliament building'
      },
    ]
  },
  {
    id: 4,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    name:'Buenos Aires',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomInteger()}`,
        description: 'Chamonix parliament building'
      },
    ]
  },
  {
    id: 5,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    name:'Cairo',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomInteger()}`,
        description: 'Chamonix parliament building'
      },
    ]
  }
];

const OFFERS = [
  {
    type: 'Taxi',
    offers: [
      {
        id: 1,
        title: 'Заголовок',
        price: getRandomInteger()
      },
      {
        id: 2,
        title: 'Заголовок №2',
        price: getRandomInteger()
      }
    ]
  },
  {
    type: 'Bus',
    offers: [
      {
        id: 1,
        title: 'Заголовок №3',
        price: getRandomInteger()
      },
      {
        id: 2,
        title: 'Заголовок №4',
        price: getRandomInteger()
      },
      {
        id: 3,
        title: 'Заголовок №5',
        price: getRandomInteger()
      }
    ]
  },
  {
    type: 'Train',
    offers: [
      {
        id: 1,
        title: 'Заголовок №6',
        price: getRandomInteger()
      },
    ]
  }
];

const mockEvents = [
  {
    id: 1,
    type: getRandomArrayElement(EVENT_POINTS_TYPES),
    destination: getRandomArrayElement(DESTINATION_POINTS).id,
    'date_from': new Date('2019-08-17 09:00'),
    'date_to': new Date('2019-08-17 18:00'),
    'base_price': getRandomInteger(),
    'is_favorite': false,
    offers: [ getRandomArrayElement(getRandomArrayElement(OFFERS).offers).id ],
  },
  {
    id: 2,
    type: getRandomArrayElement(EVENT_POINTS_TYPES),
    destination: getRandomArrayElement(DESTINATION_POINTS).id,
    'date_from': new Date('2019-06-05 09:45'),
    'date_to': new Date('2020-01-13 21:30'),
    'base_price': getRandomInteger(),
    'is_favorite': false,
    offers: [ getRandomArrayElement(getRandomArrayElement(OFFERS).offers).id ],
  },
  {
    id: 3,
    type: getRandomArrayElement(EVENT_POINTS_TYPES),
    destination: getRandomArrayElement(DESTINATION_POINTS).id,
    'date_from': new Date('2020-02-19 08:20'),
    'date_to': new Date('2020-03-05 02:15'),
    'base_price': getRandomInteger(),
    'is_favorite': true,
    offers: [ getRandomArrayElement(getRandomArrayElement(OFFERS).offers).id ],
  },
  {
    id: 4,
    type: getRandomArrayElement(EVENT_POINTS_TYPES),
    destination: getRandomArrayElement(DESTINATION_POINTS).id,
    'date_from': new Date('2020-04-11 09:00'),
    'date_to': new Date('2020-05-17 18:00'),
    'base_price': getRandomInteger(),
    'is_favorite': false,
    offers: [ getRandomArrayElement(getRandomArrayElement(OFFERS).offers).id ],
  },
  {
    id: 5,
    type: getRandomArrayElement(EVENT_POINTS_TYPES),
    destination: getRandomArrayElement(DESTINATION_POINTS).id,
    'date_from': new Date('2021-02-14 12:20'),
    'date_to': new Date('2021-04-10 23:30'),
    'base_price': getRandomInteger(),
    'is_favorite': true,
    offers: [ getRandomArrayElement(getRandomArrayElement(OFFERS).offers).id ],
  },
];

const getRandomEvent = () => getRandomArrayElement(mockEvents);

export { getRandomEvent, DESTINATION_POINTS, OFFERS };
