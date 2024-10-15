// Импорт вьюшек
import NewEditFormView from '../view/new-edit-form-view';
import NewEventView from '../view/new-event-view';

// Импорт вспомогательных функций
import { replace, render, remove } from '../framework/render';
import { isEscapeKey } from '../utils/common';

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
      event: this.#event,
      onEditFormSubmit: this.#onEditFormSubmit,
      onRollupClick: this.#onRollupClick,
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
      this.#editFormView.reset(this.#event);
      this.#replaceFormToEvent();
    }
  }

  #onRollupClick = () => {
    this.resetView();
  };

  // Функция скрывающая форму редактирования при нажатии ESC
  #onEscapeKeyDown = (keydownEvent) => {
    if (isEscapeKey(keydownEvent)) {
      keydownEvent.preventDefault();
      this.resetView();
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
    this.#handleDataChange(event);
    this.#replaceFormToEvent(event);
    document.removeEventListener('keydown', this.#onEscapeKeyDown);
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#event, is_favorite: !this.#event.is_favorite});
  };
}

export { EventPresenter };
