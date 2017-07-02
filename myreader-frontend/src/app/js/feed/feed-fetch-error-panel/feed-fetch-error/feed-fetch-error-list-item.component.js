'use strict';

require('../../../shared/timeago/timeago.filter');

require('angular').module('myreader').component('myFeedFetchErrorListItem', {
    template: require('./feed-fetch-error-list-item.component.html'),
    bindings: {
        myItem: '<'
    }
});
