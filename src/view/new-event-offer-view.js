import AbstractView from '../framework/view/abstract-view';

function createNewEventOfferTemplate (offer) {

  const {price, title} = offer;

  return `<li class="event__offer">
                    <span class="event__offer-title">${title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${price}</span>
                  </li>`;
}

export default class NewEventOfferView extends AbstractView {

  #offer = null;

  constructor ({offer}) {
    super();
    this.#offer = offer;
  }

  get template() {
    return createNewEventOfferTemplate(this.#offer);
  }
}
