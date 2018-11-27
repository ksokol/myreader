import angular from 'angular'
import ngRedux from 'ng-redux'
import '@uirouter/angularjs'
import 'ngreact'

import {ENVIRONMENT, isInDevMode, isInProdMode} from './constants'
import {installMediaBreakpointActionDispatcher} from './store/common/media-breakpoints'
import {ButtonGroupComponent} from './shared/component/button-group/button-group.component'
import {ButtonComponent} from './shared/component/button/button.component'
import {FeedComponent, FeedTitleInput, FeedUrlInput} from './feed/feed.component'
import {FeedListComponent} from './feed/feed-list.component'
import {LoginComponent, LoginEmailInput, LoginPasswordInput} from './login/login.component'
import {SubscribeComponent, SubscribeOriginInput} from './subscription/subscribe/subscribe.component'
import {SubscriptionExclusionComponent} from './subscription/subscription-exclusion/subscription-exclusion.component'
import {
  SubscriptionComponent,
  SubscriptionTitleInput,
  SubscriptionUrlInput
} from './subscription/subscription.component'
import {AutoScrollComponent} from './shared/component/auto-scroll/auto-scroll.component'
import createApplicationStore from './store/bootstrap'
import {ListPageComponent} from './shared/component/list-page/list-page.component'
import {BookmarkComponent} from './bookmark/bookmark.component'
import {SubscriptionListComponent} from './subscription/subscription-list.component'
import {HotkeysComponent} from './shared/component/hotkeys/hotkeys.component'
import {FeedStreamComponent} from './feed-stream/feed-stream.component'
import {AppComponent} from './app.component'
import createRouterMiddleware from './store/middleware/router'
import uiRouterAdapter from './shared/router/uiRouterAdapter'
import uiRouterStartTransitionHandler from './shared/router/uiRouterStartTransitionHandler'
import {BackdropComponent} from './shared/component/backdrop/backdrop.component'
import {
  AutocompleteInput,
  AutoCompleteInputComponent,
  AutocompleteSuggestionsComponent
} from './shared/component/autocomplete-input'
import {
  AutocompleteItemText,
  Button,
  Chips,
  FeedFetchErrors,
  Icon,
  IconButton,
  SearchInput,
  TimeAgo
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
  .value('TimeAgo', TimeAgo)
  .value('AutocompleteItemText', AutocompleteItemText)
  .value('FeedFetchErrors', FeedFetchErrors)

  .value('SubscriptionTitleInput', SubscriptionTitleInput)
  .value('SubscriptionUrlInput', SubscriptionUrlInput)
  .value('SubscribeOriginInput', SubscribeOriginInput)
  .value('LoginEmailInput', LoginEmailInput)
  .value('LoginPasswordInput', LoginPasswordInput)
  .value('FeedTitleInput', FeedTitleInput)
  .value('FeedUrlInput', FeedUrlInput)
  .value('SearchInput', SearchInput)
  .value('AutocompleteInput', AutocompleteInput)

  .component('myFeed', FeedComponent)
  .component('myFeedList', FeedListComponent)
  .component('myLogin', LoginComponent)
  .component('mySubscribe', SubscribeComponent)
  .component('mySubscriptionExclusion', SubscriptionExclusionComponent)
  .component('mySubscription', SubscriptionComponent)
  .component('myBookmark', BookmarkComponent)
  .component('mySubscriptionList', SubscriptionListComponent)
  .component('myFeedStream', FeedStreamComponent)
  .component('myApp', AppComponent)
  .component('myBackdrop', BackdropComponent)

  .component('myButtonGroup', ButtonGroupComponent)
  .component('myButton', ButtonComponent)
  .component('myAutoScroll', AutoScrollComponent)
  .component('myListPage', ListPageComponent)
  .component('myHotkeys', HotkeysComponent)
  .component('myAutocompleteInput', AutoCompleteInputComponent)
  .component('myAutocompleteSuggestions', AutocompleteSuggestionsComponent)

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
