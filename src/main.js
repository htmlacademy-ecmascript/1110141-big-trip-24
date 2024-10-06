import TripsPresenter from './presenter/trip-presenter';
import TripsModel from './model/trip-model';

const tripsModel = new TripsModel();
const tripsPresenter = new TripsPresenter({tripsModel});


tripsPresenter.init();
