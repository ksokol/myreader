import '../css/mobile.css'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {HashRouter as Router} from 'react-router-dom'
import createApplicationStore from './store/bootstrap'
import {ENVIRONMENT} from './constants'
import {installMediaBreakpointActionDispatcher} from './store/common/media-breakpoints'
import registerServiceWorker from '../../registerServiceWorker'
import {LocationStateProvider, NotificationProvider} from './contexts'
import App from './App'
import {api, authInterceptor} from './api'

const store = createApplicationStore(
  ENVIRONMENT,
  [installMediaBreakpointActionDispatcher]
)

api.addResponseInterceptor(authInterceptor(store.dispatch))

ReactDOM.render(
  <Provider store={store}>
    <Router hashType="hashbang">
      <LocationStateProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </LocationStateProvider>
    </Router>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()
