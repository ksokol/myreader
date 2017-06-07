(function () {
    'use strict';

    require('../../shared/component/autocomplete-input/autocomplete-input.component');

    function SubscriptionTagPanelComponent (subscriptionTagService) {
        var ctrl = this;

        ctrl.loadTags = function () {
            return subscriptionTagService.findAll();
        };
    }

    require('angular').module('myreader').component('mySubscriptionTagPanel', {
        template: require('./subscription-tag-panel.component.html'),
        controller: ['subscriptionTagService', SubscriptionTagPanelComponent],
        bindings: {
            mySelectedItem: '<',
            myDisabled: '<',
            myOnSelect: '&',
            myOnClear: '&'
        }
    });

    module.exports = 'myreader.subscription-tag-panel.component';

})();
