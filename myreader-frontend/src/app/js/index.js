import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter as Router} from 'react-router-dom'
import {register} from 'register-service-worker'
import App from './App'
import {SecurityProvider} from './contexts/security/SecurityProvider'
import {SettingsProvider} from './contexts/settings/SettingsProvider'

ReactDOM.render(
  <Router hashType='hashbang'>
    <SecurityProvider>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </SecurityProvider>
  </Router>,
  document.querySelector('#root')
)

register('./service-worker.js')
