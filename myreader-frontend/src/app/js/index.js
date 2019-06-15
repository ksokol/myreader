import '../css/mobile.css'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {HashRouter as Router} from 'react-router-dom'
import createApplicationStore from './store/createApplicationStore'
import {ENVIRONMENT} from './constants'
import registerServiceWorker from '../../registerServiceWorker'
import LocationStateProvider from './contexts/locationState/LocationStateProvider'
import App from './App'
import {api, AuthInterceptor, PendingFetchInterceptor} from './api'
import {init as initToast} from './components/Toast'
import {MediaBreakpointProvider} from './contexts/mediaBreakpoint/MediaBreakpointProvider'

const store = createApplicationStore(ENVIRONMENT)

initToast(store.dispatch)

api.addInterceptor(new PendingFetchInterceptor(store.dispatch))
api.addInterceptor(new AuthInterceptor(store.dispatch))

ReactDOM.render(
  <Provider store={store}>
    <MediaBreakpointProvider>
      <Router hashType="hashbang">
        <LocationStateProvider>
          <App />
        </LocationStateProvider>
      </Router>
    </MediaBreakpointProvider>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()
