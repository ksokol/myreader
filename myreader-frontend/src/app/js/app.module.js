import angular from 'angular'
import ngRedux from 'ng-redux'

import {ENVIRONMENT, isInDevMode, isInProdMode} from './constants'
import {installMediaBreakpointActionDispatcher} from './store/common/media-breakpoints'
import {EntryTagsComponent} from './entry/entry-tags/entry-tags.component'
import {EntryTitle} from './entry/entry-title/entry-title'
import {EntryComponent} from './entry/entry.component'
import {TimeagoFilter} from './shared/timeago/timeago.filter'
import {FeedFetchErrorComponent} from './feed/feed-fetch-error/feed-fetch-error.component'
import {LoadMoreComponent} from './shared/component/load-more/load-more.component'
import {IconComponent} from './shared/component/icon/icon.component'
import {BackendValidationDirective} from './shared/directive/backend-validation/backend-validation.directive'
import {ValidationMessageComponent} from './shared/component/validation-message/validation-message.component'
import {ButtonGroupComponent} from './shared/component/button-group/button-group.component'
import {ButtonComponent} from './shared/component/button/button.component'
import {FeedComponent} from './feed/feed.component'
import {SearchInputComponent} from './shared/component/search-input/search-input.component'
import {FeedListComponent} from './feed/feed-list.component'
import {LoginComponent} from './login/login.component'
import {AboutComponent} from './maintenance/about/about.component'
import {MaintenanceActionsComponent} from './maintenance/maintenance-actions/maintenance-actions.component'
import {MaintenanceComponent} from './maintenance/maintenance.component'
import {NavigationSubscriptionItemComponent} from './navigation/subscriptions-item/subscription-item/subscription-item.component'
import {SettingsComponent} from './settings/settings.component'
import {SubscribeComponent} from './subscription/subscribe/subscribe.component'
import {SubscriptionExclusionComponent} from './subscription/subscription-exclusion/subscription-exclusion.component'
import {
  SubscriptionComponent,
  SubscriptionTitleInput,
  SubscriptionUrlInput
} from './subscription/subscription.component'
import {ClickIfInViewDirective} from './shared/component/load-more/click-if-in-view.directive'
import {ToastComponent} from './shared/component/toast/toast.component'
import {AutoScrollComponent} from './shared/component/auto-scroll/auto-scroll.component'
import {EntryListComponent} from './entry/entry-list.component'
import createApplicationStore from './store/bootstrap'
import {ListPageComponent} from './shared/component/list-page/list-page.component'
import {BookmarkComponent} from './bookmark/bookmark.component'
import {SubscriptionListComponent} from './subscription/subscription-list.component'
import {HotkeysComponent} from './shared/component/hotkeys/hotkeys.component'
import {FeedStreamComponent} from './feed-stream/feed-stream.component'
import {NavigationSubscriptionsItemComponent} from './navigation/subscriptions-item/subscriptions-item.component'
import {AppComponent} from './app.component'
import {NavigationComponent} from './navigation/navigation.component'
import createRouterMiddleware from './store/middleware/router'
import uiRouterAdapter from './shared/router/uiRouterAdapter'
import uiRouterStartTransitionHandler from './shared/router/uiRouterStartTransitionHandler'
import {BackdropComponent} from './shared/component/backdrop/backdrop.component'
import {ChooseComponent} from './shared/component/choose/choose.component'
import {ChipsComponent} from './shared/component/chips/chips.component'
import {ChipComponent} from './shared/component/chips/chip.component'
import {ChipsInputComponent} from './shared/component/chips/chips-input.component'
import {InputContainer} from './shared/component/input-container/input-container'
import {
  AutoCompleteInputComponent,
  AutocompleteSuggestionsComponent,
  AutocompleteSuggestionsItemTextComponent
} from './shared/component/autocomplete-input'
import {IconButton, IconButtonComponent} from './shared/component/buttons'
import {EntryContent} from './entry/entry-content/entry-content'
import {Icon} from './shared/component/icon'
import {EntryActions} from './entry/entry-actions/entry-actions'
import {Chips} from './shared/component/chips'

import './config'

angular
  .module('myreader', [ngRedux, 'common.config', 'ui.router', 'react'])
  .value('EntryTitle', EntryTitle)
  .value('EntryContent', EntryContent)
  .value('Icon', Icon)
  .value('IconButton', IconButton)
  .value('EntryActions', EntryActions)
  .value('Chips', Chips)

  .value('SubscriptionTitleInput', SubscriptionTitleInput)
  .value('SubscriptionUrlInput', SubscriptionUrlInput)

  .component('myEntryTags', EntryTagsComponent)
  .component('myEntry', EntryComponent)
  .component('myFeedFetchError', FeedFetchErrorComponent)
  .component('myValidationMessage', ValidationMessageComponent)
  .component('myFeed', FeedComponent)
  .component('myFeedList', FeedListComponent)
  .component('myLogin', LoginComponent)
  .component('myAbout', AboutComponent)
  .component('myMaintenanceActions', MaintenanceActionsComponent)
  .component('myMaintenance', MaintenanceComponent)
  .component('mySettings', SettingsComponent)
  .component('mySubscribe', SubscribeComponent)
  .component('mySubscriptionExclusion', SubscriptionExclusionComponent)
  .component('mySubscription', SubscriptionComponent)
  .component('myEntryList', EntryListComponent)
  .component('myBookmark', BookmarkComponent)
  .component('mySubscriptionList', SubscriptionListComponent)
  .component('myFeedStream', FeedStreamComponent)
  .component('myNavigationSubscriptionItem', NavigationSubscriptionItemComponent)
  .component('myNavigationSubscriptionsItem', NavigationSubscriptionsItemComponent)
  .component('myApp', AppComponent)
  .component('myNavigation', NavigationComponent)
  .component('myBackdrop', BackdropComponent)

  .component('myButtonGroup', ButtonGroupComponent)
  .component('myButton', ButtonComponent)
  .component('myLoadMore', LoadMoreComponent)
  .component('myIcon', IconComponent)
  .component('mySearchInput', SearchInputComponent)
  .component('myToast', ToastComponent)
  .component('myAutoScroll', AutoScrollComponent)
  .component('myListPage', ListPageComponent)
  .component('myHotkeys', HotkeysComponent)
  .component('myChoose', ChooseComponent)
  .component('myChip', ChipComponent)
  .component('myChips', ChipsComponent)
  .component('myChipsInput', ChipsInputComponent)
  .component('myInputContainer', InputContainer)
  .component('myAutocompleteInput', AutoCompleteInputComponent)
  .component('myAutocompleteSuggestions', AutocompleteSuggestionsComponent)
  .component('myAutocompleteSuggestionsItemText', AutocompleteSuggestionsItemTextComponent)
  .component('myIconButton', IconButtonComponent)

  .directive('myBackendValidation', BackendValidationDirective)
  .directive('myClickIfInView', ClickIfInViewDirective)

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

      const store = createApplicationStore(
        ENVIRONMENT,
        [installMediaBreakpointActionDispatcher],
        [routerMiddleware, digestMiddleware]
      )
      return store
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
