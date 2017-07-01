(function () {
    'use strict';

    require('../icon/icon.component');

    function NotificationPanelComponent($timeout) {
        var ctrl = this;
        var promise;

        var reset = function () {
            ctrl.type = null;
            ctrl.message = null;
            ctrl.myOnDismiss();
        };

        ctrl.$onChanges = function (obj) {
            if (promise) {
                $timeout.cancel(promise);
            }

            if (obj.myMessage.currentValue) {
                ctrl.type = obj.myMessage.currentValue.type;
                ctrl.message = obj.myMessage.currentValue.message;
            }

            promise = $timeout(reset, 5000);
        };

        ctrl.onClose = function () {
            $timeout.cancel(promise);
            reset();
        };

        ctrl.css = require('./notification-panel.component.css');
    }

    require('angular').module('myreader').component('myNotificationPanel', {
        template: require('./notification-panel.component.html'),
        controller: ['$timeout', NotificationPanelComponent],
        bindings: {
            myMessage: '<',
            myOnDismiss: '&'
        }
    });

})();
