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

const store = createApplicationStore(
  ENVIRONMENT,
  [installMediaBreakpointActionDispatcher]
)

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
