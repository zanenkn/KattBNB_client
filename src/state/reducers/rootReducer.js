import hostProfileReducer from './hostProfileReducer';
import currentSearchReducer from './currentSearchReducer'
import currentHostProfileReducer from './currentHostProfileReducer'
import menuReducer from './menuReducer';
import { combineReducers } from 'redux';
import { reduxTokenAuthReducer } from 'redux-token-auth';

const rootReducer = combineReducers({
  reduxTokenAuth: reduxTokenAuthReducer,
  hostProfile: hostProfileReducer,
  currentSearch: currentSearchReducer,
  currentHostProfile: currentHostProfileReducer,
  menu: menuReducer 
});

export default rootReducer;
