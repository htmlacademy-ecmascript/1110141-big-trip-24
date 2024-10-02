import AbstractView from '../framework/view/abstract-view';

function editFormEventPhotoTemplate (src, description) {
  return `<img class="event__photo" src="${src}" alt="${description} photo"></img>`;
}

export default class newEditFormEventPhotoView extends AbstractView {

  #src = null;
  #description = null;

  constructor ({ src, description }) {
    super();
    this.#src = src;
    this.#description = description;
  };

  get template () {
    return editFormEventPhotoTemplate(this.#src, this.#description);
  }
}
