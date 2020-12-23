import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers/rootReducer';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

const settings =
  process.env.NODE_ENV === 'production'
    ? createStore(rootReducer, applyMiddleware(thunk))
    : createStore(rootReducer, applyMiddleware(thunk, logger));

const configureStore = () => {
  return settings;
};

export default configureStore;
