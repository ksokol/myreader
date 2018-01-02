import angular from 'angular'
import ngRedux from 'ng-redux'

import {ENVIRONMENT} from './constants'
import {EntryActionsComponent} from './entry/entry-actions/entry-actions.component'
import {EntryContentComponent} from './entry/entry-content/entry-content.component'
import {EntryTagsComponent} from './entry/entry-tags/entry-tags.component'
import {EntryTitleComponent} from './entry/entry-title/entry-title.component'
import {EntryComponent} from './entry/entry.component'
import {EntryContentSanitizerDirective} from "./entry/entry-content/entry-content-sanitizer/entry-content-sanitizer.directive"
import {TimeagoFilter} from "./shared/timeago/timeago.filter"
import {FeedFetchErrorComponent} from "./feed/feed-fetch-error-panel/feed-fetch-error/feed-fetch-error.component"
import {FeedFetchErrorService} from "./feed/feed-fetch-error-panel/feed-fetch-error/feed-fetch-error.service"
import {FeedFetchErrorListItemComponent} from "./feed/feed-fetch-error-panel/feed-fetch-error/feed-fetch-error-list-item.component"
import {LoadMoreComponent} from "./shared/component/load-more/load-more.component"
import {IconComponent} from "./shared/component/icon/icon.component"
import {FeedFetchErrorPanelComponent} from "./feed/feed-fetch-error-panel/feed-fetch-error-panel.component"
import {BackendValidationDirective} from "./shared/directive/backend-validation/backend-validation.directive"
import {ValidationMessageComponent} from "./shared/component/validation-message/validation-message.component"
import {ButtonGroupComponent} from "./shared/component/button-group/button-group.component"
import {ButtonComponent} from "./shared/component/button/button.component"
import {NotificationPanelComponent} from "./shared/component/notification-panel/notification-panel.component"
import {FeedService} from "./feed/feed.service"
import {FeedComponent} from "./feed/feed.component"
import {SearchInputComponent} from "./shared/component/search-input/search-input.component"
import {FeedListComponent} from "./feed/feed-list.component"
import {LoginComponent} from "./login/login.component"
import {AboutService} from "./maintenance/about/about.service"
import {AboutComponent} from "./maintenance/about/about.component"
import {MaintenanceActionsComponent} from "./maintenance/maintenance-actions/maintenance-actions.component"
import {MaintenanceComponent} from "./maintenance/maintenance.component"
import {NavigationSubscriptionItemComponent} from "./navigation/subscription-item/subscription-item.component"
import {SettingsComponent} from "./settings/settings.component"
import {SubscribeComponent} from "./subscription/subscribe/subscribe.component"
import {ExclusionService} from "./subscription/subscription-exclusion-panel/subscription-exclusion/exclusion.service"
import {SubscriptionExclusionComponent} from "./subscription/subscription-exclusion-panel/subscription-exclusion/subscription-exclusion.component"
import {SubscriptionExclusionPanelComponent} from "./subscription/subscription-exclusion-panel/subscription-exclusion-panel.component"
import {SubscriptionTagService} from "./subscription/subscription-tag-panel/subscription-tag.service"
import {AutoCompleteInputComponent} from "./shared/component/autocomplete-input/autocomplete-input.component"
import {SubscriptionTagPanelComponent} from "./subscription/subscription-tag-panel/subscription-tag-panel.component"
import {SubscriptionComponent} from "./subscription/subscription.component"
import {ClickIfInViewDirective} from "./shared/component/load-more/click-if-in-view.directive"
import {ToastComponent} from './shared/component/toast/toast.component'
import {AutoScrollComponent} from './shared/component/auto-scroll/auto-scroll.component'
import {EntryListComponent} from './entry/entry-list.component'
import createApplicationStore from 'store/bootstrap'
import {ListPageComponent} from './shared/component/list-page/list-page.component'
import {BookmarkTagsComponent} from './bookmark/bookmark-tags/bookmark-tags.component'
import {BookmarkComponent} from './bookmark/bookmark.component'
import {LogoutComponent} from './navigation/logout-item/logout-item.component'
import {SubscriptionListComponent} from './subscription/subscription-list.component'

import './config'
import './controllers'

const storeProviderEnhancer = () => () => createApplicationStore(ENVIRONMENT)

angular
    .module('myreader', [ngRedux, 'common.config', 'common.controllers', 'ngSanitize', 'ui.router', 'ngMaterial', 'ngMessages', 'cfp.hotkeys'])
    .config(['$ngReduxProvider', $ngReduxProvider => $ngReduxProvider.createStoreWith(state => state, [], [storeProviderEnhancer])])

    .component('myEntryActions', EntryActionsComponent)
    .component('myEntryContent', EntryContentComponent)
    .component('myEntryTags', EntryTagsComponent)
    .component('myEntryTitle', EntryTitleComponent)
    .component('myEntry', EntryComponent)
    .component('myFeedFetchError', FeedFetchErrorComponent)
    .component('myFeedFetchErrorListItem', FeedFetchErrorListItemComponent)
    .component('myFeedFetchErrorPanel', FeedFetchErrorPanelComponent)
    .component('myValidationMessage', ValidationMessageComponent)
    .component('myFeed', FeedComponent)
    .component('myFeedList', FeedListComponent)
    .component('myLogin', LoginComponent)
    .component('myAbout', AboutComponent)
    .component('myMaintenanceActions', MaintenanceActionsComponent)
    .component('myMaintenance', MaintenanceComponent)
    .component('myNavigationSubscriptionItem', NavigationSubscriptionItemComponent)
    .component('mySettings', SettingsComponent)
    .component('mySubscribe', SubscribeComponent)
    .component('mySubscriptionExclusion', SubscriptionExclusionComponent)
    .component('mySubscriptionExclusionPanel', SubscriptionExclusionPanelComponent)
    .component('myAutocompleteInput', AutoCompleteInputComponent)
    .component('mySubscriptionTagPanel', SubscriptionTagPanelComponent)
    .component('mySubscription', SubscriptionComponent)
    .component('myEntryList', EntryListComponent)
    .component('myBookmarkTags', BookmarkTagsComponent)
    .component('myBookmark', BookmarkComponent)
    .component('mySubscriptionList', SubscriptionListComponent)

    .component('myButtonGroup', ButtonGroupComponent)
    .component('myButton', ButtonComponent)
    .component('myLoadMore', LoadMoreComponent)
    .component('myIcon', IconComponent)
    .component('myNotificationPanel', NotificationPanelComponent)
    .component('mySearchInput', SearchInputComponent)
    .component('myToast', ToastComponent)
    .component('myAutoScroll', AutoScrollComponent)
    .component('myListPage', ListPageComponent)
    .component('myLogout', LogoutComponent)

    .service('feedFetchErrorService', FeedFetchErrorService)
    .service('feedService', FeedService)
    .service('aboutService', AboutService)
    .service('exclusionService', ExclusionService)
    .service('subscriptionTagService', SubscriptionTagService)

    .directive('myEntryContentSanitizer', EntryContentSanitizerDirective)
    .directive('myBackendValidation', BackendValidationDirective)
    .directive('myClickIfInView', ClickIfInViewDirective)

    .filter('timeago', TimeagoFilter)

    // TODO part of AngularJS exit strategy https://github.com/angular/angular.js/issues/16199#issuecomment-324911598
    .run(($rootScope, $q) => {
        'ngInject'

        if (ENVIRONMENT === 'production' || ENVIRONMENT === 'development') {
            window['Promise'] = $q
        }

        const setTimeoutFn = window.setTimeout
        window.setTimeout = (fn, delay) => {
            setTimeoutFn(() => {
                fn()
                $rootScope.$digest()
            }, delay)
        }
    })
