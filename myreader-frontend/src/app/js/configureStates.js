import {
  BookmarkListPageContainer,
  LoginPageContainer,
  SettingsPageContainer,
  SidenavLayoutContainer,
  SubscriptionEditPageContainer,
  SubscriptionListPageContainer
} from './containers'
import {
  ADMIN_FEED_URL,
  ADMIN_FEEDS_URL,
  ADMIN_OVERVIEW_URL,
  BOOKMARK_TAGS_URL,
  ENTRIES_URL,
  LOGIN_URL,
  LOGOUT_URL,
  SETTINGS_URL,
  SUBSCRIPTION_ADD_URL,
  SUBSCRIPTION_URL,
  SUBSCRIPTIONS_URL
} from './routes'
import {secured} from './components'
import {ROLE_ADMIN, ROLE_USER} from './constants'
import {EntryStreamPage, FeedEditPage, FeedListPage, LogoutPage, MaintenancePage, SubscribePage} from './pages'

const states = [
  {
    name: 'login',
    url: LOGIN_URL,
    component: LoginPageContainer
  },
  {
    name: 'logout',
    url: LOGOUT_URL,
    component: LogoutPage
  },
  {
    name: 'app',
    url: '!/app',
    abstract: true,
    component: secured(SidenavLayoutContainer, [ROLE_USER, ROLE_ADMIN])
  },
  {
    name: 'admin',
    url: '!/admin',
    abstract: true,
    component: secured(SidenavLayoutContainer, [ROLE_USER, ROLE_ADMIN])
  },
  {
    name: 'app.entries',
    url: ENTRIES_URL,
    params: {
      feedTagEqual: null,
      feedUuidEqual: null,
      q: {dynamic: true}
    },
    component: secured(EntryStreamPage, [ROLE_USER, ROLE_ADMIN])
  },
  {
    name: 'app.bookmarks',
    url: BOOKMARK_TAGS_URL,
    params: {
      entryTagEqual: null,
      q: {dynamic: true}
    },
    component: secured(BookmarkListPageContainer, [ROLE_USER, ROLE_ADMIN])
  },
  {
    name: 'app.subscriptions',
    url: SUBSCRIPTIONS_URL,
    dynamic: true,
    component: secured(SubscriptionListPageContainer, [ROLE_USER, ROLE_ADMIN])
  },
  {
    name: 'app.subscription-add',
    url: SUBSCRIPTION_ADD_URL,
    component: secured(SubscribePage, [ROLE_USER, ROLE_ADMIN])
  },
  {
    name: 'app.subscription',
    url: SUBSCRIPTION_URL,
    component: secured(SubscriptionEditPageContainer, [ROLE_USER, ROLE_ADMIN])
  },
  {
    name: 'app.settings',
    url: SETTINGS_URL,
    component: secured(SettingsPageContainer, [ROLE_USER, ROLE_ADMIN])
  },
  {
    name: 'admin.overview',
    url: ADMIN_OVERVIEW_URL,
    component: secured(MaintenancePage, [ROLE_ADMIN])
  },
  {
    name: 'admin.feed',
    url: ADMIN_FEEDS_URL,
    dynamic: true,
    component: secured(FeedListPage, [ROLE_ADMIN])
  },
  {
    name: 'admin.feed-detail',
    url: ADMIN_FEED_URL,
    component: secured(FeedEditPage, [ROLE_ADMIN])
  }
]

const configureStates = ({stateRegistry, urlService}) => {
  states.forEach(state => stateRegistry.register(state))
  urlService.rules.otherwise(() => ({state: 'login'}))
}

export default configureStates
