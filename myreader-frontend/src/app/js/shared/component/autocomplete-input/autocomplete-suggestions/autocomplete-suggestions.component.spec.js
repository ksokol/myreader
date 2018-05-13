import {componentMock, multipleComponentMock, onKey, tick} from '../../../../shared/test-utils'

class AutocompleteSuggestionsPage {

    constructor(el, scope) {
        this.el = el
        this.scope = scope
    }

    get suggestions() {
        return this.el.querySelectorAll('li')
    }

    get highlightedSuggestionIndex() {
        const node = this.el.querySelector('.my-autocomplete-suggestions__item--selected')
        return node ? node.dataset['index'] : undefined
    }

    clickOnSuggestion(index) {
        this.suggestions[index].click()
    }

    keyDown() {
        onKey('down', {key: 'ArrowDown', keyCode: 40})
        tick()
        this.scope.$digest()
    }

    keyUp() {
        onKey('down', {key: 'ArrowUp', keyCode: 38})
        tick()
        this.scope.$digest()
    }

    keyEnter() {
        onKey('down', {key: 'Enter', keyCode: 13})
        tick()
        this.scope.$digest()
    }

    keyEscape() {
        onKey('down', {key: 'esc', keyCode: 27})
        tick()
        this.scope.$digest()
    }
}

describe('src/app/js/shared/component/autocomplete-input/autocomplete-suggestions/autocomplete-suggestions.component.spec.js', () => {

    let page, scope, autoScroll, autocompleteSuggestionsItemTexts

    beforeEach(() => {
        autocompleteSuggestionsItemTexts = multipleComponentMock('myAutocompleteSuggestionsItemText')
        autoScroll = componentMock('myAutoScroll')
        angular.mock.module('myreader', autoScroll, autocompleteSuggestionsItemTexts)
    })

    beforeEach(inject(($rootScope, $compile) => {
        jest.useFakeTimers() // TODO Remove me together with patched setTimeout function in app.module.js.
        scope = $rootScope.$new(true)
        scope.values = ['term1', 'term2']
        scope.onSelectSuggestion = jest.fn()

        const element = $compile(`<my-autocomplete-suggestions
                                    my-values="values"
                                    my-current-term="searchTerm"
                                    my-on-select="onSelectSuggestion(term)">
                                  </my-autocomplete-suggestions>`)(scope)[0]
        scope.$digest()
        page = new AutocompleteSuggestionsPage(element, scope)
    }))

    it('should not show suggestions when no suggestions given', () => {
        scope.values = []
        scope.$digest()
        expect(page.suggestions.length).toEqual(0)
    })

    it('should show suggestions when suggestions given', () => {
        expect(page.suggestions.length).toEqual(2)
    })

    it('should not reduce suggestions when current search term matches all suggestions', () => {
        scope.searchTerm = 'ter'
        scope.$digest()

        expect(page.suggestions.length).toEqual(2)
    })

    it('should reduce suggestions to current search term', () => {
        scope.searchTerm = 'term1'
        scope.$digest()

        expect(page.suggestions.length).toEqual(1)
    })

    it('should pass search term to item text components', () => {
        scope.searchTerm = 'ter'
        scope.$digest()

        expect(autocompleteSuggestionsItemTexts.bindings[0]).toContainObject({myTerm: 'term1', myTermFragment: 'ter'})
        expect(autocompleteSuggestionsItemTexts.bindings[1]).toContainObject({myTerm: 'term2', myTermFragment: 'ter'})
    })

    it('should pass changed search term to item text components', () => {
        scope.searchTerm = 'term1'
        scope.$digest()

        expect(autocompleteSuggestionsItemTexts.bindings[0]).toContainObject({myTerm: 'term1', myTermFragment: 'term1'})
    })

    it('should show all suggestions again', () => {
        scope.searchTerm = 'term1'
        scope.$digest()
        scope.searchTerm = ''
        scope.$digest()

        expect(page.suggestions.length).toEqual(2)
    })

    it('should emit onSelectSuggestion event with selected suggestion on click', () => {
        page.clickOnSuggestion(1)

        expect(scope.onSelectSuggestion).toHaveBeenCalledWith('term2')
    })

    it('should highlight first suggestion on key arrow down', () => {
        page.keyDown()

        expect(page.highlightedSuggestionIndex).toEqual('0')
    })

    it('should highlight second suggestion on key arrow down', () => {
        page.keyDown()
        page.keyDown()

        expect(page.highlightedSuggestionIndex).toEqual('1')
    })

    it('should highlight last suggestion on multiple keys arrow down', () => {
        page.keyDown()
        page.keyDown()
        page.keyDown()
        page.keyDown()

        expect(page.highlightedSuggestionIndex).toEqual('1')
    })

    it('should highlight first suggestion on key arrow down => key arrow down => key arrow up', () => {
        page.keyDown()
        page.keyDown()
        page.keyUp()

        expect(page.highlightedSuggestionIndex).toEqual('0')
    })

    it('should highlight no suggestion on key arrow down => key arrow up', () => {
        page.keyDown()
        page.keyUp()

        expect(page.highlightedSuggestionIndex).toBeUndefined()
    })

    it('should highlight first suggestion on key arrow up => key arrow up => key arrow down', () => {
        page.keyUp()
        page.keyUp()
        page.keyDown()

        expect(page.highlightedSuggestionIndex).toEqual('0')
    })

    it('should highlight no suggestion on key arrow up', () => {
        page.keyUp()

        expect(page.highlightedSuggestionIndex).toBeUndefined()
    })

    it('should emit onSelectSuggestion with first suggestion on key arrow down => key enter', () => {
        page.keyDown()
        page.keyEnter()

        expect(scope.onSelectSuggestion).toHaveBeenCalledWith('term1')
    })

    it('should not emit onSelectSuggestion on key enter', () => {
        page.keyEnter()

        expect(scope.onSelectSuggestion).not.toHaveBeenCalled()
    })

    it('should emit onSelectSuggestion with given search term on key esc', () => {
        scope.searchTerm = 'term'
        scope.$digest()
        page.keyEscape()

        expect(scope.onSelectSuggestion).toHaveBeenCalledWith('term')
    })

    it('should highlight first suggestion on key arrow down when suggestion values changes', () => {
        page.keyDown()
        page.keyDown()

        scope.values = ['term1', 'term2', 'term3']
        scope.$digest()
        page.keyDown()

        expect(page.highlightedSuggestionIndex).toEqual('0')
    })

    it('should highlight first suggestion on key arrow down => key enter => key arrow down', () => {
        page.keyDown()
        page.keyEnter()
        page.keyDown()

        expect(page.highlightedSuggestionIndex).toEqual('0')
    })

    it('should highlight first suggestion on key arrow down => key esc => key arrow down', () => {
        page.keyDown()
        page.keyEscape()
        page.keyDown()

        expect(page.highlightedSuggestionIndex).toEqual('0')
    })

    it('should highlight first suggestion on key arrow down => click highlighted suggestion => key arrow down', () => {
        page.keyDown()
        page.clickOnSuggestion(1)
        page.keyDown()

        expect(page.highlightedSuggestionIndex).toEqual('0')
    })

    it('should not scroll to any suggestion', () => {
        expect(autoScroll.bindings.myScrollOn).toEqual({'data-index': undefined})
    })

    it('should scroll to first suggestion on key arrow down', () => {
        page.keyDown()

        expect(autoScroll.bindings.myScrollOn).toEqual({'data-index': 0})
    })

    it('should scroll to second suggestion on key arrow down => key arrow down', () => {
        page.keyDown()
        page.keyDown()

        expect(autoScroll.bindings.myScrollOn).toEqual({'data-index': 1})
    })

    it('should highlight first suggestion on key arrow down with one suggestion value', () => {
        scope.values = ['term1']
        scope.$digest()

        page.keyDown()

        expect(page.highlightedSuggestionIndex).toEqual('0')
    })
})
