import {mockNgRedux} from 'shared/test-utils'

describe('src/app/js/settings/settings.component.spec.js', () => {

    let scope, element, ngReduxMock

    beforeEach(angular.mock.module('myreader', mockNgRedux()))

    beforeEach(inject(($rootScope, $compile, $ngRedux) => {
        scope = $rootScope.$new()
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

    it('should update pageSize setting', () =>  {
        element.find('md-select').triggerHandler('click')
        scope.$digest()

        const select = angular.element(angular.element(document).find('md-select-menu'))
        select.find('md-option')[2].click()
        scope.$digest()

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
