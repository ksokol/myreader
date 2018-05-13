describe('src/app/js/shared/component/button-group/button-group.component.spec.js', () => {

    let component, button1, button2

    beforeEach(angular.mock.module('myreader'))

    beforeEach(inject(_$componentController_ => {
        component = _$componentController_('myButtonGroup')

        button1 = {
            enable: jest.fn(),
            disable: jest.fn()
        }
        button2 = {
            enable: jest.fn(),
            disable: jest.fn()
        }

        component.addButton(button1)
        component.addButton(button2)
    }))

    it('should have to buttons', () => {
        expect(component.buttons).toEqual([button1, button2])
    })

    it('should disable all buttons when disableButtons() called', () => {
        component.disableButtons()

        expect(button1.disable).toHaveBeenCalled()
        expect(button2.disable).toHaveBeenCalled()
    })

    it('should enable all buttons when enableButtons() called', () => {
        component.enableButtons()

        expect(button1.enable).toHaveBeenCalled()
        expect(button2.enable).toHaveBeenCalled()
    })

    it('should transclude content', inject(($compile, $rootScope) => {
        const scope = $rootScope.$new(true)
        const element = $compile('<my-button-group><p>expected transclution</p></my-button-group>')(scope)[0]
        scope.$digest()

        expect(element.querySelectorAll('p')[0].textContent).toEqual('expected transclution')
    }))
})
