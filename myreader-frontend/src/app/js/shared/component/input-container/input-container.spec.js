describe('src/app/js/shared/component/input-container/input-container.spec.js', () => {

    let rootScope, scope, element

    beforeEach(angular.mock.module('myreader'))

    beforeEach(inject(($rootScope, $compile) => {
        rootScope = $rootScope
        scope = $rootScope.$new(true)

        element = $compile(`<form name="theForm">
                              <my-input-container>
                                <input name="propLabel"
                                       ng-model="prop"
                                       my-backend-validation my-validations="validations">
                                <my-validation-message my-form-control="theForm.propLabel"></my-validation-message>
                              </my-input-container>
                            </form>`)(scope)
        scope.$digest()
    }))

    it('should transclude content', () => {
        expect(element.find('input')[0]).toBeDefined()
    })

    it('should add error class to transcluded content', () => {
        scope.validations = [{field: 'propLabel', message: 'may not be empty'}]
        rootScope.$digest()

        expect(element.find('ng-transclude')[0].classList).toContain('my-input-container--error')
    })

    it('should remove error class from transcluded content when input changes', () => {
        scope.validations = [{field: 'propLabel', message: 'may not be empty'}]
        rootScope.$digest()

        element.find('input').triggerHandler({type: 'keydown'})
        scope.$digest()

        expect(element.find('ng-transclude')[0].classList).not.toContain('my-input-container--error')
    })
})
