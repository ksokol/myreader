import template from './app.component.html'
import './app.component.css'
import {ToastContainer} from './containers'
import {withSidenav} from './components'

/**
 * @deprecated
 */
export const WithSidenav = withSidenav()

class controller {

  get toastProps() {
    return {
      component: () => ToastContainer
    }
  }

  get sidenavProps() {
    return {
      component: () => WithSidenav
    }
  }
}

/**
 * @deprecated
 */
export const AppComponent = {
  template, controller
}
