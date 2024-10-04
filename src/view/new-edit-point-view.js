import AbstractView from '../framework/view/abstract-view';

function createEditPointTemplate (event) {

  const {
    eventTypeItemsList,
    type,
    cityInfo,
    destinationListOptions,
    photosContainer,
    eventDatetimeFrom,
    eventDatetimeTo,
    base_price,
    offersSection,
    descriptionSection
  } = event;

  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-2">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-2" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${eventTypeItemsList}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${ type }
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${ cityInfo.name }" list="destination-list-1">
                    <datalist id="destination-list-1">
                      ${destinationListOptions}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${ eventDatetimeFrom }">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${ eventDatetimeTo }">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${ base_price }">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  ${offersSection}

                  ${descriptionSection}

                  ${photosContainer}
                </section>
              </form>
            </li>`;
}

export default class NewEditPointView extends AbstractView {

  #event = null;
  #onEditPointSubmit = null;

  constructor ({event, onEditPointSubmit}) {
    super();
    this.#event = event;
    // Получаем обработчик сабмита формы снаружи
    this.#onEditPointSubmit = onEditPointSubmit;
    this.element.querySelector('.event').addEventListener('submit', (submitEvent) => this.#handleEditPointSubmit(submitEvent));
    this.element.querySelector('.event__rollup-btn').addEventListener('click', (submitEvent) => this.#handleEditPointSubmit(submitEvent));
  }

  // Делаем на основе обработчика новый обработчик
  #handleEditPointSubmit = (submitEvent) => {
    submitEvent.preventDefault();
    this.#onEditPointSubmit();
  };

  get template() {
    return createEditPointTemplate(this.#event);
  }
}
