import '../css/mobile.css'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {servicesPlugin} from '@uirouter/core'
import {hashLocationPlugin, UIRouter, UIRouterReact} from '@uirouter/react'
import createApplicationStore from './store/bootstrap'
import {ENVIRONMENT, isInDevMode, isInProdMode} from './constants'
import {installMediaBreakpointActionDispatcher} from './store/common/media-breakpoints'
import createRouterMiddleware from './store/middleware/router'
import uiRouterAdapter from './shared/router/uiRouterAdapter'
import uiRouterStartTransitionHandler from './shared/router/uiRouterStartTransitionHandler'
import registerServiceWorker from '../../registerServiceWorker'
import App from './App'
import configureStates from './configureStates'

const router = new UIRouterReact()
router.plugin(servicesPlugin)
router.plugin(hashLocationPlugin)
configureStates(router)

const store = createApplicationStore(
  ENVIRONMENT,
  [installMediaBreakpointActionDispatcher],
  [createRouterMiddleware(uiRouterAdapter(router.stateService))]
)

if (isInDevMode(ENVIRONMENT) || isInProdMode(ENVIRONMENT)) {
  router.transitionService.onStart({}, transition => uiRouterStartTransitionHandler(transition, store, ENVIRONMENT))
}

ReactDOM.render(
  <Provider store={store}>
    <UIRouter router={router}>
      <App />
    </UIRouter>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()
