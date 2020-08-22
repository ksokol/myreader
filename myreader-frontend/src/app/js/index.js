import '../css/mobile.css'
import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter as Router} from 'react-router-dom'
import registerServiceWorker from '../../registerServiceWorker'
import {LocationStateProvider} from './contexts/locationState/LocationStateProvider'
import App from './App'
import {SecurityProvider} from './contexts/security/SecurityProvider'
import {HotkeysProvider} from './contexts/hotkeys/HotkeysProvider'
import {SettingsProvider} from './contexts/settings/SettingsProvider'
import {MediaBreakpointProvider} from './contexts/mediaBreakpoint/MediaBreakpointProvider'

ReactDOM.render(
  <Router hashType='hashbang'>
    <LocationStateProvider>
      <SecurityProvider>
        <HotkeysProvider>
          <SettingsProvider>
            <MediaBreakpointProvider>
              <App />
            </MediaBreakpointProvider>
          </SettingsProvider>
        </HotkeysProvider>
      </SecurityProvider>
    </LocationStateProvider>
  </Router>,
  document.querySelector('#root')
)

registerServiceWorker()
