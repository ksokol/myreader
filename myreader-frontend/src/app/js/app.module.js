import angular from 'angular'
import ngRedux from 'ng-redux'
import '@uirouter/angularjs'
import 'ngreact'

import {ENVIRONMENT, isInDevMode, isInProdMode} from './constants'
import {installMediaBreakpointActionDispatcher} from './store/common/media-breakpoints'
import createApplicationStore from './store/bootstrap'
import {AppComponent} from './app.component'
import createRouterMiddleware from './store/middleware/router'
import uiRouterAdapter from './shared/router/uiRouterAdapter'
import uiRouterStartTransitionHandler from './shared/router/uiRouterStartTransitionHandler'
import {IconButton} from './components'
import {ContainerComponentBridge} from './containers'

import './config'

angular
  .module('myreader', [ngRedux, 'common.config', 'ui.router', 'react'])
  .value('ContainerComponentBridge', ContainerComponentBridge)
  .value('IconButton', IconButton)

  .component('myApp', AppComponent)

  .config(['$ngReduxProvider', $ngReduxProvider => $ngReduxProvider.createStoreWith(state => state, [], ['myStoreEnhancer'])])

  // TODO part of AngularJS exit strategy
  .factory('myStoreEnhancer', ($rootScope, $state) => {
    'ngInject'
    return () => () => {
      const routerMiddleware = createRouterMiddleware(uiRouterAdapter($state))

      const digestMiddleware = () => next => action => {
        const result = next(action)
        $rootScope.$evalAsync(result)
        return result
      }

      return createApplicationStore(
        ENVIRONMENT,
        [installMediaBreakpointActionDispatcher],
        [routerMiddleware, digestMiddleware]
      )
    }
  })
  // TODO part of AngularJS exit strategy
  .run(($ngRedux, $transitions) => {
    'ngInject'

    if (isInDevMode(ENVIRONMENT) || isInProdMode(ENVIRONMENT)) {
      $transitions.onStart({}, t => uiRouterStartTransitionHandler(t, $ngRedux, ENVIRONMENT))
    }
  })
