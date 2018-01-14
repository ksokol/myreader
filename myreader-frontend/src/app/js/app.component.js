import template from './app.component.html'
import './app.component.css'
import {mediaBreakpointIsDesktopSelector} from 'store'

class controller {

    constructor($mdSidenav, $ngRedux) {
        'ngInject'
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
            isDesktop: mediaBreakpointIsDesktopSelector(state)
        }
    }

    openMenu() {
        this.$mdSidenav('left').toggle()
    }

    onClickNavigationItem() {
        this.$mdSidenav('left').close()
    }
}

export const AppComponent = {
    template, controller
}
