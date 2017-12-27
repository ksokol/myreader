import {mockNgRedux} from '../../shared/test-utils'

describe('src/app/js/navigation/logout-item/logout-item.component.spec.js', () => {

    let scope, element, ngRedux

    beforeEach(() => angular.mock.module('myreader', mockNgRedux()))

    beforeEach(inject(($rootScope, $compile, $ngRedux) => {
        scope = $rootScope.$new()
        ngRedux = $ngRedux

        element = $compile('<my-logout></my-logout>')(scope)
    }))

    it('should dispatch logout action on button click', () => {
        element.find('button')[0].click()
        scope.$digest()

        expect(ngRedux.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({type: 'POST_LOGOUT'}))
    })
})
