import angular from 'angular'
import ngRedux from 'ng-redux'
import '@uirouter/angularjs'
import 'ngreact'

import {ENVIRONMENT, isInDevMode, isInProdMode} from './constants'
import {installMediaBreakpointActionDispatcher} from './store/common/media-breakpoints'
import {FeedComponent, FeedTitleInput, FeedUrlInput} from './feed/feed.component'
import {LoginComponent} from './login/login.component'
import createApplicationStore from './store/bootstrap'
import {AppComponent} from './app.component'
import createRouterMiddleware from './store/middleware/router'
import uiRouterAdapter from './shared/router/uiRouterAdapter'
import uiRouterStartTransitionHandler from './shared/router/uiRouterStartTransitionHandler'
import {Button, Chips, ConfirmButton, FeedFetchErrors, Icon, IconButton} from './components'
import {ContainerComponentBridge} from './containers'
import {LoginPage} from './pages'

import './config'

angular
  .module('myreader', [ngRedux, 'common.config', 'ui.router', 'react'])
  .value('ContainerComponentBridge', ContainerComponentBridge)
  .value('Icon', Icon)
  .value('IconButton', IconButton)
  .value('Chips', Chips)
  .value('Button', Button)

  .value('FeedFetchErrors', FeedFetchErrors)
  .value('FeedTitleInput', FeedTitleInput)
  .value('FeedUrlInput', FeedUrlInput)
  .value('LoginPage', LoginPage)
  .value('ConfirmButton', ConfirmButton)

  .component('myFeed', FeedComponent)
  .component('myLogin', LoginComponent)
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
