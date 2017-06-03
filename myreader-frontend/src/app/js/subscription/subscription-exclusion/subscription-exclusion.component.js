(function () {
    'use strict';

    function SubscriptionExclusionComponent () {
        var ctrl = this;

        ctrl.$onChanges = function (obj) {
            if(obj.myExclusions.currentValue) {
                ctrl.exclusions = obj.myExclusions.currentValue.slice();
            }
        };

        ctrl.onRemove = function ($chip) {
            ctrl.myOnDelete({value: $chip});
        };

        ctrl.onTransform = function ($chip) {
            ctrl.myOnAdd({value: $chip});
            return null; // don't render the new chip
        }
    }

    require('angular').module('myreader').component('mySubscriptionExclusion', {
        template: require('./subscription-exclusion.component.html'),
        controller: SubscriptionExclusionComponent,
        bindings: {
            myExclusions: '<',
            myOnAdd: '&',
            myOnDelete: '&'
        }
    });

    module.exports = 'myreader.subscription-exclusion.component';

})();
