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
import { disableReactDevTools } from '@fvilers/disable-react-devtools'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

process.env.NODE_ENV === 'production' && disableReactDevTools()

axios.defaults.baseURL = (process.env.NODE_ENV === 'development' ? 'http://localhost:3007' : process.env.REACT_APP_API_ENDPOINT)

const stripePromise = loadStripe(process.env.REACT_APP_OFFICIAL === 'yes' ? process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY_LIVE : process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY_TEST)

const store = configureStore()
verifyCredentials(store)

smoothscroll.polyfill()

ReactDOM.render(
  <Provider store={store}>
    <Elements stripe={stripePromise}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Elements>
  </Provider>,
  document.getElementById('root')
)

serviceWorker.unregister()
