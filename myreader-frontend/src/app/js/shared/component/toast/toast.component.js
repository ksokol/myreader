import template from './toast.component.html'
import './toast.component.css'
import {getNotifications, removeNotification} from '../../../store'

class controller {

    constructor($ngRedux) {
        'ngInject'
        this.$ngRedux = $ngRedux
        this.unsubscribe = $ngRedux.connect(getNotifications, this.mapDispatchToThis)(this)
    }

    $onDestroy() {
        this.unsubscribe()
    }

    set notifications(value) {
        this._notifications = value.reverse().splice(0, 3)
    }

    mapDispatchToThis(dispatch) {
        return {
            removeNotification: notification => dispatch(removeNotification(notification))
        }
    }
}

export const ToastComponent = {
    template, controller
}
