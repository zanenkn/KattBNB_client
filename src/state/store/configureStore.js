import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers/rootReducer'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

const settings = process.env.NODE_ENV === 'development' ? (createStore(rootReducer, applyMiddleware(thunk, logger))) : (createStore(rootReducer, applyMiddleware(thunk)))

const configureStore = () => { return settings }

export default configureStore
