import animationReducer from './animationReducer';
import hostProfileReducer from './hostProfileReducer';
import { combineReducers } from 'redux';
import { reduxTokenAuthReducer } from 'redux-token-auth';

const rootReducer = combineReducers({
  animation: animationReducer,
  reduxTokenAuth: reduxTokenAuthReducer,
  hostProfile: hostProfileReducer,
});

export default rootReducer;
