import template from './subscribe.component.html'
import './subscribe.component.css'
import {routeChange, saveSubscription} from '../../store'

class controller {

    constructor($ngRedux) {
        'ngInject'
        this.$ngRedux = $ngRedux
    }

    onSave() {
        return this.$ngRedux.dispatch(saveSubscription({origin: this.origin}))
    }

    onSuccessSave(data) {
        this.$ngRedux.dispatch(routeChange(['app', 'subscription'], {uuid: data.uuid}))
    }

    onErrorSave(error) {
        if(error.status === 400) {
            this.validations = error.data.fieldErrors
        }
    }
}

export const SubscribeComponent = {
    template, controller
}
