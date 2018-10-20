import angular from 'angular'
import ngRedux from 'ng-redux'
import '@uirouter/angularjs'
import 'ngreact'

import {ENVIRONMENT, isInDevMode, isInProdMode} from './constants'
import {installMediaBreakpointActionDispatcher} from './store/common/media-breakpoints'
import {TimeagoFilter} from './shared/timeago/timeago.filter'
import {FeedFetchErrorComponent, FeedFetchErrorLoadMore} from './feed/feed-fetch-error/feed-fetch-error.component'
import {IconComponent} from './shared/component/icon/icon.component'
import {ButtonGroupComponent} from './shared/component/button-group/button-group.component'
import {ButtonComponent} from './shared/component/button/button.component'
import {FeedComponent, FeedTitleInput, FeedUrlInput} from './feed/feed.component'
import {SearchInput, SearchInputComponent} from './shared/component/search-input/search-input.component'
import {FeedListComponent} from './feed/feed-list.component'
import {LoginComponent, LoginEmailInput, LoginPasswordInput} from './login/login.component'
import {AboutComponent} from './maintenance/about/about.component'
import {MaintenanceActionsComponent} from './maintenance/maintenance-actions/maintenance-actions.component'
import {MaintenanceComponent} from './maintenance/maintenance.component'
import {SubscribeComponent, SubscribeOriginInput} from './subscription/subscribe/subscribe.component'
import {SubscriptionExclusionComponent} from './subscription/subscription-exclusion/subscription-exclusion.component'
import {
  SubscriptionComponent,
  SubscriptionTitleInput,
  SubscriptionUrlInput
} from './subscription/subscription.component'
import {ToastComponent} from './shared/component/toast/toast.component'
import {AutoScrollComponent} from './shared/component/auto-scroll/auto-scroll.component'
import {EntryListComponent} from './entry/entry-list.component'
import createApplicationStore from './store/bootstrap'
import {ListPageComponent} from './shared/component/list-page/list-page.component'
import {BookmarkComponent} from './bookmark/bookmark.component'
import {SubscriptionListComponent} from './subscription/subscription-list.component'
import {HotkeysComponent} from './shared/component/hotkeys/hotkeys.component'
import {FeedStreamComponent} from './feed-stream/feed-stream.component'
import {AppComponent} from './app.component'
import {NavigationComponent} from './navigation/navigation.component'
import createRouterMiddleware from './store/middleware/router'
import uiRouterAdapter from './shared/router/uiRouterAdapter'
import uiRouterStartTransitionHandler from './shared/router/uiRouterStartTransitionHandler'
import {BackdropComponent} from './shared/component/backdrop/backdrop.component'
import {
  AutocompleteInput,
  AutoCompleteInputComponent,
  AutocompleteSuggestionsComponent,
  AutocompleteSuggestionsItemTextComponent
} from './shared/component/autocomplete-input'
import {IconButtonComponent} from './shared/component/buttons/icon-button/icon-button.component'
import {
  Button,
  Chips,
  EntryList,
  Icon,
  IconButton,
  Navigation,
  Settings,
  SubscriptionNavigationItem
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

  .value('SubscriptionTitleInput', SubscriptionTitleInput)
  .value('SubscriptionUrlInput', SubscriptionUrlInput)
  .value('SubscribeOriginInput', SubscribeOriginInput)
  .value('LoginEmailInput', LoginEmailInput)
  .value('LoginPasswordInput', LoginPasswordInput)
  .value('FeedTitleInput', FeedTitleInput)
  .value('FeedUrlInput', FeedUrlInput)
  .value('SearchInput', SearchInput)
  .value('AutocompleteInput', AutocompleteInput)
  .value('FeedFetchErrorLoadMore', FeedFetchErrorLoadMore)
  .value('EntryList', EntryList)
  .value('SubscriptionNavigationItem', SubscriptionNavigationItem)
  .value('Navigation', Navigation)
  .value('Settings', Settings)

  .component('myFeedFetchError', FeedFetchErrorComponent)
  .component('myFeed', FeedComponent)
  .component('myFeedList', FeedListComponent)
  .component('myLogin', LoginComponent)
  .component('myAbout', AboutComponent)
  .component('myMaintenanceActions', MaintenanceActionsComponent)
  .component('myMaintenance', MaintenanceComponent)
  .component('mySubscribe', SubscribeComponent)
  .component('mySubscriptionExclusion', SubscriptionExclusionComponent)
  .component('mySubscription', SubscriptionComponent)
  .component('myEntryList', EntryListComponent)
  .component('myBookmark', BookmarkComponent)
  .component('mySubscriptionList', SubscriptionListComponent)
  .component('myFeedStream', FeedStreamComponent)
  .component('myApp', AppComponent)
  .component('myNavigation', NavigationComponent)
  .component('myBackdrop', BackdropComponent)

  .component('myButtonGroup', ButtonGroupComponent)
  .component('myButton', ButtonComponent)
  .component('myIcon', IconComponent)
  .component('mySearchInput', SearchInputComponent)
  .component('myToast', ToastComponent)
  .component('myAutoScroll', AutoScrollComponent)
  .component('myListPage', ListPageComponent)
  .component('myHotkeys', HotkeysComponent)
  .component('myAutocompleteInput', AutoCompleteInputComponent)
  .component('myAutocompleteSuggestions', AutocompleteSuggestionsComponent)
  .component('myAutocompleteSuggestionsItemText', AutocompleteSuggestionsItemTextComponent)
  .component('myIconButton', IconButtonComponent)

  .filter('timeago', TimeagoFilter)

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
