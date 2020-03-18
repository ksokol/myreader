import '../css/mobile.css'
import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter as Router} from 'react-router-dom'
import registerServiceWorker from '../../registerServiceWorker'
import {LocationStateProvider} from './contexts/locationState/LocationStateProvider'
import App from './App'
import {AppContextProvider} from './contexts'

ReactDOM.render(
  <Router hashType='hashbang'>
    <LocationStateProvider>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </LocationStateProvider>
  </Router>,
  document.querySelector('#root')
)

registerServiceWorker()
