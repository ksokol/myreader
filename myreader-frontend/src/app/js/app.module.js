import angular from 'angular'
import ngRedux from 'ng-redux'
import '@uirouter/angularjs'
import 'ngreact'

import {ENVIRONMENT, isInDevMode, isInProdMode} from './constants'
import {installMediaBreakpointActionDispatcher} from './store/common/media-breakpoints'
import {FeedComponent, FeedTitleInput, FeedUrlInput} from './feed/feed.component'
import {LoginComponent} from './login/login.component'
import {SubscribeComponent, SubscribeOriginInput} from './subscription/subscribe/subscribe.component'
import {SubscriptionExclusionComponent} from './subscription/subscription-exclusion/subscription-exclusion.component'
import {
  SubscriptionComponent,
  SubscriptionTitleInput,
  SubscriptionUrlInput
} from './subscription/subscription.component'
import createApplicationStore from './store/bootstrap'
import {AppComponent} from './app.component'
import createRouterMiddleware from './store/middleware/router'
import uiRouterAdapter from './shared/router/uiRouterAdapter'
import uiRouterStartTransitionHandler from './shared/router/uiRouterStartTransitionHandler'
import {
  AutocompleteInput,
  Button,
  Chips,
  ConfirmButton,
  FeedFetchErrors,
  Icon,
  IconButton,
  LoginPage
} from './components'
import {ContainerComponentBridge} from './containers'

import './config'

angular
  .module('myreader', [ngRedux, 'common.config', 'ui.router', 'react'])
  .value('ContainerComponentBridge', ContainerComponentBridge)
  .value('Icon', Icon)
  .value('IconButton', IconButton)
  .value('Chips', Chips)
  .value('Button', Button)
  .value('AutocompleteInput', AutocompleteInput)

  .value('FeedFetchErrors', FeedFetchErrors)
  .value('SubscriptionTitleInput', SubscriptionTitleInput)
  .value('SubscriptionUrlInput', SubscriptionUrlInput)
  .value('SubscribeOriginInput', SubscribeOriginInput)
  .value('FeedTitleInput', FeedTitleInput)
  .value('FeedUrlInput', FeedUrlInput)
  .value('AutocompleteInput', AutocompleteInput)
  .value('LoginPage', LoginPage)
  .value('ConfirmButton', ConfirmButton)

  .component('myFeed', FeedComponent)
  .component('myLogin', LoginComponent)
  .component('mySubscribe', SubscribeComponent)
  .component('mySubscriptionExclusion', SubscriptionExclusionComponent)
  .component('mySubscription', SubscriptionComponent)
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
  .run(($rootScope, $ngRedux, $transitions) => {
    'ngInject'

    if (isInDevMode(ENVIRONMENT) || isInProdMode(ENVIRONMENT)) {
      $transitions.onStart({}, t => uiRouterStartTransitionHandler(t, $ngRedux, ENVIRONMENT))
    }

    // TODO Deletion hint: Don't forget to remove jest.useFakeTimers() in several tests
    const setTimeoutFn = window.setTimeout
    window.setTimeout = (fn, delay) => {
      return setTimeoutFn(() => {
        fn()
        $rootScope.$digest()
      }, delay)
    }
  })
