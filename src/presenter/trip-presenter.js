// Импорт вьюшек
import NewListFilterView from '../view/new-list-filter-view';
import NewListSortView from '../view/new-list-sort-view';
// Это до поры до времени import NewAddPointView from '../view/new-add-new-point-view';
import NewListView from '../view/new-list-view';
import NewNoPointView from '../view/no-points-view';

// Импорт вспомогательных функций
import { render } from '../framework/render';
import { generateFilter } from '../mock/filter';
import { EventPresenter } from './event-presenter';
import { updateItem } from '../utils/common';
import { SortType } from '../const';
import { sortByPrice, sortByTime, sortByDay } from '../utils/event';

export default class TripsPresenter {
  #listElement = null;
  #tripList = null;

  #eventPresenters = new Map();
  #events = [];
  #sourcedEvents = [];

  #sortComponent = null;

  #currentSortType = SortType.DEFAULT;

  constructor({tripsModel}) {
    this.body = document.body;
    this.tripsModel = tripsModel;
    this.#listElement = new NewListView();
  }

  /**
   * Метод инициализации страницы.
   */
  init() {
    // Получаем данные из модели
    this.#events = [...this.tripsModel.getEvents()];
    // Сразу сортируем точки маршрута по дате, т.к. это сортировка по-умолчанию
    this.#events.sort(sortByDay);
    // Массив для сброса точек маршрута на состояние "по-умолчанию"
    this.#sourcedEvents = [...this.tripsModel.getEvents()];
    // Сразу сортируем точки маршрута по дате, т.к. это сортировка по-умолчанию
    this.#sourcedEvents.sort(sortByDay);

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
  #renderTrips () {
    const filters = generateFilter(this.#events);
    // Отрисовываем фильтры

    render(new NewListFilterView({ filters }), this.body.querySelector('.trip-controls__filters'));

    // Получаем DOM элемент списка точек маршрута
    this.#tripList = this.#listElement.element;

    // render(new NewAddPointView(), this.tripList);

    // Проверяем, есть ли точки маршрута для отображения
    // TODO: Пока так, потом надо будет переделать фразы под каждый фильтр
    if (this.#events.length === 0) {
      // Если точек маршрута нет — выводим сообщение
      render(new NewNoPointView(), this.body.querySelector('.trip-events'));
    } else {
      this.#renderSort();
      // Отрисовываем сортировку
      render(this.#sortComponent, this.body.querySelector('.trip-events'));
      // Отрисовываем этот список
      render(this.#listElement, this.body.querySelector('.trip-events'));
      // Отрисовываем точки маршрута в цикле
      this.#renderEventsList();
    }
  }

  /**
   * Создаёт экземпляр презентера точки маршрута и отрисовывает её через метод init()
   * @param {event} event - Точка маршрута
   */
  #renderEvent (event) {
    const eventPresenter = new EventPresenter({
      onDataChange: this.#handleEventChange,
      tripList: this.#tripList,
      onModeChange: this.#handleModeChange,
    });
    this.#eventPresenters.set(event.id, eventPresenter);
    eventPresenter.init(event);
  }

  #renderEventsList() {
    this.#events.forEach((event) => this.#renderEvent(event));
  }

  /**
   * Создаёт экземпляр сортировки
   */
  #renderSort () {
    this.#sortComponent = new NewListSortView({
      onSortTypeChange: this.#handleSortTypeChange,
    });
  }

  /**
   * Сортирует точки маршрута по переданному типу сортировки
   * @param {string} sortType - тип по которому будем сортировать
   */
  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType && sortType !== undefined) {
      return;
    }

    this.#sortEvents(sortType);
    this.#clearEventsList();
    this.#renderEventsList();
  };

  #sortEvents (sortType) {
    switch (sortType) {
      case SortType.PRICE:
        this.#events.sort(sortByPrice);
        break;
      case SortType.TIME:
        this.#events.sort(sortByTime);
        break;
      case SortType.DEFAULT:
        this.#events = [...this.#sourcedEvents];
        break;
    }
    this.#currentSortType = sortType;
  }

  /**
   * Удаляет все точки маршрута
   */
  #clearEventsList () {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  /**
   * Отрисовывает изменённую точку маршрута
   * @param {event} updatedEvent - Обновленная точка маршрута
   */
  #handleEventChange = (updatedEvent) => {
    this.#listElement = updateItem(this.#events, updatedEvent);
    this.#sourcedEvents = updateItem(this.#sourcedEvents, updatedEvent);
    this.#eventPresenters.get(updatedEvent.id).init(updatedEvent, this.#tripList);
  };

  /**
   * Сбрасывает режим отображения (обычный или редактирование) точек маршрута
   */
  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };
}
