import AbstractView from '../framework/view/abstract-view';

function createNewFilterItemTemplate(filter, isChecked) {
  const {type, count} = filter;

  return `<div class="trip-filters__filter">
            <input
              id="filter-${ type }"
              class="trip-filters__filter-input visually-hidden"
              type="radio"
              name="trip-filter"
              value="${ type }"
              ${ count === 0 ? 'disabled' : '' }
              ${ isChecked ? 'checked' : '' }>
            <label class="trip-filters__filter-label" for="filter-${ type }">${ type }</label>
          </div>`;
}

function createNewListFilterTemplate (filterItems) {
  const filterItemsTemplate = filterItems.map((filter, index) => createNewFilterItemTemplate(filter, index === 0)).join('');
  return `<form class="trip-filters" action="#" method="get">
            ${filterItemsTemplate}
            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
}

export default class NewListFilterView extends AbstractView {

  #filters = null;

  constructor({ filters }) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createNewListFilterTemplate(this.#filters);
  }
}
