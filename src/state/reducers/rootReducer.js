import animationReducer from './animationReducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  animation: animationReducer,
})

export default rootReducer