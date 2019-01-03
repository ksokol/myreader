import angular from 'angular'
import '@uirouter/angularjs'
import 'ngreact'

import {ENVIRONMENT, isInDevMode, isInProdMode} from './constants'
import {installMediaBreakpointActionDispatcher} from './store/common/media-breakpoints'
import createApplicationStore from './store/bootstrap'
import {AppComponent, WithSidenav} from './app.component'
import createRouterMiddleware from './store/middleware/router'
import uiRouterAdapter from './shared/router/uiRouterAdapter'
import uiRouterStartTransitionHandler from './shared/router/uiRouterStartTransitionHandler'
import {ContainerComponentBridge} from './containers'

import './config'

angular
  .module('myreader', ['common.config', 'ui.router', 'react'])
  .value('ContainerComponentBridge', ContainerComponentBridge)
  .value('WithSidenav', WithSidenav)
  .component('myApp', AppComponent)

  // TODO part of AngularJS exit strategy
  .run(['$state', '$transitions', ($state, $transitions) => {
    const store = createApplicationStore(
      ENVIRONMENT,
      [installMediaBreakpointActionDispatcher],
      [createRouterMiddleware(uiRouterAdapter($state))]
    )

    if (isInDevMode(ENVIRONMENT) || isInProdMode(ENVIRONMENT)) {
      $transitions.onStart({}, t => uiRouterStartTransitionHandler(t, store, ENVIRONMENT))
    }
  }])
