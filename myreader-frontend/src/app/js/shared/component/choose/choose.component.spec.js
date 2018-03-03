import {multipleComponentMock} from 'shared/test-utils'

class ChooseItem {

    constructor(el) {
        this.el = el
    }

    text() {
        return this.el.innerText
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

        const element = $compile(`<my-choose my-value="2"
                                             my-options="[1, 2, 3]"
                                             my-on-choose="onChoose(option)">
                                  </my-choose>`)(scope)
        scope.$digest()
        choose = new Choose(element)
    }))

    it('should create button component for every value in myOptions', () => {
        expect(myButtons.bindings[0].myText).toEqual('1')
        expect(myButtons.bindings[1].myText).toEqual('2')
        expect(myButtons.bindings[2].myText).toEqual('3')
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
