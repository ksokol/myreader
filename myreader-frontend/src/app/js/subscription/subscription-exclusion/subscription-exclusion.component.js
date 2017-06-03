(function () {
    'use strict';

    function SubscriptionExclusionComponent (exclusionService) {
        var ctrl = this;

        var handleError = function (error) {
            ctrl.myOnError({error: error});
        };

        var sortExclusions = function () {
            ctrl.exclusions.sort(function (left, right) {
                if (left.pattern < right.pattern) {
                    return -1;
                }
                if (left.pattern > right.pattern) {
                    return 1;
                }
                return 0;
            })
        };

        var startLoading = function () {
            ctrl.loading = true;
        };

        var endLoading = function () {
            ctrl.loading = false;
        };

        var startProcessing = function () {
            ctrl.processing = true;
        };

        var endProcessing = function () {
            ctrl.processing = false;
        };

        var initExclusions = function (exclusions) {
            ctrl.exclusions = exclusions;
            sortExclusions();
        };

        var addExclusion = function (exclusion) {
            ctrl.exclusions.push(exclusion);
            sortExclusions();
        };

        ctrl.$onChanges = function (obj) {
            if(obj.myId.currentValue && obj.myId.currentValue !== ctrl.id) {
                ctrl.id = obj.myId.currentValue;
                startLoading();

                exclusionService.find(ctrl.id)
                    .then(initExclusions)
                    .catch(handleError)
                    .finally(endLoading);
            }
        };

        ctrl.onRemove = function (exclusion) {
            startProcessing();
            exclusionService.delete(ctrl.id, exclusion.uuid)
                .catch(function (error) {
                    addExclusion(exclusion);
                    handleError(error);
                })
                .finally(endProcessing);
        };

        ctrl.onTransform = function ($chip) {
            startProcessing();
            exclusionService.save(ctrl.id, $chip)
                .then(addExclusion)
                .catch(handleError)
                .finally(endProcessing);

            return null; // don't render the new chip
        };

        ctrl.placeholder = function () {
            return ctrl.processing ? 'processing...' : 'Enter an exclusion pattern';
        };

        ctrl.isDisabled = function () {
            return ctrl.id === undefined || ctrl.myDisabled === true;
        }
    }

    require('angular').module('myreader').component('mySubscriptionExclusion', {
        template: require('./subscription-exclusion.component.html'),
        controller: ['exclusionService', SubscriptionExclusionComponent],
        bindings: {
            myId: '<',
            myDisabled: '<',
            myOnError: '&'
        }
    });

    module.exports = 'myreader.subscription-exclusion.component';

})();
