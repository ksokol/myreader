import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter as Router} from 'react-router-dom'
import {register} from 'register-service-worker'
import {LocationStateProvider} from './contexts/locationState/LocationStateProvider'
import App from './App'
import {SecurityProvider} from './contexts/security/SecurityProvider'
import {SettingsProvider} from './contexts/settings/SettingsProvider'
import {MediaBreakpointProvider} from './contexts/mediaBreakpoint/MediaBreakpointProvider'

ReactDOM.render(
  <Router hashType='hashbang'>
    <LocationStateProvider>
      <SecurityProvider>
        <SettingsProvider>
          <MediaBreakpointProvider>
            <App />
          </MediaBreakpointProvider>
        </SettingsProvider>
      </SecurityProvider>
    </LocationStateProvider>
  </Router>,
  document.querySelector('#root')
)

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.PUBLIC_URL}/service-worker.js`)
}
