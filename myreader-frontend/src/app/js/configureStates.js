import {
  BookmarkListPageContainer,
  EntryStreamPageContainer,
  FeedEditPageContainer,
  FeedListPageContainer,
  LoginPageContainer,
  MaintenancePageContainer,
  SettingsPageContainer,
  SidenavLayoutContainer,
  SubscribePageContainer,
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

const states = [
  {
    name: 'login',
    url: LOGIN_URL,
    component: LoginPageContainer
  },
  {
    name: 'logout',
    url: LOGOUT_URL
  },
  {
    name: 'app',
    url: '!/app',
    abstract: true,
    component: SidenavLayoutContainer
  },
  {
    name: 'admin',
    url: '!/admin',
    abstract: true,
    component: SidenavLayoutContainer
  },
  {
    name: 'app.entries',
    url: ENTRIES_URL,
    params: {
      feedTagEqual: null,
      feedUuidEqual: null,
      q: {dynamic: true}
    },
    component: EntryStreamPageContainer
  },
  {
    name: 'app.bookmarks',
    url: BOOKMARK_TAGS_URL,
    params: {
      entryTagEqual: null,
      q: {dynamic: true}
    },
    component: BookmarkListPageContainer
  },
  {
    name: 'app.subscriptions',
    url: SUBSCRIPTIONS_URL,
    dynamic: true,
    component: SubscriptionListPageContainer
  },
  {
    name: 'app.subscription-add',
    url: SUBSCRIPTION_ADD_URL,
    component: SubscribePageContainer
  },
  {
    name: 'app.subscription',
    url: SUBSCRIPTION_URL,
    component: SubscriptionEditPageContainer
  },
  {
    name: 'app.settings',
    url: SETTINGS_URL,
    component: SettingsPageContainer
  },
  {
    name: 'admin.overview',
    url: ADMIN_OVERVIEW_URL,
    component: MaintenancePageContainer
  },
  {
    name: 'admin.feed',
    url: ADMIN_FEEDS_URL,
    dynamic: true,
    component: FeedListPageContainer
  },
  {
    name: 'admin.feed-detail',
    url: ADMIN_FEED_URL,
    component: FeedEditPageContainer
  }
]

const configureStates = ({stateRegistry, urlService}) => {
  states.forEach(state => stateRegistry.register(state))
  urlService.rules.otherwise(() => ({state: 'login'}))
}

export default configureStates
