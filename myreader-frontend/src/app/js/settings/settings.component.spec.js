import {mockNgRedux, multipleComponentMock} from 'shared/test-utils'

describe('src/app/js/settings/settings.component.spec.js', () => {

    let scope, choose, ngReduxMock

    beforeEach(() => {
        choose = multipleComponentMock('myChoose')
        angular.mock.module('myreader', choose, mockNgRedux())
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

        $compile('<my-settings></my-settings>')(scope)
        scope.$digest()
    }))

    it('should dispatch action with proper type', () => {
        choose.bindings[0].myOnChoose({option: false})

        expect(ngReduxMock.getActionTypes()).toEqual(['SETTINGS_UPDATE'])
    })

    it('should initialize choose components', () => {
        expect(choose.bindings[0]).toContainObject({myValue: 20, myOptions: [10, 20, 30]})
        expect(choose.bindings[1]).toContainObject({myValue: false, myOptions: [{label: 'show', value: false}, {label: 'hide', value: true}]})
        expect(choose.bindings[2]).toContainObject({myValue: true, myOptions: [{label: 'show', value: true}, {label: 'hide', value: false}]})
    })

    it('should update pageSize setting', () => {
        choose.bindings[0].myOnChoose({option: 30})

        expect(ngReduxMock.getActions()[0]).toContainActionData({settings: {pageSize: 30}})
    })

    it('should update showUnseenEntries setting', () => {
        choose.bindings[1].myOnChoose({option: true})

        expect(ngReduxMock.getActions()[0]).toContainActionData({settings: {showUnseenEntries: true}})
    })

    it('should update showEntryDetails setting', () => {
        choose.bindings[2].myOnChoose({option: false})

        expect(ngReduxMock.getActions()[0]).toContainActionData({settings: {showEntryDetails: false}})
    })
})
