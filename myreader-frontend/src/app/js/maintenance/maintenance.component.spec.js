import {componentMock} from '../shared/test-utils'

describe('src/app/js/maintenance/maintenance.component.spec.js', () => {

    let element

    beforeEach(require('angular').mock.module('myreader', componentMock('myMaintenanceActions'), componentMock('myAbout')))

    beforeEach(inject(($rootScope, $compile) => {
        const scope = $rootScope.$new(true)
        element = $compile('<my-maintenance></my-maintenance>')(scope)[0]
        scope.$digest()
    }))

    it('should contain maintenance actions component', () => {
        expect(element.querySelector('my-maintenance-actions')).not.toBeNull()
    })

    it('should contain about component', () => {
        expect(element.querySelector('my-about')).not.toBeNull()
    })
})
