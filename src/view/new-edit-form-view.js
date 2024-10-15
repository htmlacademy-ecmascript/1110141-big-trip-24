import AbstractStatefulView from '../framework/view/abstract-stateful-view';

import newEditFormEventTypeItemView from '../view/new-edit-form-event-type-item-view';
import newEditFormEventOfferSelectorView from '../view/new-edit-form-event-offer-selector-view';
import newEditFormOffersSectionView from '../view/new-event-offers-section-view';
import newEditFormEventDestinationSectionView from '../view/new-edit-form-event-destination-section-view';
import newEditFormEventPhotoContainerView from '../view/new-edit-form-event-photo-container-view';
import newEditFormEventPhotoView from '../view/new-edit-form-event-photo-view';

// Импорт вспомогательных функций
import { formatDate, getCityInfoByID, getCityInfoByName } from '../utils/event';
import { getDatalistOption, getEventTypeData } from '../utils/form';

// Импорт моков
import { DESTINATION_POINTS, OFFERS } from '../mock/event';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

/**
 * Получает информацию о городе по идентификатору назначения.
 * @param {string} destinationID - Идентификатор города.
 * @returns {object} - Информация о городе.
 */
function getCityInfo(destinationID) {
  return getCityInfoByID(destinationID, DESTINATION_POINTS);
}

/**
 * Форматирует дату события.
 * @param {string} date - Дата события в формате ISO.
 * @returns {string} - Отформатированная дата.
 */
function formatEventDateTime(date) {
  return formatDate(date, 'D/M/YY HH:mm');
}

/**
 * Получает список опций для выбора места назначения.
 * @returns {string} - HTML-строка с опциями для списка выбора.
 */
function getDestinationListOptions() {
  return getDatalistOption(DESTINATION_POINTS);
}

/**
 * Получает список элементов для выбора типа события.
 * @param {string} selectedType - Выбранный тип события.
 * @returns {string} - HTML-строка с элементами выбора типа события.
 */
function getEventTypeItemsList(selectedType) {
  const eventTypeData = getEventTypeData(OFFERS, selectedType);
  return eventTypeData.map(({ eventType, isChecked }) => {
    const editFormEventTypeItem = new newEditFormEventTypeItemView({ eventType, isChecked });
    return editFormEventTypeItem.template;
  }).join('');
}

/**
 * Получает список предложений для определённого типа события и выбранных предложений.
 * @param {string} eventType - Тип события.
 * @param {Array<string>} selectedOffers - Список выбранных предложений.
 * @returns {string} - HTML-строка с элементами предложений.
 */
function getEventOfferItemsList(eventType, selectedOffers) {
  const availableOffers = OFFERS.find((point) => point.type === eventType)?.offers || [];
  const checkedOffersSet = new Set(selectedOffers);

  return availableOffers.map((offer) => {
    const { title: offerTitle, price: offerPrice, id } = offer;
    const offerCheckedAttribute = checkedOffersSet.has(id) ? 'checked' : '';
    const editFormEventOfferSelector = new newEditFormEventOfferSelectorView({ offerCheckedAttribute, offerTitle, offerPrice, offerID: id });
    return editFormEventOfferSelector.template;
  }).join('');
}

/**
 * Создаёт HTML-секцию с предложениями для формы редактирования.
 * @param {string} eventOfferItemsList - HTML-строка с элементами предложений.
 * @returns {string} - HTML-секция с предложениями или пустая строка, если предложений нет.
 */
function createOffersSection(eventOfferItemsList) {
  return eventOfferItemsList ? new newEditFormOffersSectionView({ eventOfferItemsList }).template : '';
}

/**
 * Создаёт HTML-секцию с описанием города для формы редактирования.
 * @param {object} cityInfo - Информация о городе.
 * @returns {string} - HTML-секция с описанием или пустая строка, если описания нет.
 */
function createDescriptionSection(cityInfo) {
  return cityInfo.description ? new newEditFormEventDestinationSectionView({ description: cityInfo.description }).template : '';
}

/**
 * Создаёт контейнер с фотографиями города для формы редактирования.
 * @param {object} cityInfo - Информация о городе, включая фотографии.
 * @returns {string} - HTML-контейнер с фотографиями или пустая строка, если фотографий нет.
 */
function createPhotosContainer(cityInfo) {
  if (!cityInfo.pictures.length) {
    return '';
  }

  const pictures = cityInfo.pictures.map((picture) =>
    new newEditFormEventPhotoView({ src: picture.src, description: picture.description }).template
  ).join('');

  return new newEditFormEventPhotoContainerView({ pictures }).template;
}

function createEditFormTemplate (event) {

  const { base_price, date_from, date_to, destination, offers, type } = event;

  const cityInfo = getCityInfo(destination);
  const eventDatetimeFrom = formatEventDateTime(date_from);
  const eventDatetimeTo = formatEventDateTime(date_to);
  const destinationListOptions = getDestinationListOptions();

  const eventTypeItemsList = getEventTypeItemsList(type);
  const eventOfferItemsList = getEventOfferItemsList(type, offers);
  const offersSection = createOffersSection(eventOfferItemsList);
  const descriptionSection = createDescriptionSection(cityInfo);
  const photosContainer = createPhotosContainer(cityInfo);

  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-2">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
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
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${ base_price }">
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

export default class NewEditFormView extends AbstractStatefulView {
  #onEditFormSubmit = null;
  #onRollupClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor ({event, onEditFormSubmit, onRollupClick}) {
    super();
    this._setState(NewEditFormView.parseEventToState(event));
    // Получаем обработчик сабмита формы снаружи
    this.#onEditFormSubmit = onEditFormSubmit;
    this.#onRollupClick = onRollupClick;
    this._restoreHandlers();
  }

  // Делаем на основе обработчика новый обработчик
  #handleEditFormSubmit = (event) => {
    event.preventDefault();
    this.#onEditFormSubmit(NewEditFormView.parseStateToEvent(this._state));
  };

  _restoreHandlers() {
    this.element.querySelector('.event').addEventListener('submit', (event) => this.#handleEditFormSubmit(event));
    this.element.querySelector('.event__save-btn').addEventListener('click', (event) => this.#handleEditFormSubmit(event));
    this.element.querySelector('.event__rollup-btn').addEventListener('click', (event) => this.#rollupClickHandler(event));
    this.element.querySelector('.event__input--destination').addEventListener('change', () => this.#destinationChangeHandler());
    this.element.querySelector('.event__type-group').addEventListener('change', (event) => this.#typeChangeHandler(event));
    this.element.querySelector('.event__available-offers').addEventListener('click', (event) => this.#offersListClickHandler(event));

    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  }

  #setDatepickerFrom = () => {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.date_from,
        onChange: this.#dateFromChangeHandler,
      }
    );
  };

  #setDatepickerTo = () => {
    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.date_To,
        onChange: this.#dateToChangeHandler,
      }
    );
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      date_from: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      date_to: userDate,
    });
  };

  #rollupClickHandler = (event) => {
    event.preventDefault();
    this.#onRollupClick();
  };

  #destinationChangeHandler = () => {
    const currentDestination = getCityInfoByName(this.element.querySelector('.event__input--destination').value, DESTINATION_POINTS);
    if (currentDestination) {
      this.updateElement({
        destination: currentDestination.id,
      });
    } else {
      this.updateElement({
        destination: this._state.destination,
      });
    }
  };

  #typeChangeHandler = (event) => {
    const target = event.target;

    if (target.tagName !== 'INPUT') {
      return;
    }

    this.updateElement({
      offers: [], // Сбрасываем предыдущие предложения
      type: target.value,
    });
  };

  #offersListClickHandler = (event) => {
    const target = event.target;
    if (target.tagName !== 'INPUT') {
      return;
    }
    const offerID = parseInt(target.id.split('-')[target.id.split('-').length - 1], 10);

    this._setState({
      ...this._state,
      offers: target.checked
        ? [...this._state.offers, offerID]
        : this._state.offers.filter((id) => id !== offerID),
    });
  };

  get template() {
    return createEditFormTemplate(this._state);
  }

  // Переводим событие в состояние
  static parseEventToState (event) {
    return {...event};
  }

  // Переводим состояние в событие (т.к. новые тип события и точка назначения появляются не при переходе в вид формы, а только при изменении пользователем — передаём их в именно в эту фунцию, а не добавляем в parseEventToState)
  static parseStateToEvent (state) {
    return {...state};
  }

  reset (event) {
    this.updateElement(NewEditFormView.parseEventToState(event));
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }
}
