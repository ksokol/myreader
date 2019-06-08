import '../css/mobile.css'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {HashRouter as Router} from 'react-router-dom'
import createApplicationStore from './store/bootstrap'
import {ENVIRONMENT} from './constants'
import {installMediaBreakpointActionDispatcher} from './store/common/media-breakpoints'
import registerServiceWorker from '../../registerServiceWorker'
import {LocationStateProvider} from './contexts'
import App from './App'
import {api, AuthInterceptor, PendingFetchInterceptor} from './api'
import {init as initToast} from './components/Toast'

const store = createApplicationStore(
  ENVIRONMENT,
  [installMediaBreakpointActionDispatcher]
)

initToast(store.dispatch)

api.addInterceptor(new PendingFetchInterceptor(store.dispatch))
api.addInterceptor(new AuthInterceptor(store.dispatch))

ReactDOM.render(
  <Provider store={store}>
    <Router hashType="hashbang">
      <LocationStateProvider>
        <App />
      </LocationStateProvider>
    </Router>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()
