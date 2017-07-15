'use strict';

require('../shared/component/search-input/search-input.component');
require('../shared/component/icon/icon.component');
require('./feed.service');

function FeedListComponent($state, feedService) {
    var ctrl = this;

    ctrl.$onInit = function() {
        feedService.findAll().then(function(data) {
            ctrl.feeds = data;
        }).catch (function(error) {
            ctrl.message = { type: 'error', message: error };
        });
    };

    ctrl.open = function(feed) {
        $state.go('admin.feed-detail', { uuid: feed.uuid });
    };

    ctrl.onSearchChange = function (value) {
        ctrl.searchKey = value;
    };

    ctrl.onSearchClear = function () {
        ctrl.searchKey = '';
    };

    ctrl.css = require('./feed-list.component.css');
}

require('angular').module('myreader').component('myFeedList', {
    template: require('./feed-list.component.html'),
    controller: ['$state', 'feedService', FeedListComponent]
});
