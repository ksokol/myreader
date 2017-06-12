describe('src/app/js/shared/directive/backend-validation/backend-validation.directive.spec.js', function () {

    beforeEach(require('angular').mock.module('myreader', 'ngMaterial-mock'));

    describe('with html', function () {

        var scope, element, model;

        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope.$new();

            scope.model = {modelField: null};

            element = $compile('<form><input name="modelField" ng-model="model.modelField" my-backend-validation my-validations="validations"></form>')(scope);
            scope.$digest();
            model = element.find('input').controller('ngModel');
        }));

        it('should contain valid model', function () {
            expect(model.$dirty).toEqual(false);
            expect(model.$valid).toEqual(true);
            expect(model.$error).toEqual({});
        });

        it('should contain invalid model with two validation messages', function () {
            scope.validations = [{
                field: 'modelField',
                message: 'validation message1'
            }, {
                field: 'modelField',
                message: 'validation message2'
            }];
            scope.$digest();

            expect(model.$dirty).toEqual(true);
            expect(model.$valid).toEqual(false);
            expect(model.$error).toEqual({'validation message1': true, 'validation message2': true});
        });

        it('should contain valid model when validation field name does not match model name', function () {
            scope.validations = [{
                field: 'otherField',
                message: 'validation message'
            }];
            scope.$digest();

            expect(model.$dirty).toEqual(false);
            expect(model.$valid).toEqual(true);
            expect(model.$error).toEqual({});
        });

        it('should clear validation messages on keypress', function () {
            scope.validations = [{
                field: 'modelField',
                message: 'validation message'
            }];
            scope.$digest();

            element.find('input').triggerHandler({ type: 'keypress', keyCode: 65 });

            expect(model.$error).toEqual({});
            expect(model.$valid).toEqual(true);
            expect(model.$dirty).toEqual(true);
        });
    });
});
