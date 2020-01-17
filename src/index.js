import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import configureStore from './state/store/configureStore'
import * as serviceWorker from './serviceWorker'
import { verifyCredentials } from './reduxTokenAuthConfig'
import axios from 'axios'
import './i18n'
import smoothscroll from 'smoothscroll-polyfill'


axios.defaults.baseURL = (process.env.NODE_ENV === 'development' ? 'http://localhost:3007' : process.env.REACT_APP_API_ENDPOINT)

const store = configureStore()
verifyCredentials(store)
smoothscroll.polyfill()

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)

serviceWorker.unregister()
