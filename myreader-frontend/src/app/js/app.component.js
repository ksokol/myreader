import template from './app.component.html'
import {adminPermissionSelector, mediaBreakpointIsDesktopSelector} from 'store'

class controller {

    constructor($state, $mdSidenav, $ngRedux) {
        'ngInject'
        this.$state = $state
        this.$mdSidenav = $mdSidenav
        this.$ngRedux = $ngRedux
    }

    $onInit() {
        this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis)(this)
    }

    $onDestroy() {
        this.unsubscribe()
    }

    mapStateToThis(state) {
        return {
            isAdmin: adminPermissionSelector(state),
            isDesktop: mediaBreakpointIsDesktopSelector(state)
        }
    }

    navigateTo(state) {
        this.closeSidenav()
        this.$state.go(state)
    }

    openMenu() {
        this.$mdSidenav('left').toggle()
    }

    closeSidenav() {
        this.$mdSidenav('left').close()
    }
}

export const AppComponent = {
    template, controller
}
