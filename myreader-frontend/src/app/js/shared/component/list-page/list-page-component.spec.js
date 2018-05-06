import {componentMock, mockNgRedux} from '../../../shared/test-utils'

describe('src/app/js/shared/component/list-page/list-page-component.spec.js', () => {

    let rootScope, scope, element, myIcon, mySearchInput

    beforeEach(() => {
        mySearchInput = componentMock('mySearchInput')
        myIcon = componentMock('myIcon')
        angular.mock.module('myreader', mySearchInput, myIcon, mockNgRedux())
    })

    beforeEach(inject(($rootScope, $compile, $ngRedux) => {
        rootScope = $rootScope
        scope = $rootScope.$new(true)

        $ngRedux.setState({router: {query: {q: 'expected q value', other: 'expected other value'}}})

        element = $compile(`<my-list-page my-on-search="onSearch(params)"
                                          my-on-refresh="onRefresh()">
                                <my-action-panel>expected action panel transclusion</my-action-panel>
                                <my-list-panel>expected list panel transclusion</my-list-panel>
                            </my-list-page>`)(scope)
        scope.$digest()
    }))

    it('should transclude action-panel slot', () => {
        expect(angular.element(element.find('my-action-panel')[0]).text().trim()).toContain('expected action panel transclusion')
    })

    it('should transclude list-panel slot', () => {
        expect(element.children()[1].classList).toContain('my-list-page__list-panel')
        expect(angular.element(element.children()[1]).text().trim()).toContain('expected list panel transclusion')
    })

    it('should pass properties to child components', () => {
        expect(mySearchInput.bindings.myValue).toEqual('expected q value')
        expect(myIcon.bindings.myType).toEqual('refresh')
    })

    it('should set q to expected value when myOnChange event received', done => {
        scope.onSearch = params => {
            expect(params).toEqual({q: 'search value changed', other: 'expected other value'})
            done()
        }

        mySearchInput.bindings.myOnChange({value: 'search value changed'})
        scope.$digest()
    })

    it('should emit myOnRefresh event when refresh button clicked', done => {
        scope.onRefresh = () => done()

        element.find('my-icon-button').triggerHandler('click')
        scope.$digest()
    })
})
