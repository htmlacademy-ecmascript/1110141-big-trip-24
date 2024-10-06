// Импорт вьюшек
import NewEditFormView from '../view/new-edit-form-view';
import NewEventView from '../view/new-event-view';
import newEditFormEventTypeItemView from '../view/new-edit-form-event-type-item-view';
import newEditFormEventOfferSelectorView from '../view/new-edit-form-event-offer-selector-view';
import newEditFormOffersSectionView from '../view/new-event-offers-section-view';
import newEditFormEventDestinationSectionView from '../view/new-edit-form-event-destination-section-view';
import newEditFormEventPhotoContainerView from '../view/new-edit-form-event-photo-container-view';
import newEditFormEventPhotoView from '../view/new-edit-form-event-photo-view';

// Импорт вспомогательных функций
import { replace, render, remove } from '../framework/render';
import { isEscapeKey } from '../utils/common';
import { formatDate, getCityInfoByID } from '../utils/event';
import { getDatalistOption, getEventTypeData } from '../utils/form';

// Импорт моков
import { DESTINATION_POINTS, OFFERS } from '../mock/event';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class EventPresenter {
  #event = null;
  #tripList = null;

  #eventView = null;
  #editFormView = null;

  #handleDataChange = null;
  #handleModeChange = null;

  #mode = Mode.DEFAULT;

  constructor({ onDataChange, tripList, onModeChange }) {
    this.#handleDataChange = onDataChange;
    this.#tripList = tripList;
    this.#handleModeChange = onModeChange;
  }

  /**
   * Метод отрисовки точек маршрута с формами редактирования, а также закрепляем логику взаимодействия с элементами.
   * @param {object} event - Объект события.
   */
  init(event) {
    this.#event = event;

    const previousEventComponent = this.#eventView;
    const previousEditFormComponent = this.#editFormView;

    // Создаём экземпляры классов точки события и формы редактирования
    this.#eventView = new NewEventView({
      event: this.#event,
      onEventRollupClick: this.#onEventRollupClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });
    this.#editFormView = new NewEditFormView({
      event: this.#prepareDataForEditForm(this.#event),
      onEditFormSubmit: this.#onEditFormSubmit
    });

    if (previousEditFormComponent === null || previousEventComponent === null) {
      render(this.#eventView, this.#tripList);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventView, previousEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editFormView, previousEditFormComponent);
    }

    remove(previousEventComponent);
    remove(previousEditFormComponent);
  }

  destroy () {
    remove(this.#eventView);
    remove(this.#editFormView);
  }

  resetView () {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToEvent();
    }
  }

  // Функция скрывающая форму редактирования при нажатии ESC
  #onEscapeKeyDown = (keydownEvent) => {
    if (isEscapeKey(keydownEvent)) {
      keydownEvent.preventDefault();
      this.#replaceFormToEvent();
      document.removeEventListener('keydown', this.#onEscapeKeyDown);
    }
  };

  // Смена точки события на форму редактирования события
  #replaceEventToForm () {
    replace(this.#editFormView, this.#eventView);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  // Смена точки формы редактирования события на точку события
  #replaceFormToEvent () {
    replace(this.#eventView, this.#editFormView);
    this.#mode = Mode.DEFAULT;
  }

  // Обработчик клика по кнопке раскрытия точки маршрута
  #onEventRollupClick = () => {
    this.#replaceEventToForm();
    document.addEventListener('keydown', this.#onEscapeKeyDown);
  };

  // Обработчик клика по кнопке скрытия формы редактирования точки маршрута
  #onEditFormSubmit = (event) => {
    this.#replaceFormToEvent(event);
    document.removeEventListener('keydown', this.#onEscapeKeyDown);
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#event, is_favorite: !this.#event.is_favorite});
  };

  /**
   * Подготавливает данные для формы редактирования точки маршрута.
   * @param {object} event - Объект события.
   * @returns {object} - Объект с подготовленными данными.
   */
  #prepareDataForEditForm = (event) => {
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
  };
}

export { EventPresenter };
