import { FilterType } from '../const';
import { isEventPast, isEventFuture, isEventPresent } from '../utils/event';

const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => isEventFuture(event)),
  [FilterType.PAST]: (events) => events.filter((event) => isEventPast(event)),
  [FilterType.PRESENT]: (events) => events.filter((event) => isEventPresent(event)),
};

export { filter };
