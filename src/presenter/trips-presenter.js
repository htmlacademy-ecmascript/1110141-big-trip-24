// Импорт вьюшек
import NewListFilterView from '../view/new-list-filter-view';
import NewListSortView from '../view/new-list-sort-view';
// Это до поры до времени import NewAddPointView from '../view/new-add-new-point-view';
import NewEditPointView from '../view/new-edit-point-view';
import NewListView from '../view/new-list-view';
import NewEventView from '../view/new-event-point-view';
import NewNoPointView from '../view/no-points-view';
import newEditFormEventTypeItemView from '../view/new-edit-form-event-type-item-view';
import newEditFormEventOfferSelectorView from '../view/new-edit-form-event-offer-selector-view';
import newEditFormOffersSectionView from '../view/new-event-offers-section-view';
import newEditFormEventDestinationSectionView from '../view/new-edit-form-event-destination-section-view';
import newEditFormEventPhotoContainerView from '../view/new-edit-form-event-photo-container-view';
import newEditFormEventPhotoView from '../view/new-edit-form-event-photo-view';

// Импорт вспомогательных функций
import { render, replace } from '../framework/render';
import { formatDate, getCityInfoByID } from '../utils/event';
import { isEscapeKey } from '../utils/common';
import { generateFilter } from '../mock/filter';
import { getDatalistOption, getEventTypeData } from '../utils/form';

// Импорт моков
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

    // Получаем информацию о пункте назначения
    const cityInfo = getCityInfoByID(destination, DESTINATION_POINTS);
    // Получаем дату-вреся начала события
    const eventDatetimeFrom = formatDate(date_from, 'D/M/YY HH:mm');
    // Получаем дату-время конца события
    const eventDatetimeTo = formatDate(date_to, 'D/M/YY HH:mm');
    // Получаем список возможных пунктов назнчачения для datalist
    const destinationListOptions = getDatalistOption(DESTINATION_POINTS);

    // Получаем список типов событий
    const eventTypeData = getEventTypeData(OFFERS, type);
    const eventTypeItemsList = eventTypeData.map((pointData) => {
      const { eventType, isChecked } = pointData;
      console.log(isChecked);
      const editFormEventTypeItem = new newEditFormEventTypeItemView({ eventType, isChecked });
      return editFormEventTypeItem.template;
    }).join('');

    // Получаем все офферы того же типа что и событие
    let eventOfferItemsList = '';
    const selectedOffers = OFFERS.find((point) => point.type === type)?.offers || [];

    const checkedOffersSet = new Set(offers);

    selectedOffers.forEach((offer) => {
      const offerTitle = offer.title;
      const offerPrice = offer.price;
      // Проверяем наличие оффера в Set
      const offerCheckedAttribute = checkedOffersSet.has(offer.id) ? 'checked' : '';
      const editFormEventOfferSelector = new newEditFormEventOfferSelectorView({ offerCheckedAttribute, offerTitle, offerPrice });
      eventOfferItemsList += editFormEventOfferSelector.template;
    });

    // Фиксируем шаблон секции с офферами
    let offersSection = '';
    if (eventOfferItemsList) {
      const editOffersSection = new newEditFormOffersSectionView({ eventOfferItemsList });
      offersSection = editOffersSection.template;
    }

    // Фиксируем шаблон секции с описанием пункта на значения
    let descriptionSection = '';
    if (cityInfo.description) {
      const editFormOffersSection = new newEditFormEventDestinationSectionView({ description: cityInfo.description });
      descriptionSection = editFormOffersSection.template;
    }

    // Фиксируем шаблон блока с изображениями и шаблон самих изображений
    let photosContainer = '';
    if (cityInfo.pictures.length) {
      let pictures = '';
      cityInfo.pictures.forEach((picture) => {
        const editFormEventPhoto = new newEditFormEventPhotoView({ src: picture.src, description: picture.description })
        pictures += editFormEventPhoto.template;
      });
      const editFormEventPhotoContainer = new newEditFormEventPhotoContainerView({ pictures });
      photosContainer = editFormEventPhotoContainer.template;
    }

    // Возвращаем подготовленные для использования данные
    return {
      type,
      base_price,
      eventDatetimeFrom,
      eventDatetimeTo,
      cityInfo,
      destinationListOptions,
      eventTypeItemsList,
      offersSection,
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
   * Метод отрисовки элементов на странице
   */

  /**
   * TODO: Переделать так, чтобы отрисовывать не в this.body.querySelector('.trip-controls__filters') а в, например, this.tripMain.element
   * (с другой стороны декомпозируя это всё дальше в один момент упрусь в то, что все эти экземпляры классов нужно куда-то вставлять через querySelector)
   */
  #renderTrips = () => {
    const filters = generateFilter(this.tripPoints);
    // Отрисовываем фильтры

    render(new NewListFilterView({ filters }), this.body.querySelector('.trip-controls__filters'));

    // Получаем DOM элемент списка точек маршрута
    this.tripList = this.listElement.element;

    // render(new NewAddPointView(), this.tripList);

    // Проверяем, есть ли точки маршрута для отображения
    // TODO: Пока так, потом надо будет переделать фразы под каждый фильтр
    if (this.tripPoints.length === 0) {
      // Если точек маршрута нет — выводим сообщение
      render(new NewNoPointView(), this.body.querySelector('.trip-events'));
    } else {
      // Отрисовываем сортировку
      render(new NewListSortView(), this.body.querySelector('.trip-events'));
      // Отрисовываем этот список
      render(this.listElement, this.body.querySelector('.trip-events'));
      // Отрисовываем точки маршрута в цикле
      for (let i = 0; i < this.tripPoints.length; i++) {
        this.#renderEvent(this.tripPoints[i]);
      }
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
