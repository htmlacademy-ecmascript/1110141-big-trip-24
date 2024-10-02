import AbstractView from '../framework/view/abstract-view';

function editFormEventDestinationSectionTemplate (description) {
  return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>
          </section>`;
}

export default class newEditFormEventDestinationSectionView extends AbstractView {

  #description = null;

  constructor ({ description }) {
    super();
    this.#description = description;
  }

  get template () {
    return editFormEventDestinationSectionTemplate(this.#description);
  }
}
