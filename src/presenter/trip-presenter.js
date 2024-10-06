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

export default class TripsPresenter {
  listElement = new NewListView();
  #eventPresenters = new Map();

  constructor({tripsModel}) {
    this.body = document.body;
    this.tripsModel = tripsModel;
  }

  /**
   * Метод инициализации страницы.
   */
  init() {
    // Получаем данные из модели
    this.events = [...this.tripsModel.getEvents()];

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
    const filters = generateFilter(this.events);
    // Отрисовываем фильтры

    render(new NewListFilterView({ filters }), this.body.querySelector('.trip-controls__filters'));

    // Получаем DOM элемент списка точек маршрута
    this.tripList = this.listElement.element;

    // render(new NewAddPointView(), this.tripList);

    // Проверяем, есть ли точки маршрута для отображения
    // TODO: Пока так, потом надо будет переделать фразы под каждый фильтр
    if (this.events.length === 0) {
      // Если точек маршрута нет — выводим сообщение
      render(new NewNoPointView(), this.body.querySelector('.trip-events'));
    } else {
      // Отрисовываем сортировку
      render(new NewListSortView(), this.body.querySelector('.trip-events'));
      // Отрисовываем этот список
      render(this.listElement, this.body.querySelector('.trip-events'));
      // Отрисовываем точки маршрута в цикле
      for (let i = 0; i < this.events.length; i++) {
        const currentEvent = this.events[i];
        this.#renderEvent(currentEvent);
      }
    }
  }

  #clearEventsList () {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  #renderEvent (event) {
    const eventPresenter = new EventPresenter({ event });
    this.#eventPresenters.set(event.id, eventPresenter);
    eventPresenter.init(event, this.tripList);
  }

}
