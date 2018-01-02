import template from './subscribe.component.html'
import {saveSubscription} from 'store'

class controller {

    constructor($state, $ngRedux) {
        'ngInject'
        this.$state = $state
        this.$ngRedux = $ngRedux
    }

    onSave() {
        return this.$ngRedux.dispatch(saveSubscription({origin: this.origin}))
    }

    onSuccessSave(data) {
        this.$state.go('app.subscription', {uuid: data.uuid})
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
