import {mockNgRedux} from '../shared/test-utils'

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

    it('should render setting values', () => {
        expect(element.find('md-option')[1].selected).toBe(true)
        expect(element.find('md-option')[1].innerText).toBe('20')

        expect(element.find('md-checkbox')[0].classList).not.toContain('md-checked')
        expect(element.find('md-checkbox')[1].classList).toContain('md-checked')
    })

    it('should dispatch action with proper type', () => {
        element.find('md-checkbox')[1].click()

        expect(ngReduxMock.getActionTypes()).toEqual(['SETTINGS_UPDATE'])
    })

    it('should update pageSize setting', ()=>  {
        element.find('md-select').triggerHandler('click')
        scope.$digest()

        const select = angular.element(angular.element(document).find('md-select-menu'))
        select.find('md-option')[2].click()
        scope.$digest()

        expect(select.find('md-option')[2].selected).toBe(true)
        expect(select.find('md-option')[2].innerText).toContain('30')
        expect(ngReduxMock.getActions()[0]).toContainActionData({settings: {pageSize: 30}})
    })

    it('should update showUnseenEntries setting', () => {
        element.find('md-checkbox')[0].click()

        expect(element.find('md-checkbox')[0].classList).toContain('md-checked')
        expect(ngReduxMock.getActions()[0]).toContainActionData({settings: {showUnseenEntries: true}})
    })

    it('should update showEntryDetails setting', () => {
        element.find('md-checkbox')[1].click()

        expect(element.find('md-checkbox')[1].classList).not.toContain('md-checked')
        expect(ngReduxMock.getActions()[0]).toContainActionData({settings: {showEntryDetails: false}})
    })
})
