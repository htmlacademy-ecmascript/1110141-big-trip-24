import AbstractView from '../framework/view/abstract-view';

function createNoPointTemplate() {
  return `<p class="trip-events__msg">
            Click New Event to create your first point
          </p>`;
}

export default class NewNoPointView extends AbstractView {
  get template() {
    return createNoPointTemplate();
  }
}
