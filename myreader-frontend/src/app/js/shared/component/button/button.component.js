(function () {
    'use strict';

    var utils = require('../../utils');

    function ButtonComponent($timeout, $q) {
        var ctrl = this;
        var disableConfirmButtons = false;
        var isPending = false;

        var shouldPresentConfirmButton = function () {
            return ctrl.myConfirm === 'true';
        };

        var presentConfirmButton = function () {
            disableConfirmButtons = true;
            ctrl.showConfirmButton = true;

            $timeout(function () {
                disableConfirmButtons = false;
            }, 250);
        };

        var processMyOnClick = function () {
            var result = ctrl.myOnClick();
            var promise = result;

            if (!utils.isPromise(result)) {
                var deferred = $q.defer();
                deferred.resolve();
                promise = deferred.promise;
            }

            return promise;
        };

        ctrl.$onInit = function () {
            ctrl.buttonGroupCtrl.addButton(this);
        };

        ctrl.reset = function () {
            isPending = false;
            ctrl.showConfirmButton = false;
            ctrl.buttonGroupCtrl.enableButtons();
        };

        ctrl.onClick = function () {
            ctrl.buttonGroupCtrl.disableButtons();
            shouldPresentConfirmButton() ? presentConfirmButton() : ctrl.processOnClick();
        };

        ctrl.processOnClick = function () {
            isPending = true;

            processMyOnClick().then(function (data) {
                ctrl.myOnSuccess({data: data});
            }).catch(function (data) {
                ctrl.myOnError({error: data});
            }).finally(function () {
                ctrl.reset();
            });
        };

        ctrl.isDisabled = function () {
            return isPending || disableConfirmButtons || ctrl.myDisabled;
        };

        ctrl.disable = function () {
            disableConfirmButtons = shouldPresentConfirmButton() || !ctrl.showConfirmButton;
        };

        ctrl.enable = function () {
            disableConfirmButtons = false;
        };

        ctrl.css = require('./button.component.css');
    }

    require('angular').module('myreader').component('myButton', {
        template: require('./button.component.html'),
        controller: ['$timeout', '$q', ButtonComponent],
        require: {
            buttonGroupCtrl: '^myButtonGroup'
        },
        bindings: {
            myText: '@',
            myType: '@',
            myConfirm: '@',
            myDisabled: '<',
            myOnClick: '&',
            myOnSuccess: '&',
            myOnError: '&'
        }
    });

    module.exports = 'myreader.button.component';

})();
