import AbstractView from '../framework/view/abstract-view';

function editFormEventOfferSelectorTemplate (offerCheckedAttribute, offerTitle, offerPrice, offerID) {
  return `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerTitle.replace(/\s/g, '-')}-${offerID}" type="checkbox" name="event-offer-${offerTitle.replace(/\s/g, '-')}" ${offerCheckedAttribute}>
            <label class="event__offer-label" for="event-offer-${offerTitle.replace(/\s/g, '-')}-${offerID}">
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
  #offerID = null;

  constructor ({ offerCheckedAttribute, offerTitle, offerPrice, offerID }) {
    super();
    this.#offerCheckedAttribute = offerCheckedAttribute;
    this.#offerTitle = offerTitle;
    this.#offerPrice = offerPrice;
    this.#offerID = offerID;
  }

  get template () {
    return editFormEventOfferSelectorTemplate(this.#offerCheckedAttribute, this.#offerTitle, this.#offerPrice, this.#offerID);
  }
}
