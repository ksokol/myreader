import {componentMock} from 'shared/test-utils'

describe('src/app/js/shared/component/buttons/icon-button/icon-button.component.spec.js', () => {

    let myIcon

    beforeEach(() => {
        myIcon = componentMock('myIcon')
        angular.mock.module('myreader', myIcon)
    })

    it('should pass binding values to icon component', inject(($rootScope, $compile) => {
        const scope = $rootScope.$new(true)
        $compile(`<my-icon-button my-type="refresh" my-color="white"></my-icon-button>`)(scope)
        scope.$digest()

        expect(myIcon.bindings.myType).toEqual('refresh')
        expect(myIcon.bindings.myColor).toEqual('white')
    }))
})
