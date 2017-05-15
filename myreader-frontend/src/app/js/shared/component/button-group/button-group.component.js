(function () {
    'use strict';

    function ButtonGroupComponent() {
        var ctrl = this;
        ctrl.buttons = [];

        ctrl.disableButtons = function () {
            for (var i = 0; i < ctrl.buttons.length; i++) {
                ctrl.buttons[i].disable();
            }
        };

        ctrl.enableButtons = function () {
            for (var i = 0; i < ctrl.buttons.length; i++) {
                ctrl.buttons[i].enable();
            }
        };

        ctrl.addButton = function (button) {
            ctrl.buttons.push(button);
        };
    }

    require('angular').module('myreader').component('myButtonGroup', {
        template: '<div layout="row" layout-align="end center" ng-transclude></div>',
        transclude: true,
        controller: ButtonGroupComponent
    });

    module.exports = 'myreader.button-group.component';

})();
