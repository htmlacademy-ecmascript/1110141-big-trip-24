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

  #activeForm = null;

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
    this.#activeForm = this.#editFormView;
  }

  // Смена точки формы редактирования события на точку события
  #replaceFormToEvent () {
    if (this.#activeForm === null) {
      return;
    }
    replace(this.#eventView, this.#editFormView);
    this.#mode = Mode.DEFAULT;
    this.#activeForm = null;
  }

  // Обработчик клика по кнопке раскрытия точки маршрута
  #onEventRollupClick = () => {
    this.#replaceEventToForm();
    document.addEventListener('keydown', this.#onEscapeKeyDown);
  };

  // Обработчик подтверждения (submit) формы редактирования точки маршрута
  #onEditFormSubmit = (event) => {
    this.#replaceFormToEvent(event);
    document.removeEventListener('keydown', this.#onEscapeKeyDown);
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#event, is_favorite: !this.#event.is_favorite});
  };

  /**
   * Подготавливает данные для формы редактирования события.
   * @param {object} event - Объект события.
   * @returns {object} - Объект с подготовленными данными.
   */
  #prepareDataForEditForm(event) {
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
        const editFormEventOfferSelector = new newEditFormEventOfferSelectorView({ offerCheckedAttribute, offerTitle, offerPrice });
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
  }
}

export { EventPresenter };
