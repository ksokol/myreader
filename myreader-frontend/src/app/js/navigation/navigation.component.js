import template from './navigation.component.html'
import './navigation.component.css'
import {adminPermissionSelector, routeChange} from 'store'

class controller {

    constructor($ngRedux) {
        'ngInject'
        this.$ngRedux = $ngRedux
    }

    $onInit() {
        this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis, this.mapDispatch)(this)
    }

    $onDestroy() {
        this.unsubscribe()
    }

    mapStateToThis(state) {
        return {
            isAdmin: adminPermissionSelector(state)
        }
    }

    mapDispatch(dispatch) {
        return {
            routeTo: route => dispatch(routeChange(route))
        }
    }
}

export const NavigationComponent = {
    template, controller
}
