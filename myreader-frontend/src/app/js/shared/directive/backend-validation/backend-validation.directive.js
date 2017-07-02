'use strict';

require('angular').module('myreader').directive('myBackendValidation', function () {

    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          myValidations: '<'
        },
        link: function($scope, element, attr, modelCtrl) {
            $scope.$watch('myValidations', function (validations) {
                validations = validations || [];

                validations
                    .filter(function (validation) {
                        return modelCtrl.$name === validation.field;
                    })
                    .forEach(function (validation) {
                        modelCtrl.$setValidity(validation.message, false);
                        modelCtrl.$setDirty();
                    });
            });

            element.on('keydown', function () {
                Object.keys(modelCtrl.$error).forEach(function (k) {
                    modelCtrl.$setValidity(k, true);
                });
            });
        }
    }
});
