import {multipleComponentMock} from '../../../shared/test-utils'

class ChooseItem {

    constructor(el) {
        this.el = el
    }

    get text() {
        return this.el[0].innerText.trim()
    }

    get selected() {
        return this.el[0].classList.contains('my-choose__button--selected')
    }
}

class Choose {

    constructor(el) {
        this.el = el
    }

    items() {
        return Object.values(this.el.children()).map(it => new ChooseItem(angular.element(it)))
    }
}

describe('src/app/js/shared/component/choose/choose.component.spec.js', () => {

    let scope, choose, myButtons

    beforeEach(() => {
        myButtons = multipleComponentMock('myButton')
        angular.mock.module('myreader', myButtons)
    })

    beforeEach(inject(($rootScope, $compile) => {
        scope = $rootScope.$new(true)
        scope.onChoose = jasmine.createSpy('onChoose()')
        scope.value = 2

        const element = $compile(`<my-choose my-value="value"
                                             my-options="options"
                                             my-on-choose="onChoose(option)">
                                  </my-choose>`)(scope)
        choose = new Choose(element)
    }))

    describe('with primitive options', () => {

        beforeEach(() => {
            scope.options = [1, 2, 3]
            scope.$digest()
        })

        it('should create button component for every value in myOptions', () => {
            const items = choose.items()

            expect(items[0].text).toEqual('1')
            expect(items[1].text).toEqual('2')
            expect(items[2].text).toEqual('3')
        })

        it('should highlight selected option', () => {
            const items = choose.items()

            expect(items[0].selected).toEqual(false)
            expect(items[1].selected).toEqual(true)
            expect(items[2].selected).toEqual(false)
        })

        it('should propagate selected option', () => {
            myButtons.bindings[2].myOnClick({option: 3})

            expect(scope.onChoose).toHaveBeenCalledWith(3)
        })
    })

    describe('with object options', () => {

        beforeEach(() => {
            scope.options = [{label: 'one', value: 1}, {label: 'two', value: 2}, {label: 'three', value: 3}]
            scope.$digest()
        })

        it('should create button component for every value in myOptions', () => {
            const items = choose.items()

            expect(items[0].text).toEqual('one')
            expect(items[1].text).toEqual('two')
            expect(items[2].text).toEqual('three')
        })

        it('should highlight selected option', () => {
            const items = choose.items()

            expect(items[0].selected).toEqual(false)
            expect(items[1].selected).toEqual(true)
            expect(items[2].selected).toEqual(false)
        })

        it('should propagate selected option', () => {
            myButtons.bindings[2].myOnClick({option: {label: 'three', value: 3}})

            expect(scope.onChoose).toHaveBeenCalledWith(3)
        })
    })
})
