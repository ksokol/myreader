(function () {
    'use strict';

    require('./entry-title/entry-title.component');
    require('./entry-actions/entry-actions.component');
    require('./entry-content/entry-content.component');
    require('./entry-tags/entry-tags.component');

    function EntryComponent(subscriptionEntryService) {
        var ctrl = this;

        var updateItem = function (item) {
            subscriptionEntryService.save(item)
            .then(function (updatedEntry) {
                ctrl.item = updatedEntry;
            })
            .catch(function (error) {
                ctrl.message = { type: 'error', message: error};
            });
        };

        ctrl.$onInit = function () {
            ctrl.item = ctrl.myItem;
        };

        ctrl.onDismissMessage = function () {
            ctrl.message = null;
        };

        ctrl.toggleMore = function (showMore) {
            ctrl.showMore = showMore;
        };

        ctrl.onCheck = function (item) {
            updateItem({
                uuid: ctrl.item.uuid,
                seen: item.seen,
                tag: ctrl.item.tag
            });
        };

        ctrl.onTagUpdate = function (tag) {
            updateItem({
                uuid: ctrl.item.uuid,
                seen: ctrl.item.seen,
                tag: tag
            });
        };

        ctrl.css = require('./entry.component.css');
    }

    require('angular').module('myreader').component('myEntry', {
        template: require('./entry.component.html'),
        controller: [ 'subscriptionEntryService', EntryComponent ],
        bindings: {
            myItem: '<'
        }
    });

    module.exports = 'myreader.entry.component';

})();
