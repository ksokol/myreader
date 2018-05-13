describe('src/app/js/shared/component/validation-message/validation-message.component.spec.js', () => {

    let scope, element

    beforeEach(angular.mock.module('myreader'))

    beforeEach(inject(($rootScope, $compile) => {
        scope = $rootScope.$new(true)
        scope.control = {$pristine: false}

        element = $compile('<my-validation-message my-form-control="control"></my-validation-message>')(scope)[0]
        scope.$digest()
    }))

    it('should hide validation messages when no error occurred', () => {
        const messages = element.querySelectorAll('div > div')

        expect(messages.length).toEqual(0)
    })

    it('should show one validation message', () => {
        scope.control.$error = {'expected error': true}
        scope.$digest()

        const messages = element.querySelectorAll('div > div')

        expect(messages.length).toEqual(1)
        expect(messages[0].textContent).toEqual('expected error')
    })

    it('should show multiple validation messages', () => {
        scope.control.$error = {'expected error1': true, 'expected error2': true}
        scope.$digest()

        const messages = element.querySelectorAll('div > div')

        expect(messages.length).toEqual(2)
        expect(messages[0].textContent).toEqual('expected error1')
        expect(messages[1].textContent).toEqual('expected error2')
    })

    it('should hide validation messages when control is pristine', () => {
        scope.control.$pristine = true
        scope.control.$error = {'expected error': true}
        scope.$digest()

        const messages = element.querySelectorAll('div > div')

        expect(messages.length).toEqual(0)
    })
})
