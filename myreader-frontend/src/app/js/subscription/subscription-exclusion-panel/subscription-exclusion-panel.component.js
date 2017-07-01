(function () {
    'use strict';

    require('./subscription-exclusion/subscription-exclusion.component');
    require('../../shared/component/icon/icon.component');

    function SubscriptionExclusionPanelComponent () {
        var ctrl = this;

        ctrl.open = function () {
            ctrl.firstOpen = true;
            ctrl.showExclusions = true;
        };

        ctrl.close = function () {
            ctrl.showExclusions = false;
        };

        ctrl.css = require('./subscription-exclusion-panel.component.css');
    }

    require('angular').module('myreader').component('mySubscriptionExclusionPanel', {
        template: require('./subscription-exclusion-panel.component.html'),
        controller: SubscriptionExclusionPanelComponent,
        bindings: {
            myId: '<',
            myDisabled: '<',
            myOnError: '&'
        }
    });

})();
