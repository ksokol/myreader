import template from './app.component.html'
import './app.component.css'
import {mediaBreakpointIsDesktopSelector, sidenavSlideIn, toggleSidenav} from './store'
import {NavigationContainer, ToastContainer} from './containers'

class controller {

  constructor($ngRedux) {
    'ngInject'
    this.$ngRedux = $ngRedux
  }

  $onInit() {
    this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this)
  }

  $onDestroy() {
    this.unsubscribe()
  }

  mapStateToThis(state) {
    return {
      isDesktop: mediaBreakpointIsDesktopSelector(state),
      sidenavSlideIn: sidenavSlideIn(state)
    }
  }

  mapDispatchToThis(dispatch) {
    return {
      toggleSidenav: () => dispatch(toggleSidenav())
    }
  }

  get menuProps() {
    return {
      type: 'bars',
      onClick: this.toggleSidenav,
      inverse: true
    }
  }

  get toastProps() {
    return {
      component: () => ToastContainer
    }
  }

  get navigationProps() {
    return {
      component: () => NavigationContainer
    }
  }
}

export const AppComponent = {
  template, controller
}
