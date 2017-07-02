'use strict';

require('./feed-fetch-error.service');
require('./feed-fetch-error-list-item.component');
require('../../../shared/component/load-more/load-more.component');

function FeedFetchErrorComponent(feedFetchErrorService) {
    var ctrl = this;
    ctrl.errors = [];

    ctrl.$onChanges = function (obj) {
        if (obj.myId.currentValue !== ctrl.id) {
            ctrl.id = obj.myId.currentValue;
            ctrl.loading = true;

            feedFetchErrorService.findByFeedId(ctrl.id).then(function (errors) {
                ctrl.next = errors.next();
                ctrl.totalElements = errors.totalElements;
                ctrl.retainDays = errors.retainDays;
                ctrl.errors = errors.fetchError;
            }).catch(function (error) {
                ctrl.myOnError({error: error});
            }).finally(function () {
                ctrl.loading = false;
            });
        }
    };

    ctrl.onMore = function (load) {
        feedFetchErrorService.findByLink(load).then(function (errors) {
            ctrl.next = errors.next();
            ctrl.errors = ctrl.errors.concat(errors.fetchError);
        }).catch(function (error) {
            ctrl.myOnError({error: error});
        });
    };

    ctrl.hasErrors = function () {
        return ctrl.errors.length > 0;
    };

    ctrl.css = require('./feed-fetch-error.component.css');
}

require('angular').module('myreader').component('myFeedFetchError', {
    template: require('./feed-fetch-error.component.html'),
    controller: ['feedFetchErrorService', FeedFetchErrorComponent],
    bindings: {
        myId: '<',
        myOnError: '&'
    }
});
