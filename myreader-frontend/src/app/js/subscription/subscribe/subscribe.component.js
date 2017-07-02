'use strict';

function SubscribeComponent($state, subscriptionService) {
    var ctrl = this;

    ctrl.onSave = function() {
        return subscriptionService.save({origin: ctrl.origin});
    };

    ctrl.onSuccessSave = function(data) {
        $state.go('app.subscription', {uuid: data.uuid});
    };

    ctrl.onError = function(error) {
        ctrl.message = { type: 'error', message: error };
    };

    ctrl.onErrorSave = function(error) {
        if(error.data.status === 400) {
            ctrl.validations = error.data.fieldErrors
        } else {
            ctrl.onError(error);
        }
    };
}

require('angular').module('myreader').component('mySubscribe', {
    template: require('./subscribe.component.html'),
    controller: [ '$state', 'subscriptionService', SubscribeComponent ]
});
