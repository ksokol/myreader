import {
  APP_URL,
  ENTRIES_PAGE_PATH,
  LOGIN_PAGE_PATH,
  SUBSCRIPTION_PAGE_PATH,
  SUBSCRIPTIONS_PAGE_PATH
} from './constants'
import {EntryStreamPage} from './pages/EntryStreamPage/EntryStreamPage'
import {SidenavLayout} from './components/SidenavLayout/SidenavLayout'
import {NavigationProvider} from './contexts/navigation/NavigationProvider'
import {SubscriptionListPage} from './pages/SubscriptionListPage/SubscriptionListPage'
import {LoadingBar} from './components/LoadingBar/LoadingBar'
import {LoginPage} from './pages/LoginPage/LoginPage'
import {SubscriptionPage} from './pages/SubscriptionPage/SubscriptionPage'
import {Secured} from './components/Secured/Secured'
import {Switch, Route, Redirect} from './components/router'
import {RouterProvider} from './contexts/router'
import {SecurityProvider} from './contexts/security/SecurityProvider'
import {SettingsProvider} from './contexts/settings/SettingsProvider'

export function App() {
  return (
    <SecurityProvider>
      <RouterProvider>
        <SettingsProvider>
          <Switch
            onNotFound={() => <Redirect pathname={LOGIN_PAGE_PATH}/>}
          >
            <Route path={LOGIN_PAGE_PATH}>
              <LoginPage/>
            </Route>
            <Route partial={true} path={APP_URL}>
              <Secured>
                <NavigationProvider>
                  <SidenavLayout>
                    <Switch
                      onNotFound={() => <Redirect pathname={LOGIN_PAGE_PATH}/>}
                    >
                      <Route path={ENTRIES_PAGE_PATH}>
                        <EntryStreamPage/>
                      </Route>
                      <Route path={SUBSCRIPTION_PAGE_PATH}>
                        <SubscriptionPage/>
                      </Route>
                      <Route path={SUBSCRIPTIONS_PAGE_PATH}>
                        <SubscriptionListPage/>
                      </Route>
                    </Switch>
                  </SidenavLayout>
                </NavigationProvider>
              </Secured>
            </Route>
          </Switch>
          <LoadingBar/>
        </SettingsProvider>
      </RouterProvider>
    </SecurityProvider>
  )
}
