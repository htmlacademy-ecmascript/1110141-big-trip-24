import AbstractView from '../framework/view/abstract-view';
import { capitalizeFirstLetter } from '../utils/common';

function editFormEventTypeItemTemplate (eventType, typeCheckedAttribute) {
  return `<div class="event__type-item">
            <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${typeCheckedAttribute ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${capitalizeFirstLetter(eventType)}</label>
          </div>`;
}

export default class newEditFormEventTypeItemView extends AbstractView {
  #eventType = null;
  #typeCheckedAttribute = null;

  constructor ({ eventType, typeCheckedAttribute }) {
    super();
    this.#eventType = eventType;
    this.#typeCheckedAttribute = typeCheckedAttribute;
    console.log(this.#typeCheckedAttribute, typeCheckedAttribute);
  }

  get template () {
    return editFormEventTypeItemTemplate(this.#eventType, this.#typeCheckedAttribute);
  }
}
