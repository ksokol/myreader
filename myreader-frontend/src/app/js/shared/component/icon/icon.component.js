(function () {
    'use strict';

    function IconComponent() {
        var ctrl = this;

        ctrl.iconColor = 'my-icon__icon--grey';

        ctrl.$onInit = function () {
            ctrl.iconClass = 'my-icon__icon--' + ctrl.myType;

            if (ctrl.myColor) {
                ctrl.iconColor = 'my-icon__icon--' + ctrl.myColor;
            }
        };

        ctrl.css = require('./icon.component.css');
    }

    require('angular').module('myreader').component('myIcon', {
        template: '<md-icon class="my-icon" ng-class="[$ctrl.iconClass, $ctrl.iconColor]"></md-icon>',
        controller: IconComponent,
        bindings: {
            myType: '@',
            myColor: '@'
        }
    });

})();
