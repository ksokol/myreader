describe('src/app/js/shared/directive/backend-validation/backend-validation.directive.spec.js', () => {

    let scope, element, model

    beforeEach(angular.mock.module('myreader'))

    beforeEach(inject(($rootScope, $compile) => {
        scope = $rootScope.$new(true)

        scope.model = {modelField: null}

        element = $compile(`<form>
                              <input name="modelField"
                                     ng-model="model.modelField"
                                     my-backend-validation my-validations="validations">
                            </form>`)(scope)
        scope.$digest()
        model = element.find('input').controller('ngModel')
    }))

    it('should contain valid model', () => {
        expect(model.$dirty).toEqual(false)
        expect(model.$valid).toEqual(true)
        expect(model.$error).toEqual({})
    })

    it('should contain invalid model with two validation messages', () => {
        scope.validations = [{
            field: 'modelField',
            message: 'validation message1'
        }, {
            field: 'modelField',
            message: 'validation message2'
        }]
        scope.$digest()

        expect(model.$dirty).toEqual(true)
        expect(model.$valid).toEqual(false)
        expect(model.$error).toEqual({'validation message1': true, 'validation message2': true})
    })

    it('should contain valid model when validation field name does not match model name', () => {
        scope.validations = [{
            field: 'otherField',
            message: 'validation message'
        }]
        scope.$digest()

        expect(model.$dirty).toEqual(false)
        expect(model.$valid).toEqual(true)
        expect(model.$error).toEqual({})
    })

    it('should clear validation messages on keydown', () => {
        scope.validations = [{
            field: 'modelField',
            message: 'validation message'
        }]
        scope.$digest()

        element.find('input').triggerHandler({type: 'keydown', keyCode: 65})

        expect(model.$error).toEqual({})
        expect(model.$valid).toEqual(true)
        expect(model.$dirty).toEqual(true)
    })
})
