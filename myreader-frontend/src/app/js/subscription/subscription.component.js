'use strict';

require('./subscription-exclusion-panel/subscription-exclusion-panel.component');
require('./subscription-tag-panel/subscription-tag-panel.component');
require('./subscription.service');
require('../shared/component/icon/icon.component');

function SubscriptionComponent($state, $stateParams, subscriptionService) {
    var ctrl = this;

    ctrl.$onInit = function () {
        if($stateParams.uuid) {
            subscriptionService.find($stateParams.uuid)
                .then(function(data) {
                    ctrl.subscription = data;
                });
        }
    };

    ctrl.onError = function(error) {
        ctrl.message = { type: 'error', message: error };
        ctrl.pendingAction = false;
    };

    ctrl.onSelectTag = function (value) {
        ctrl.subscription.tag = value;
    };

    ctrl.onClearTag = function () {
        ctrl.subscription.tag = null;
    };

    ctrl.onSave = function() {
        ctrl.pendingAction = true;
        return subscriptionService.save(ctrl.subscription);
    };

    ctrl.onSuccessSave = function(data) {
        ctrl.message = { type: 'success', message: 'saved' };
        ctrl.subscription = data;
        ctrl.pendingAction = false;
    };

    ctrl.onErrorSave = function(error) {
        if(error.data.status === 400) {
            ctrl.validations = error.data.fieldErrors
        } else {
            ctrl.onError(error);
        }
        ctrl.pendingAction = false;
    };

    ctrl.onDelete = function() {
        ctrl.pendingAction = true;
        return subscriptionService.remove(ctrl.subscription.uuid);
    };

    ctrl.onSuccessDelete = function() {
        $state.go('app.subscriptions');
    };

    ctrl.css = require('./subscription.component.css');
}

require('angular').module('myreader').component('mySubscription', {
    template: require('./subscription.component.html'),
    controller: ['$state', '$stateParams', 'subscriptionService', SubscriptionComponent]
});
