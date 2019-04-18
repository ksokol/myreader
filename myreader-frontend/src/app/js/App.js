import React from 'react'
import {Route, Switch} from 'react-router-dom'
import {LoginPageContainer, SettingsPageContainer, ToastContainer} from './containers'
import {
  ADMIN_FEED_URL,
  ADMIN_FEEDS_URL,
  ADMIN_OVERVIEW_URL,
  BOOKMARK_TAGS_URL,
  ENTRIES_URL,
  LOGIN_URL, loginRoute,
  LOGOUT_URL, SETTINGS_URL,
  SUBSCRIPTION_ADD_URL,
  SUBSCRIPTION_URL,
  SUBSCRIPTIONS_URL
} from './routes'
import {
  BookmarkListPage,
  EntryStreamPage, FeedEditPage, FeedListPage,
  LogoutPage, MaintenancePage,
  SubscribePage,
  SubscriptionEditPage,
  SubscriptionListPage
} from './pages'
import {secured} from './components'
import {ROLE_ADMIN, ROLE_USER} from './constants'
import {Redirect} from './migrations/react-router-dom'

const App = () => {
  return (
    <React.Fragment>
      <Switch>
        <Route path={LOGIN_URL} component={LoginPageContainer}/>
        <Route path={LOGOUT_URL} component={LogoutPage}/>
        <Route path={ENTRIES_URL} component={secured(EntryStreamPage, [ROLE_USER, ROLE_ADMIN])}/>
        <Route path={BOOKMARK_TAGS_URL} component={secured(BookmarkListPage, [ROLE_USER, ROLE_ADMIN])}/>
        <Route path={SUBSCRIPTIONS_URL} component={secured(SubscriptionListPage, [ROLE_USER, ROLE_ADMIN])}/>
        <Route path={SUBSCRIPTION_ADD_URL} component={secured(SubscribePage, [ROLE_USER, ROLE_ADMIN])}/>
        <Route path={SUBSCRIPTION_URL} component={secured(SubscriptionEditPage, [ROLE_USER, ROLE_ADMIN])}/>
        <Route path={SETTINGS_URL} component={secured(SettingsPageContainer, [ROLE_USER, ROLE_ADMIN])}/>
        <Route path={ADMIN_OVERVIEW_URL} component={secured(MaintenancePage, [ROLE_ADMIN])}/>
        <Route path={ADMIN_FEEDS_URL} component={secured(FeedListPage, [ROLE_ADMIN])}/>
        <Route path={ADMIN_FEED_URL} component={secured(FeedEditPage, [ROLE_ADMIN])}/>
        <Redirect to={loginRoute()} />
      </Switch>
      <ToastContainer/>
    </React.Fragment>
  )
}

export default App
