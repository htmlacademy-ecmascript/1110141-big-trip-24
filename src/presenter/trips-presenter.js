import NewListFilterView from '../view/new-list-filter-view';
import NewListSortView from '../view/new-list-sort-view';
// import NewAddPointView from '../view/new-add-new-point-view';
import NewEditPointView from '../view/new-edit-point-view';
import NewListView from '../view/new-list-view';
import NewEventView from '../view/new-event-point-view';
import { render, replace } from '../framework/render';
import { formatDate, getCityInfoByID, capitalizeFirstLetter, isEscapeKey} from '../util';
import { DESTINATION_POINTS, OFFERS } from '../mock/trip-event-point';

export default class TripsPresenter {
  listElement = new NewListView();
  constructor({tripsModel}) {
    this.body = document.body;
    this.tripsModel = tripsModel;
  }

  /**
   * Подготавливает данные для формы редактирования точки маршрута.
   * @param {object} event - Объект события.
   * @returns {object} - Объект с подготовленными данными.
   */
  #prepareDataFormEditPointView (event) {
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

    // Фиксируем шаблон секции с офферами
    let offersSection = '';
    if (eventOfferItemsList) {
      offersSection = `<section class="event__section  event__section--offers">
                        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                        <div class="event__available-offers">
                          ${eventOfferItemsList}
                        </div>
                      </section>`;
    }

    // Фиксируем шаблон секции с описанием пункта на значения
    let descriptionSection = '';
    if (cityInfo.description) {
      descriptionSection = `<section class="event__section  event__section--destination">
                              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                              <p class="event__destination-description">${cityInfo.description}</p>
                            </section>`;
    }

    // Фиксируем шаблон блока с изображениями и шаблон самих изображений
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

    // Возвращаем подготовленные для использования данные
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

  /**
   * Метод инициализации страницы.
   */
  init() {
    // Получаем данные из модели
    this.tripPoints = [...this.tripsModel.getEvents()];

    // Вызываем метод отрисовывающий необходимые элементы
    this.#renderTrips();
  }

  /**
   * Метод отрисовки элементов на странице.
   */
  #renderTrips = () => {
    // Отрисовываем фильтры
    render(new NewListFilterView(), this.body.querySelector('.trip-controls__filters'));
    // Отрисовываем сортировку
    render(new NewListSortView(), this.body.querySelector('.trip-events'));
    // Получаем DOM элемент списка точек маршрута
    this.tripList = this.listElement.element;
    // Отрисовываем этот список
    render(this.listElement, this.body.querySelector('.trip-events'));

    // render(new NewAddPointView(), this.tripList);

    // Отрисовываем точки маршрута в цикле
    for (let i = 0; i < this.tripPoints.length; i++) {
      this.#renderEvent(this.tripPoints[i]);
    }
  };

  /**
   * Метод отрисовки точек маршрута с формами редактирования, а также закрепляем логику взаимодействия с элементами.
   * @param {object} event - Объект события.
   */
  #renderEvent = (event) => {
    // Функция скрывающая форму редактирования при нажатии ESC
    const onEscapeKeyDown = (keydownEvent) => {
      if (isEscapeKey(keydownEvent)) {
        keydownEvent.preventDefault();
        changeFormOnEvent();
        document.removeEventListener('keydown', onEscapeKeyDown);
      }
    };


    // Создаём экземпляры классов точки события и формы редактирования
    const eventView = new NewEventView({event, onEventRollupClick});
    const editPointView = new NewEditPointView({event: this.#prepareDataFormEditPointView(event), onEditPointSubmit});

    // Смена точки события на форму редактирования события
    function changeEventOnForm () {
      replace(editPointView, eventView);
    }

    // Смена точки формы редактирования события на точку события
    function changeFormOnEvent () {
      replace(eventView, editPointView);
    }

    // Обработчик клика по кнопке раскрытия точки маршрута
    function onEventRollupClick () {
      changeEventOnForm();
      document.addEventListener('keydown', onEscapeKeyDown);
    }

    // Обработчик клика по кнопке скрытия формы редактирования точки маршрута
    function onEditPointSubmit () {
      changeFormOnEvent();
      document.removeEventListener('keydown', onEscapeKeyDown);
    }

    render(eventView, this.tripList);
  };
}
