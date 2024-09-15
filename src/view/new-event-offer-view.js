import { createElement } from '../render';

function createNewEventOfferTemplate (offer) {

  const {price, title} = offer;

  return `<li class="event__offer">
                    <span class="event__offer-title">${title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${price}</span>
                  </li>`;
}

export default class NewEventOfferView {

  constructor ({offer}) {
    this.offer = offer;
  }

  getTemplate() {
    return createNewEventOfferTemplate(this.offer);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
