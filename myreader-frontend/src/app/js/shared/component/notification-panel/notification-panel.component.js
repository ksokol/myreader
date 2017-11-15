import template from './notification-panel.component.html';
import css from './notification-panel.component.css';

class controller {

    constructor($timeout) {
        'ngInject';
        this.$timeout = $timeout;
    }

    reset() {
        this.type = null;
        this.message = null;
        this.myOnDismiss();
    };

    $onChanges(obj) {
        if (this.promise) {
            this.$timeout.cancel(this.promise);
        }

        if (obj.myMessage.currentValue) {
            this.type = obj.myMessage.currentValue.type;
            this.message = obj.myMessage.currentValue.message;
        }

        this.promise = this.$timeout(() => this.reset(), 5000);
    };

    onClose() {
        this.$timeout.cancel(this.promise);
        this.reset();
    };
}

export const NotificationPanelComponent = {
    template, css, controller,
    bindings: {
        myMessage: '<',
        myOnDismiss: '&'
    }
};
