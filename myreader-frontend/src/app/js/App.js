import React from 'react'
import {Redirect, Route, Switch} from 'react-router'
import {ToastContainer} from './containers'
import {
  BookmarkListPage,
  FeedEditPage,
  LoginPage,
  LogoutPage,
  SubscribePage,
  SubscriptionEditPage,
  SubscriptionListPage
} from './pages'
import {LoadingBar, secured, SidenavLayout} from './components'
import {
  ADMIN_FEED_URL,
  ADMIN_FEEDS_URL,
  ADMIN_OVERVIEW_URL,
  APP_URL,
  BOOKMARK_URL,
  ENTRIES_URL,
  LOGIN_URL,
  LOGOUT_URL,
  ROLE_ADMIN,
  ROLE_USER,
  SETTINGS_URL,
  SUBSCRIPTION_ADD_URL,
  SUBSCRIPTION_URL,
  SUBSCRIPTIONS_URL
} from './constants'
import {AdminOverviewPage} from './pages/AdminOverviewPage/AdminOverviewPage'
import {FeedListPage} from './pages/FeedListPage/FeedListPage'
import {SettingsPage} from './pages/SettingsPage/SettingsPage'
import {EntryStreamPage} from './pages/EntryStreamPage/EntryStreamPage'

const withSidenav = () => (
  <SidenavLayout>
    <Switch>
      <Route exact={true} path={ENTRIES_URL} component={EntryStreamPage}/>
      <Route exact={true} path={BOOKMARK_URL} component={BookmarkListPage}/>
      <Route exact={true} path={SUBSCRIPTION_ADD_URL} component={SubscribePage}/>
      <Route exact={true} path={SUBSCRIPTION_URL} component={SubscriptionEditPage}/>
      <Route exact={true} path={SUBSCRIPTIONS_URL} component={SubscriptionListPage}/>
      <Route exact={true} path={SETTINGS_URL} component={SettingsPage}/>
      <Route exact={true} path={ADMIN_OVERVIEW_URL} component={AdminOverviewPage}/>
      <Route exact={true} path={ADMIN_FEEDS_URL} component={FeedListPage}/>
      <Route exact={true} path={ADMIN_FEED_URL} component={FeedEditPage}/>
    </Switch>
  </SidenavLayout>
)

const App = () => {
  return (
    <React.Fragment>
      <Switch>
        <Route exact={true} path={LOGIN_URL} component={LoginPage}/>
        <Route exact={true} path={LOGOUT_URL} component={LogoutPage}/>
        <Route path={APP_URL} component={secured(withSidenav, [ROLE_USER, ROLE_ADMIN])}/>
        <Redirect to={LOGIN_URL} />
      </Switch>
      <LoadingBar />
      <ToastContainer/>
    </React.Fragment>
  )
}

export default App
