import AbstractView from '../framework/view/abstract-view';
import { humanizeEventDate, formatDate, calculateDifference, getCityInfoByID, getOfferInfoById} from '../util';
import { DESTINATION_POINTS, OFFERS } from '../mock/trip-event-point';
import NewEventOfferView from './new-event-offer-view';

function createNewEventTemplate (event) {

  const {base_price, date_from, date_to, destination, is_favorite, offers, type} = event;

  const humanizedDateFrom = humanizeEventDate(date_from);
  const lowercaseType = type.toLowerCase();
  const niceBasePrice = base_price.toLocaleString('ru-RU');

  // Дата "от" для атрибута datetime элемента time.event__date
  const eventDateDatetime = formatDate(date_from, 'YYYY-MM-DD');
  // Дата "от" для атрибута datetima элемента time.event__start-time
  const eventStartTimeDatetime = formatDate(date_from, 'YYYY-MM-DDTHH:mm');
  // Время "от" элемента time.event__start-time
  const timeFrom = formatDate(date_from, 'HH:mm');
  // Дата "до" для атрибута datetima элемента time.event__end-time
  const eventEndTimeDatetime = formatDate(date_to, 'YYYY-MM-DDTHH:mm');
  // Время "до" элемента time.event__end-time
  const timeTo = formatDate(date_to, 'HH:mm');
  // Длительность события
  const duration = calculateDifference(date_from, date_to);
  const favoriteClass = is_favorite ? 'event__favorite-btn--active' : '';

  // Получаем информацию о пункте назначения
  const cityInfo = getCityInfoByID(destination, DESTINATION_POINTS);
  const offersInfo = [];
  offers.forEach((offerId) => {
    const offer = getOfferInfoById(offerId, OFFERS, type);
    if (offer) {
      offersInfo.push(offer);
    }
  });

  let offersHTML = '';
  offersInfo.forEach((offerInfo) => {
    if (offerInfo) {
      const newEventOffer = new NewEventOfferView({offer: offerInfo});
      offersHTML += newEventOffer.template;
    }
  });

  return `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${eventDateDatetime}">${humanizedDateFrom}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${lowercaseType}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${cityInfo.name}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${eventStartTimeDatetime}">${timeFrom}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${eventEndTimeDatetime}">${timeTo}</time>
                  </p>
                  <p class="event__duration">${duration}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${niceBasePrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                  ${offersHTML}
                </ul>
                <button class="event__favorite-btn ${favoriteClass}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`;
}
export default class NewEventView extends AbstractView {
  #event = null;
  #onEventRollupClick = null;

  constructor ({event, onEventRollupClick}) {
    super();
    this.#event = event;
    // Получаем обработчик клика кнопки-стрелки снаружи
    this.#onEventRollupClick = onEventRollupClick;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', (clickEvent) => this.#handleEventRollupClick(clickEvent));
  }

  get template() {
    return createNewEventTemplate(this.#event);
  }

  // Делаем на основе обработчика новый обработчик
  #handleEventRollupClick = (clickEvent) => {
    clickEvent.preventDefault();
    this.#onEventRollupClick();
  };
}
