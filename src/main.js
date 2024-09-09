import TripsPresenter from './presenter/trips-presenter';
import TripsModel from './model/trips-model';

const tripsModel = new TripsModel();
const tripsPresenter = new TripsPresenter({tripsModel});


tripsPresenter.init();
