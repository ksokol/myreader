class AutocompleteSuggestionsItemTextPage {

    constructor(el) {
        this.el = el
    }

    get termHighlight() {
        return this.el[0].childNodes[0].textContent
    }

    get termFragment() {
        return this.el[0].childNodes[1].textContent
    }
}


describe('src/app/js/shared/component/autocomplete-input/autocomplete-suggestions/autocomplete-suggestions-item-text.component.spec.js', () => {

    let page, scope

    beforeEach(angular.mock.module('myreader'))

    beforeEach(inject(($rootScope, $compile) => {
        scope = $rootScope.$new(true)

        const element = $compile(`<my-autocomplete-suggestions-item-text
                              my-term="term"
                              my-term-fragment="termFragment">
                            </my-autocomplete-suggestions-item-text>`)(scope)
        scope.$digest()
        page = new AutocompleteSuggestionsItemTextPage(element)
    }))

    it('should show nothing when term and term fragment are undefined', () => {
        expect(page.termHighlight).toEqual('')
        expect(page.termFragment).toEqual('')
    })

    it('should show term without highlighted term fragment when term fragment is undefined', () => {
        scope.term = 'expected term'
        scope.$digest()

        expect(page.termHighlight).toEqual('')
        expect(page.termFragment).toEqual('expected term')
    })

    it('should show term with highlighted term fragment', () => {
        scope.term = 'termFragment'
        scope.termFragment = 'te'
        scope.$digest()

        expect(page.termHighlight).toEqual('te')
        expect(page.termFragment).toEqual('rmFragment')
    })

    it('should show term without highlighted term fragment when term fragment does not start with term', () => {
        scope.term = 'a term'
        scope.termFragment = 'other'
        scope.$digest()

        expect(page.termHighlight).toEqual('')
        expect(page.termFragment).toEqual('a term')
    })

    it('should show term without highlighted term fragment when term fragment does not start with uppercase character', () => {
        scope.term = 'a term'
        scope.termFragment = 'A term'
        scope.$digest()

        expect(page.termHighlight).toEqual('')
        expect(page.termFragment).toEqual('a term')
    })
})
