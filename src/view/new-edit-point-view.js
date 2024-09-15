import { createElement } from '../render';
import { humanizeEventDate, formatDate, calculateDifference, getCityInfoByID, getOfferInfoById, capitalizeFirstLetter} from '../util';
import { DESTINATION_POINTS, OFFERS } from '../mock/trip-event-point';

function createEditPointTemplate (event) {

  const { base_price, date_from, date_to, destination, offers, type} = event;

  const lowercaseType = type.toLowerCase();

  // Получаем информацию о пункте назначения
  const cityInfo = getCityInfoByID(destination, DESTINATION_POINTS);
  // Получаем дату-вреся начала события
  const eventDatetimeFrom = formatDate(date_from, 'D/M/YY HH:mm');
  // Получаем дату-время конца события
  const eventDatetimeTo = formatDate(date_to, 'D/M/YY HH:mm');

  // Получаем список возможных пунктовн назнчачения для datalist
  let destinationListOptions = '';
  DESTINATION_POINTS.forEach((point) => {
    destinationListOptions += `<option value="${ point.name }"></option>`;
  });

  // Получаем список типов событий
  let eventTypeItemsList = '';
  // Получаем все офферы того же типа что и событие
  let eventOfferItemsList = '';

  OFFERS.forEach((point) => {
    const eventType = point.type.toLowerCase();
    let typeCheckedAttribute = '';
    if (lowercaseType === eventType) {
      typeCheckedAttribute = 'checked';
      // Проверяем есть ли у данного события офферы
      point.offers.forEach((offer) => {
        const offerTitle = offer.title;
        const offerPrice = offer.price;
        // Проверяем есть ли у данного события выбранные (чекнутые) офферы
        const offerCheckedAttribute = offers.find((offerItem) => offer.id === offerItem) ? 'checked' : '';
        eventOfferItemsList += `<div class="event__offer-selector">
                                  <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${offerCheckedAttribute}>
                                  <label class="event__offer-label" for="event-offer-luggage-1">
                                    <span class="event__offer-title">${offerTitle}</span>
                                    &plus;&euro;&nbsp;
                                    <span class="event__offer-price">${offerPrice}</span>
                                  </label>
                                </div>`;
      });
    }
    eventTypeItemsList += `<div class="event__type-item">
                            <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${typeCheckedAttribute}>
                            <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${capitalizeFirstLetter(eventType)}</label>
                          </div>`;
  });

  let offersSection = '';
  if (eventOfferItemsList) {
    offersSection = `<section class="event__section  event__section--offers">
                      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                      <div class="event__available-offers">
                        ${eventOfferItemsList}
                      </div>
                    </section>`;
  }

  let descriptionSection = '';
  if (cityInfo.description) {
    descriptionSection = `<section class="event__section  event__section--destination">
                            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                            <p class="event__destination-description">${cityInfo.description}</p>
                          </section>`;
  }

  let photosContainer = '';
  if (cityInfo.pictures.length) {
    let pictures = '';
    cityInfo.pictures.forEach((picture) => {
      pictures += `<img class="event__photo" src="${picture.src}" alt="${picture.description} photo"></img>`;
    });
    photosContainer = `<div class="event__photos-container">
                        <div class="event__photos-tape">
                          ${pictures}
                        </div>
                      </div>`;
  }

  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-2">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${lowercaseType}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-2" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${eventTypeItemsList}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${ type }
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${ cityInfo.name }" list="destination-list-1">
                    <datalist id="destination-list-1">
                      ${destinationListOptions}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${ eventDatetimeFrom }">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${ eventDatetimeTo }">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${base_price.toLocaleString('ru-RU')}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  ${offersSection}

                  ${descriptionSection}

                  ${photosContainer}
                </section>
              </form>
            </li>`;
}

export default class NewEditPointView {

  constructor ({event}) {
    this.event = event;
  }

  getTemplate() {
    return createEditPointTemplate(this.event);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
