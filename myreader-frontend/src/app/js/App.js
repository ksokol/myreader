import './App.css'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {
  APP_URL,
  BOOKMARK_PAGE_PATH,
  ENTRIES_URL,
  LOGIN_PAGE_PATH,
  LOGOUT_PAGE_PATH,
  SETTINGS_URL,
  SUBSCRIPTION_ADD_URL,
  SUBSCRIPTION_PAGE_PATH,
  SUBSCRIPTIONS_URL
} from './constants'
import {SettingsPage} from './pages/SettingsPage/SettingsPage'
import {EntryStreamPage} from './pages/EntryStreamPage/EntryStreamPage'
import {SidenavLayout} from './components/SidenavLayout/SidenavLayout'
import {SubscriptionProvider} from './contexts/subscription/SubscriptionProvider'
import {SubscriptionListPage} from './pages/SubscriptionListPage/SubscriptionListPage'
import {LoadingBar} from './components/LoadingBar/LoadingBar'
import {LoginPage} from './pages/LoginPage/LoginPage'
import {LogoutPage} from './pages/LogoutPage/LogoutPage'
import {BookmarkListPage} from './pages/BookmarkListPage/BookmarkListPage'
import {SubscribePage} from './pages/SubscribePage/SubscribePage'
import {SubscriptionPage} from './pages/SubscriptionPage/SubscriptionPage'
import {Secured} from './components/Secured/Secured'

const withSidenav = () => (
  <SubscriptionProvider>
    <SidenavLayout>
      <Switch>
        <Route exact={true} path={ENTRIES_URL} component={EntryStreamPage}/>
        <Route exact={true} path={BOOKMARK_PAGE_PATH} component={BookmarkListPage}/>
        <Route exact={true} path={SUBSCRIPTION_ADD_URL} component={SubscribePage}/>
        <Route exact={true} path={SUBSCRIPTION_PAGE_PATH} component={SubscriptionPage}/>
        <Route exact={true} path={SUBSCRIPTIONS_URL} component={SubscriptionListPage}/>
        <Route exact={true} path={SETTINGS_URL} component={SettingsPage}/>
      </Switch>
    </SidenavLayout>
  </SubscriptionProvider>
)

const App = () => {
  return (
    <React.Fragment>
      <Switch>
        <Route exact={true} path={LOGIN_PAGE_PATH} component={LoginPage}/>
        <Route exact={true} path={LOGOUT_PAGE_PATH} component={LogoutPage}/>
        <Route path={APP_URL} component={() => Secured(withSidenav)}/>
        <Redirect to={LOGIN_PAGE_PATH} />
      </Switch>
      <LoadingBar />
    </React.Fragment>
  )
}

export default App
