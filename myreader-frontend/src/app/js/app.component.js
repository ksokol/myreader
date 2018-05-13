import template from './app.component.html'
import './app.component.css'
import {toggleSidenav, sidenavSlideIn, mediaBreakpointIsDesktopSelector} from './store'

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
}

export const AppComponent = {
    template, controller
}
