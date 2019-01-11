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

const states = [
  {
    name: 'login',
    url: '!/login',
    component: LoginPageContainer
  },
  {
    name: 'logout',
    url: '!/logout'
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
    url: '/entries/:feedTagEqual/:feedUuidEqual?q',
    params: {
      feedTagEqual: null,
      feedUuidEqual: null,
      q: {dynamic: true}
    },
    component: EntryStreamPageContainer
  },
  {
    name: 'app.bookmarks',
    url: '/bookmark/:entryTagEqual?q',
    params: {
      entryTagEqual: null,
      q: {dynamic: true}
    },
    component: BookmarkListPageContainer
  },
  {
    name: 'app.subscriptions',
    url: '/subscriptions?q',
    dynamic: true,
    component: SubscriptionListPageContainer
  },
  {
    name: 'app.subscription-add',
    url: '/subscriptions/add',
    component: SubscribePageContainer
  },
  {
    name: 'app.subscription',
    url: '/subscriptions/:uuid',
    component: SubscriptionEditPageContainer
  },
  {
    name: 'app.settings',
    url: '/settings',
    component: SettingsPageContainer
  },
  {
    name: 'admin.overview',
    url: '/overview',
    component: MaintenancePageContainer
  },
  {
    name: 'admin.feed',
    url: '/feed?q',
    dynamic: true,
    component: FeedListPageContainer
  },
  {
    name: 'admin.feed-detail',
    url: '/feed/:uuid',
    component: FeedEditPageContainer
  }
]

const configureStates = ({stateRegistry, urlService}) => {
  states.forEach(state => stateRegistry.register(state))
  urlService.rules.otherwise(() => ({state: 'login'}))
}

export default configureStates
