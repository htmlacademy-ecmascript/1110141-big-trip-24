import NewListFilterView from '../view/new-list-filter-view';
import NewListSortView from '../view/new-list-sort-view';
import NewAddPointView from '../view/new-add-new-point-view';
import NewEditPointView from '../view/new-edit-point-view';
import NewListView from '../view/new-list-view';
import NewListItemView from '../view/new-list-item-view';
import { render } from '../render';

export default class TripsPresenter {
  listElement = new NewListView();
  constructor({tripsModel}) {
    this.body = document.body;
    this.tripsModel = tripsModel;
  }

  init() {
    this.tripPoints = [...this.tripsModel.getEventPoints()];
    render(new NewListFilterView(), this.body.querySelector('.trip-controls__filters'));
    render(new NewListSortView(), this.body.querySelector('.trip-events'));
    this.tripList = this.listElement.getElement();
    render(this.listElement, this.body.querySelector('.trip-events'));
    render(new NewAddPointView(), this.tripList);
    for (let i = 0; i < this.tripsModel.length; i++) {
      render(new NewListItemView(this.tripsModel[i]), this.tripList);
    }

    render(new NewEditPointView(), this.tripList);
  }
}
