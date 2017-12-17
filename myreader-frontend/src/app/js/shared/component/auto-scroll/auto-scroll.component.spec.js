function createElement(html) {
    const element = angular.element(html)
    element.scrollIntoView = jasmine.createSpy('scrollIntoView')
    return element
}

describe('src/app/js/shared/component/auto-scroll/auto-scroll.component.spec.js', () => {

    beforeEach(angular.mock.module('myreader'))

    let component, $element

    beforeEach(inject($componentController => {
        $element = jasmine.createSpyObj('$element', ['children'])
        $element.children.and.returnValue([])

        component = $componentController('myAutoScroll', {$element})
    }))

    it('should not scroll to element when element is not in focus', () => {
        const element = createElement(`<div data-uuid="1"></div>`)
        $element.children.and.returnValue([element])

        component.$onChanges({})

        expect(element.scrollIntoView).not.toHaveBeenCalled()
    })

    it('should not scroll to element when currentValue is invalid', () => {
        const element = createElement(`<div data-uuid="1"></div>`)
        $element.children.and.returnValue([element])

        component.$onChanges({myScrollOn: {currentValue: {'data-uuid': undefined}}})

        expect(element.scrollIntoView).not.toHaveBeenCalled()
    })

    it('should scroll to element when in focus', () => {
        const element = createElement(`<div data-uuid="1"></div>`)
        $element.children.and.returnValue([element])

        component.$onChanges({myScrollOn: {currentValue: {'data-uuid': '1'}}})

        expect(element.scrollIntoView).toHaveBeenCalledWith({block: 'start', behavior: 'smooth'})
    })

    it('should scroll back to first element', () => {
        const element1 = createElement(`<div data-uuid="1"></div>`)
        const element2 = createElement(`<div data-uuid="2"></div>`)
        $element.children.and.returnValue([element1, element2])

        component.$onChanges({myScrollOn: {currentValue: {'data-uuid': '1'}}})
        component.$onChanges({myScrollOn: {currentValue: {'data-uuid': '2'}}})
        component.$onChanges({myScrollOn: {currentValue: {'data-uuid': '1'}}})

        expect(element1.scrollIntoView).toHaveBeenCalledWith()
    })

    it('should not scroll to third element', () => {
        const element1 = createElement(`<div data-uuid="1"></div>`)
        const element2 = createElement(`<div data-uuid="2"></div>`)
        const element3 = createElement(`<div data-uuid="3"></div>`)
        $element.children.and.returnValue([element1, element2, element3])

        component.$onChanges({myScrollOn: {currentValue: {'data-uuid': '1'}}})
        component.$onChanges({myScrollOn: {currentValue: {'data-uuid': '2'}}})
        component.$onChanges({myScrollOn: {currentValue: {'data-uuid': '1'}}})

        expect(element3.scrollIntoView).not.toHaveBeenCalled()
    })

    it('should smooth scroll to first element after DOM changed', () => {
        const element1 = createElement(`<div data-uuid="1"></div>`)
        const element2 = createElement(`<div data-uuid="2"></div>`)
        $element.children.and.returnValue([element1, element2])

        component.$onChanges({myScrollOn: {currentValue: {'data-uuid': '1'}}})
        component.$onChanges({myScrollOn: {currentValue: {'data-uuid': '2'}}})
        component.$onChanges({myScrollOn: {currentValue: {'data-uuid': '1'}}})

        const element10 = createElement(`<div data-uuid="10"></div>`)
        $element.children.and.returnValue([element10])
        component.$onChanges({myScrollOn: {currentValue: {'data-uuid': '10'}}})

        expect(element10.scrollIntoView).toHaveBeenCalledWith({block: 'start', behavior: 'smooth'})
    })
})
