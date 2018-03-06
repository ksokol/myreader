class Chip {

    constructor(el) {
        this.el = el
    }

    get selected() {
        return this.el.children()[0].classList.contains('my-chip--selected')
    }

    innerHtml() {
        return this.el.children()[0].innerHTML
    }

    click() {
        this.el.children()[0].click()
    }
}

class Chips {

    constructor(el) {
        this.el = el
    }

    chips() {
        return Object.values(this.el.find('my-chip')).map(it => new Chip(angular.element(it)))
    }
}

describe('src/app/js/shared/component/chips/chips.spec.js', () => {

    let scope, chips

    beforeEach(() => angular.mock.module('myreader'))

    beforeEach(inject(($rootScope, $compile) => {
        scope = $rootScope.$new(true)

        scope.values = ['chip1', 'chip2', 'chip3']
        scope.selected = 'chip2'
        scope.onSelect = jasmine.createSpy('scope.onSelect()')

        const element = $compile(`<my-chips my-selected="selected"
                                            my-on-select="onSelect(key)">
                                        <my-chip ng-repeat="value in values" my-key="value">{{value}}</my-chip>
                                  </my-chips>`)(scope)
        scope.$digest()
        chips = new Chips(element)
    }))

    it('should transclude chip content', () => {
        expect(chips.chips()[0].innerHtml()).toEqual('chip1')
        expect(chips.chips()[1].innerHtml()).toEqual('chip2')
        expect(chips.chips()[2].innerHtml()).toEqual('chip3')
    })

    it('should mark chip as selected', () => {
        expect(chips.chips()[0].selected).toEqual(false)
        expect(chips.chips()[1].selected).toEqual(true)
        expect(chips.chips()[2].selected).toEqual(false)
    })

    it('should trigger onSelect when chip clicked', () => {
        chips.chips()[2].click()

        expect(scope.onSelect).toHaveBeenCalledWith('chip3')
    })

    it('should not trigger onSelect when chip is already selected', () => {
        chips.chips()[1].click()

        expect(scope.onSelect).not.toHaveBeenCalled()
    })
})
