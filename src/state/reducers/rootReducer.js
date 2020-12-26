import animationReducer from './animationReducer';
import { combineReducers } from 'redux';
import { reduxTokenAuthReducer } from 'redux-token-auth';

const rootReducer = combineReducers({
  animation: animationReducer,
  reduxTokenAuth: reduxTokenAuthReducer,
});

export default rootReducer;
