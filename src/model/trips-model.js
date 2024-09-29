import { getRandomEvent } from '../mock/trip-event-point';

const TRIP_EVENT_POINTS_COUNT = 3;

export default class TripsModel {
  #points = Array.from({length: TRIP_EVENT_POINTS_COUNT}, getRandomEvent);

  getEvents() {
    return this.#points;
  }
}
