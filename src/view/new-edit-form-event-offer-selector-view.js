import AbstractView from '../framework/view/abstract-view';

function editFormEventOfferSelectorTemplate (offerCheckedAttribute, offerTitle, offerPrice) {
  return `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${offerCheckedAttribute}>
            <label class="event__offer-label" for="event-offer-luggage-1">
              <span class="event__offer-title">${offerTitle}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offerPrice}</span>
            </label>
          </div>`;
}

export default class newEditFormEventOfferSelectorView extends AbstractView {

  #offerCheckedAttribute = null;
  #offerTitle = null;
  #offerPrice = null;

  constructor ({ offerCheckedAttribute, offerTitle, offerPrice }) {
    super();
    this.#offerCheckedAttribute = offerCheckedAttribute;
    this.#offerTitle = offerTitle;
    this.#offerPrice = offerPrice;
  }

  get template () {
    return editFormEventOfferSelectorTemplate(this.#offerCheckedAttribute, this.#offerTitle, this.#offerPrice);
  }
}
