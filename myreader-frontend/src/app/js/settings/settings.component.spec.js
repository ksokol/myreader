import {mockNgRedux, componentMock} from 'shared/test-utils'

describe('src/app/js/settings/settings.component.spec.js', () => {

    let scope, element, choosePageSize, ngReduxMock

    beforeEach(() => {
        choosePageSize = componentMock('myChoose')
        angular.mock.module('myreader', choosePageSize, mockNgRedux())
    })

    beforeEach(inject(($rootScope, $compile, $ngRedux) => {
        scope = $rootScope.$new(true)
        ngReduxMock = $ngRedux

        ngReduxMock.setState({
            settings: {
                pageSize: 20,
                showUnseenEntries: false,
                showEntryDetails: true
            }
        })

        element = $compile('<my-settings></my-settings>')(scope)
        scope.$digest()
    }))

    it('should dispatch action with proper type', () => {
        element.find('md-checkbox')[1].click()

        expect(ngReduxMock.getActionTypes()).toEqual(['SETTINGS_UPDATE'])
    })

    it('should initialize page size choose component', () =>
        expect(choosePageSize.bindings).toContainObject({myValue: 20, myOptions: [10, 20, 30]}))

    it('should update pageSize setting', () => {
        choosePageSize.bindings.myOnChoose({option: 30})

        expect(ngReduxMock.getActions()[0]).toContainActionData({settings: {pageSize: 30}})
    })

    it('should update showUnseenEntries setting', () => {
        element.find('md-checkbox')[0].click()

        expect(ngReduxMock.getActions()[0]).toContainActionData({settings: {showUnseenEntries: true}})
    })

    it('should update showEntryDetails setting', () => {
        element.find('md-checkbox')[1].click()

        expect(ngReduxMock.getActions()[0]).toContainActionData({settings: {showEntryDetails: false}})
    })
})
