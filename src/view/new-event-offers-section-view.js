import AbstractView from '../framework/view/abstract-view';

function editFormOffersSectionTemplate (eventOfferItemsList) {
  return `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${eventOfferItemsList}
            </div>
          </section>`;
}

export default class newEditFormOffersSectionView extends AbstractView {

  #eventOfferItemsList = null;

  constructor ({ eventOfferItemsList }) {
    super();
    this.#eventOfferItemsList = eventOfferItemsList;
  }

  get template () {
    return editFormOffersSectionTemplate(this.#eventOfferItemsList);
  }
}
