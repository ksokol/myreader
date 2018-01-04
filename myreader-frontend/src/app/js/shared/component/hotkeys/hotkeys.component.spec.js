import * as Mousetrap from 'mousetrap'
import {onKey} from '../../test-utils'

const y = 89
const z = 90

describe('src/app/js/shared/component/hotkeys/hotkeys.component.spec.js', () => {

    let compile, scope, parentScope, element

    beforeEach(() => angular.mock.module('myreader'))

    beforeEach(inject(($rootScope, $compile) => {
        compile = $compile
        scope = $rootScope.$new(true)
        parentScope = $rootScope.$new(true)
        scope.parentScope = parentScope

        scope.onKeyPressY = jasmine.createSpy('onKeyPressY')

        scope.onKeyPressZ = function() {
            this.called = true
        }
        spyOn(scope, 'onKeyPressZ')
        scope.onKeyPressZ.and.callThrough()

        element = $compile(`<my-hotkeys my-bind-to="parentScope" 
                                        my-hotkeys="{'z': onKeyPressZ, 'y': onKeyPressY}">
                                        <p>expected transcluded content</p>
                            </my-hotkeys>`)(scope)
        scope.$digest()
    }))

    afterEach(() => Mousetrap.reset())

    it('should not thrown an error on initialization when bindings are undefined', () =>
        expect(() => compile(`<my-hotkeys></my-hotkeys>`)(scope)).not.toThrowError())

    it('should transclude content', () => {
        expect(element.find('p')[0].innerText).toEqual('expected transcluded content')
    })

    it('should call function in myBindTo context', () => {
        onKey('press', z)

        expect(parentScope.called).toEqual(true)
    })

    it('should call function mapped to "z" key', () => {
        onKey('press', z)

        expect(scope.onKeyPressZ).toHaveBeenCalledWith()
        expect(scope.onKeyPressY).not.toHaveBeenCalledWith()
    })

    it('should call function mapped to "y" key', () => {
        onKey('press', y)

        expect(scope.onKeyPressZ).not.toHaveBeenCalledWith()
        expect(scope.onKeyPressY).toHaveBeenCalledWith()
    })

    it('should unbind hotkeys on destroy', () => {
        scope.$emit('$destroy')

        onKey('press', z)
        onKey('press', y)

        expect(scope.onKeyPressZ).not.toHaveBeenCalledWith()
        expect(scope.onKeyPressY).not.toHaveBeenCalledWith()
    })
})
