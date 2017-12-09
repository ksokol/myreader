import {mock, mockNgRedux} from '../../shared/test-utils'

describe('src/app/js/maintenance/maintenance-actions/maintenance-actions.component.spec.js', () => {

    let scope, element, ngRedux

    beforeEach(angular.mock.module('myreader', mock('processingService'), mockNgRedux()))

    beforeEach(inject(($rootScope, $compile, $ngRedux) => {
        scope = $rootScope.$new()
        ngRedux = $ngRedux

        element = $compile('<my-maintenance-actions></my-maintenance-actions>')(scope)
        scope.$digest()
    }))

    it('should dispatch action when button clicked', () => {
        element.find('button')[0].click()
        scope.$digest()

        expect(ngRedux.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({type: 'PUT'}))
    })
})
