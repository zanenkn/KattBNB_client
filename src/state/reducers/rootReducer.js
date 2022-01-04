import animationReducer from './animationReducer';
import hostProfileReducer from './hostProfileReducer';
import currentSearchReducer from './currentSearchReducer'
import currentHostProfileReducer from './currentHostProfileReducer'
import { combineReducers } from 'redux';
import { reduxTokenAuthReducer } from 'redux-token-auth';

const rootReducer = combineReducers({
  animation: animationReducer,
  reduxTokenAuth: reduxTokenAuthReducer,
  hostProfile: hostProfileReducer,
  currentSearch: currentSearchReducer,
  currentHostProfile: currentHostProfileReducer,
});

export default rootReducer;
