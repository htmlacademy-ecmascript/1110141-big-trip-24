import AbstractView from '../framework/view/abstract-view';

function editFormEventPhotoContainerTemplate (pictures) {
  return `<div class="event__photos-container">
            <div class="event__photos-tape">
              ${pictures}
            </div>
          </div>`;
}

export default class newEditFormEventPhotoContainerView extends AbstractView {

  #pictures = null;

  constructor ({ pictures }) {
    super();
    this.#pictures = pictures;
  }

  get template () {
    return editFormEventPhotoContainerTemplate(this.#pictures);
  }
}
