import {reactComponent} from '../../../../shared/test-utils'

describe('src/app/js/shared/component/buttons/icon-button/icon-button.component.spec.js', () => {

    let icon

    beforeEach(() => {
        icon = reactComponent('Icon')
        angular.mock.module('myreader', icon)
    })

    it('should pass binding values to icon component', inject(($rootScope, $compile) => {
        const scope = $rootScope.$new(true)
        $compile(`<my-icon-button my-type="refresh" my-color="white"></my-icon-button>`)(scope)
        scope.$digest()

        expect(icon.bindings).toEqual({color: 'white', type: 'refresh'})
    }))
})
