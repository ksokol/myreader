(function () {
    'use strict';

    function ValidationMessage() {
        var ctrl = this;

        ctrl.css = require('./validation-message.component.css');
    }

    require('angular').module('myreader').component('myValidationMessage', {
        template: require('./validation-message.component.html'),
        controller: ValidationMessage,
        bindings: {
            myFormControl: '<'
        }
    });

})();
