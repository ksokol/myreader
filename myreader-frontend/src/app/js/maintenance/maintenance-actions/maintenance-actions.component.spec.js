import {mockNgRedux} from '../../shared/test-utils'

describe('src/app/js/maintenance/maintenance-actions/maintenance-actions.component.spec.js', () => {

    let scope, element, ngReduxMock

    beforeEach(angular.mock.module('myreader', mockNgRedux()))

    beforeEach(inject(($rootScope, $compile, $ngRedux) => {
        scope = $rootScope.$new()
        ngReduxMock = $ngRedux

        element = $compile('<my-maintenance-actions></my-maintenance-actions>')(scope)
        scope.$digest()
    }))

    it('should dispatch action when button clicked', () => {
        element.find('button')[0].click()
        scope.$digest()

        expect(ngReduxMock.getActionTypes()).toEqual(['PUT_INDEX_SYNC_JOB'])
    })
})
