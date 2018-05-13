import {mockNgRedux} from '../../../shared/test-utils'
import {tick} from "../../test-utils";

class Backdrop {

    constructor(host) {
        this.host = host
    }

    get el() {
        return this.host.querySelectorAll('div')[0]
    }

    get isMounted() {
        return this.el !== undefined
    }

    get isVisible() {
        return this.el.classList.contains('my-backdrop--visible')
    }

    get isClosing() {
        return this.el.classList.contains('my-backdrop--closing')
    }

    click() {
        this.el.click()
    }
}

describe('src/app/js/shared/component/backdrop/backdrop.component.spec.js', () => {

    let rootScope, scope, ngReduxMock, backdrop

    const givenState = ({backdropVisible = false}) => {
        ngReduxMock.setState({common: {backdropVisible}})
        scope.$digest()
    }

    beforeEach(angular.mock.module('myreader', mockNgRedux()))

    beforeEach(inject(($rootScope, $compile, $ngRedux) => {
        jest.useFakeTimers() // TODO Remove me together with patched setTimeout function in app.module.js.
        rootScope = $rootScope
        scope = $rootScope.$new(true)
        ngReduxMock = $ngRedux
        givenState({backdropVisible: false})

        const element = $compile('<my-backdrop></my-backdrop>')(scope)[0]
        scope.$digest()
        backdrop = new Backdrop(element)
    }))

    it('should not mount backdrop after initialization', () => {
        expect(backdrop.isMounted).toEqual(false)
    })

    it('should mount backdrop when state changes to true', () => {
        givenState({backdropVisible: true})

        expect(backdrop.isMounted).toEqual(true)
    })

    it('should not unmount backdrop instantly when state changes from true to false', () => {
        givenState({backdropVisible: true})
        givenState({backdropVisible: false})

        expect(backdrop.isMounted).toEqual(true)
    })

    it('should show backdrop when state is true', () => {
        givenState({backdropVisible: true})

        expect(backdrop.isVisible).toBe(true)
        expect(backdrop.isClosing).toEqual(false)
    })

    it('should mark backdrop as closing when state changes to false', () => {
        givenState({backdropVisible: true})
        givenState({backdropVisible: false})

        expect(backdrop.isVisible).toEqual(false)
        expect(backdrop.isClosing).toEqual(true)
    })

    it('should unmount backdrop when 300ms passed', () => {
        givenState({backdropVisible: true})
        givenState({backdropVisible: false})

        tick(299)
        scope.$digest()
        expect(backdrop.isMounted).toEqual(true)

        tick(1)
        scope.$digest()
        expect(backdrop.isMounted).toEqual(false)
    })

    it('should not unmount backdrop when state changed to true within 300ms', () => {
        givenState({backdropVisible: true})
        givenState({backdropVisible: false})
        tick(299)
        scope.$digest()

        givenState({backdropVisible: true})
        tick(1)
        scope.$digest()

        expect(backdrop.isMounted).toEqual(true)
    })

    it('should not hide backdrop when state changed to true within 300ms', () => {
        givenState({backdropVisible: true})
        givenState({backdropVisible: false})
        tick(299)
        scope.$digest()

        givenState({backdropVisible: true})
        tick(1)
        scope.$digest()

        expect(backdrop.isVisible).toEqual(true)
        expect(backdrop.isClosing).toEqual(false)
    })

    it('should show backdrop when state changed to true again', () => {
        givenState({backdropVisible: true})
        givenState({backdropVisible: false})

        tick(300)
        scope.$digest()

        givenState({backdropVisible: true})

        expect(backdrop.isMounted).toEqual(true)
        expect(backdrop.isVisible).toEqual(true)
        expect(backdrop.isClosing).toEqual(false)
    })

    it('should hide backdrop when clicked occurred on backdrop', () => {
        givenState({backdropVisible: true})
        backdrop.click()

        expect(ngReduxMock.getActionTypes()).toEqual(['HIDE_BACKDROP'])
    })
})
