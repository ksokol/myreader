import '../css/mobile.css'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {HashRouter as Router} from 'react-router-dom'
import createApplicationStore from './store/createApplicationStore'
import {ENVIRONMENT} from './constants'
import registerServiceWorker from '../../registerServiceWorker'
import {LocationStateProvider} from './contexts/locationState/LocationStateProvider'
import App from './App'
import {init as initToast} from './components/Toast'
import {AppContextProvider} from './contexts'

const store = createApplicationStore(ENVIRONMENT)

initToast(store.dispatch)

ReactDOM.render(
  <Provider store={store}>
    <Router hashType='hashbang'>
      <LocationStateProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </LocationStateProvider>
    </Router>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()
