'use strict';

require('./feed-fetch-error/feed-fetch-error.component');
require('../../shared/component/icon/icon.component');

function FeedFetchErrorPanelComponent () {
    var ctrl = this;

    ctrl.open = function () {
        ctrl.firstOpen = true;
        ctrl.showErrors = true;
    };

    ctrl.close = function () {
        ctrl.showErrors = false;
    };

    ctrl.css = require('./feed-fetch-error-panel.component.css');
}

require('angular').module('myreader').component('myFeedFetchErrorPanel', {
    template: require('./feed-fetch-error-panel.component.html'),
    controller: FeedFetchErrorPanelComponent,
    bindings: {
        myId: '<',
        myOnError: '&'
    }
});
