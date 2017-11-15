import template from './button.component.html';
import css from './button.component.css';
import {isPromise} from '../../utils';

class controller {

    constructor($timeout, $q) {
        'ngInject';
        this.$timeout = $timeout;
        this.$q = $q;
        this.disableConfirmButtons = false;
        this.isPending = false;
    }

    shouldPresentConfirmButton() {
        return this.myConfirm === 'true';
    }

    presentConfirmButton() {
        this.disableConfirmButtons = true;
        this.showConfirmButton = true;

        this.$timeout(() => this.disableConfirmButtons = false, 250);
    }

    processMyOnClick() {
        let result = this.myOnClick();
        let promise = result;

        if (!isPromise(result)) {
            let deferred = this.$q.defer();
            deferred.resolve();
            promise = deferred.promise;
        }

        return promise;
    }

    $onInit() {
        this.buttonGroupCtrl.addButton(this);
        this.myButtonType = this.myButtonType || 'button';
    }

    reset() {
        this.isPending = false;
        this.showConfirmButton = false;
        this.buttonGroupCtrl.enableButtons();
    }

    onClick() {
        this.buttonGroupCtrl.disableButtons();
        this.shouldPresentConfirmButton() ? this.presentConfirmButton() : this.processOnClick();
    }

    processOnClick() {
        this.isPending = true;

        this.processMyOnClick().then(data => this.myOnSuccess({data}))
            .catch(data => this.myOnError({error: data}))
            .finally(() => this.reset());
    }

    isDisabled() {
        return this.isPending || this.disableConfirmButtons || this.myDisabled;
    }

    disable() {
        this.disableConfirmButtons = this.shouldPresentConfirmButton() || !this.showConfirmButton;
    }

    enable() {
        this.disableConfirmButtons = false;
    }
}

export const ButtonComponent = {
    template, css, controller,
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
};
