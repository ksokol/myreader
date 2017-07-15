'use strict';

require('../shared/directive/backend-validation/backend-validation.directive');
require('../shared/component/validation-message/validation-message.component');
require('../shared/component/icon/icon.component');
require('../shared/component/button-group/button-group.component');
require('../shared/component/button/button.component');
require('../shared/component/notification-panel/notification-panel.component');
require('./feed-fetch-error-panel/feed-fetch-error-panel.component');
require('./feed.service');

function FeedComponent($state, $stateParams, feedService) {
    var ctrl = this;

    ctrl.$onInit = function () {
        feedService.findOne($stateParams.uuid).then(function(data) {
            ctrl.feed = data;
        }).catch(function (error) {
            ctrl.message = { type: 'error', message: error };
        })
    };

    ctrl.onDelete = function() {
        return feedService.remove(ctrl.feed);
    };

    ctrl.onSuccessDelete = function() {
        $state.go('admin.feed');
    };

    ctrl.onSave = function() {
        return feedService.save(ctrl.feed);
    };

    ctrl.onSuccessSave = function() {
        ctrl.message = { type: 'success', message: 'saved' };
    };

    ctrl.onError = function(error) {
        if(error.status === 409) {
            ctrl.message = { type: 'error', message: 'abort. Feed has subscriptions' };
        } else if (error.status === 400) {
            ctrl.validations = error.data.fieldErrors;
        } else {
            ctrl.message = { type: 'error', message: error.data };
        }
    };

    ctrl.css = require('./feed.component.css');
}

require('angular').module('myreader').component('myFeed', {
    template: require('./feed.component.html'),
    controller: ['$state', '$stateParams', 'feedService', FeedComponent]
});
