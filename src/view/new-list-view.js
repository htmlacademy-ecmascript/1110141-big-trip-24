import AbstractView from '../framework/view/abstract-view.js';

function createNewListTemplate () {
  return '<ul class="trip-events__list"></ul>';
}

export default class NewListView extends AbstractView {
  get template() {
    return createNewListTemplate();
  }
}
