import {mockNgRedux} from '../shared/test-utils'

describe('src/app/js/settings/settings.component.spec.js', () => {

    let scope, element, $ngRedux

    beforeEach(angular.mock.module('myreader', mockNgRedux()))

    beforeEach(inject(($rootScope, $compile, _$ngRedux_) => {
        scope = $rootScope.$new()
        $ngRedux = _$ngRedux_

        $ngRedux.state = {
            settings: {
                pageSize: 20,
                showUnseenEntries: false,
                showEntryDetails: true
            }
        }

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

        expect($ngRedux.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({type: 'SETTINGS_UPDATE'}))
    })

    it('should update pageSize setting', ()=>  {
        element.find('md-select').triggerHandler('click')
        scope.$digest()

        const select = angular.element(angular.element(document).find('md-select-menu'))
        select.find('md-option')[2].click()
        scope.$digest()

        expect(select.find('md-option')[2].selected).toBe(true)
        expect(select.find('md-option')[2].innerText).toContain('30')
        expect($ngRedux.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({settings: jasmine.objectContaining({pageSize: 30})}))
    })

    it('should update showUnseenEntries setting', () => {
        element.find('md-checkbox')[0].click()

        expect(element.find('md-checkbox')[0].classList).toContain('md-checked')
        expect($ngRedux.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({settings: jasmine.objectContaining({showUnseenEntries: true})}))
    })

    it('should update showEntryDetails setting', () => {
        element.find('md-checkbox')[1].click()

        expect(element.find('md-checkbox')[1].classList).not.toContain('md-checked')
        expect($ngRedux.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({settings: jasmine.objectContaining({showEntryDetails: false})}))
    })
})
