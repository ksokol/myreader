import template from './button.component.html'
import './button.component.css'
import {isPromiseLike} from '../../utils'
import {getPendingRequests} from 'store'

class controller {

    constructor($timeout, $q, $ngRedux) {
        'ngInject'
        this.$timeout = $timeout
        this.$q = $q
        this.disableConfirmButtons = false
        this.isPending = false

        this.unsubscribe = $ngRedux.connect(getPendingRequests)(this)
    }

    $onDestroy() {
        this.unsubscribe()
    }

    shouldPresentConfirmButton() {
        return this.myConfirm === 'true'
    }

    presentConfirmButton() {
        this.disableConfirmButtons = true
        this.showConfirmButton = true

        this.$timeout(() => this.disableConfirmButtons = false, 250)
    }

    processMyOnClick() {
        let result = this.myOnClick()
        let promise = result

        if (!isPromiseLike(result)) {
            let deferred = this.$q.defer()
            deferred.resolve()
            promise = deferred.promise
        }

        return promise
    }

    $onInit() {
        this.buttonGroupCtrl.addButton(this)
        this.myButtonType = this.myButtonType || 'button'
    }

    reset() {
        this.isPending = false
        this.showConfirmButton = false
        this.buttonGroupCtrl.enableButtons()
    }

    onClick() {
        this.buttonGroupCtrl.disableButtons()
        this.shouldPresentConfirmButton() ? this.presentConfirmButton() : this.processOnClick()
    }

    processOnClick() {
        this.isPending = true

        this.processMyOnClick()
            .then(data => {
                this.myOnSuccess({data})
                this.reset()
            })
            .catch(error => {
                this.myOnError({error})
                this.reset()
            })
    }

    isDisabled() {
        return this.isPending || this.disableConfirmButtons || this.myDisabled || this.pendingRequests > 0
    }

    disable() {
        this.disableConfirmButtons = this.shouldPresentConfirmButton() || !this.showConfirmButton
    }

    enable() {
        this.disableConfirmButtons = false
    }
}

export const ButtonComponent = {
    template, controller,
    require: {
        buttonGroupCtrl: '^myButtonGroup'
    },
    bindings: {
        myText: '@',
        myType: '@',
        myButtonType: '@',
        myConfirm: '@',
        myDisabled: '<',
        myOnClick: '&',
        myOnSuccess: '&',
        myOnError: '&'
    }
}
