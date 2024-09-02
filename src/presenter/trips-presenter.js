import NewListFilterView from '../view/new-list-filter-view';
import NewListSortView from '../view/new-list-sort-view';
import NewAddPointView from '../view/new-add-new-point-view';
import NewEditPointView from '../view/new-edit-point-view';
import NewListView from '../view/new-list-view';
import NewListItemView from '../view/new-list-item-view';
import { render } from '../render';

const LIST_ITEMS_COUNT = 3;

export default class TripsPresenter {
  listElement = new NewListView();
  constructor() {
    this.body = document.body;
    this.LIST_ITEMS_COUNT = LIST_ITEMS_COUNT || this.LIST_ITEMS_COUNT;
  }

  init() {
    render(new NewListFilterView(), this.body.querySelector('.trip-controls__filters'));
    render(new NewListSortView(), this.body.querySelector('.trip-events'));
    const tripList = this.listElement.getElement();
    render(this.listElement, this.body.querySelector('.trip-events'));
    render(new NewAddPointView(), tripList);
    for (let i = 0; i < this.LIST_ITEMS_COUNT; i++) {
      render(new NewListItemView(), tripList);
    }

    render(new NewEditPointView(), tripList);
  }
}
