import NewListFilterView from '../view/new-list-filter-view';
import NewListSortView from '../view/new-list-sort-view';
import NewAddPointView from '../view/new-add-new-point-view';
import NewEditPointView from '../view/new-edit-point-view';
import NewListView from '../view/new-list-view';
import NewEventView from '../view/new-event-point-view';
import { render } from '../framework/render';
import { formatDate, getCityInfoByID, capitalizeFirstLetter} from '../util';
import { DESTINATION_POINTS, OFFERS } from '../mock/trip-event-point';

export default class TripsPresenter {
  listElement = new NewListView();
  constructor({tripsModel}) {
    this.body = document.body;
    this.tripsModel = tripsModel;
  }

  prepareDataFormEditPointView (event) {
    const { base_price, date_from, date_to, destination, offers, type } = event;

    const lowercaseType = type.toLowerCase();

    // Получаем информацию о пункте назначения
    const cityInfo = getCityInfoByID(destination, DESTINATION_POINTS);
    // Получаем дату-вреся начала события
    const eventDatetimeFrom = formatDate(date_from, 'D/M/YY HH:mm');
    // Получаем дату-время конца события
    const eventDatetimeTo = formatDate(date_to, 'D/M/YY HH:mm');

    // Получаем список возможных пунктов назнчачения для datalist
    let destinationListOptions = '';
    DESTINATION_POINTS.forEach((point) => {
      destinationListOptions += `<option value="${ point.name }"></option>`;
    });

    // Получаем список типов событий
    const eventTypeItemsList = OFFERS.map((point) => {
      const eventType = point.type.toLowerCase();
      const typeCheckedAttribute = lowercaseType === eventType ? 'checked' : '';
      return `<div class="event__type-item">
                <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${typeCheckedAttribute}>
                <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${capitalizeFirstLetter(eventType)}</label>
              </div>`;
    }).join('');

    // Получаем все офферы того же типа что и событие
    let eventOfferItemsList = '';
    const selectedOffers = OFFERS.find((point) => point.type.toLowerCase() === lowercaseType)?.offers || [];

    const checkedOffersSet = new Set(offers);

    selectedOffers.forEach((offer) => {
      const offerTitle = offer.title;
      const offerPrice = offer.price;
      // Проверяем наличие оффера в Set
      const offerCheckedAttribute = checkedOffersSet.has(offer.id) ? 'checked' : '';
      eventOfferItemsList += `<div class="event__offer-selector">
                                <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${offerCheckedAttribute}>
                                <label class="event__offer-label" for="event-offer-luggage-1">
                                  <span class="event__offer-title">${offerTitle}</span>
                                  &plus;&euro;&nbsp;
                                  <span class="event__offer-price">${offerPrice}</span>
                                </label>
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

    return {
      lowercaseType,
      base_price,
      eventDatetimeFrom,
      eventDatetimeTo,
      cityInfo,
      destinationListOptions,
      eventTypeItemsList,
      offersSection,
      type,
      descriptionSection,
      photosContainer,
    };
  }

  init() {
    this.tripPoints = [...this.tripsModel.getEvents()];
    render(new NewListFilterView(), this.body.querySelector('.trip-controls__filters'));
    render(new NewListSortView(), this.body.querySelector('.trip-events'));
    this.tripList = this.listElement.element;
    render(this.listElement, this.body.querySelector('.trip-events'));
    render(new NewAddPointView(), this.tripList);

    for (let i = 0; i < this.tripPoints.length; i++) {
      render(new NewEventView({event: this.tripPoints[i]}), this.tripList);
    }

    render(new NewEditPointView({event: this.prepareDataFormEditPointView(this.tripPoints[0])}), this.tripList);
  }
}
