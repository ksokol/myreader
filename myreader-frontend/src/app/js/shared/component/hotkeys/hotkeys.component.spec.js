import {onKey, tick} from 'shared/test-utils'

const enter = {key: 'Enter', keyCode: 13}
const down = {key: 'ArrowDown', keyCode: 40}
const up = {key: 'ArrowUp', keyCode: 38}
const a = {key: 'a', keyCode: 65}
const y = {key: 'y', keyCode: 89}
const z = {key: 'z', keyCode: 90}
const esc = {key: 'esc', keyCode: 27}

describe('src/app/js/shared/component/hotkeys/hotkeys.component.spec.js', () => {

    let compile, scope, parentScope, element

    beforeEach(() => angular.mock.module('myreader'))

    beforeEach(inject(($rootScope, $compile) => {
        compile = $compile
        scope = $rootScope.$new(true)
        parentScope = $rootScope.$new(true)
        scope.parentScope = parentScope

        scope.onKeyPressY = jasmine.createSpy('onKeyPressY')
        scope.onKeyPressEnter = jasmine.createSpy('onKeyPressEnter')
        scope.onKeyPressDown = jasmine.createSpy('onKeyPressDown')
        scope.onKeyPressUp = jasmine.createSpy('onKeyPressUp')
        scope.onKeyPressEsc = jasmine.createSpy('onKeyPressEsc')

        scope.onKeyPressZ = function() {
            this.called = true
        }
        spyOn(scope, 'onKeyPressZ')
        scope.onKeyPressZ.and.callThrough()

        element = $compile(`<my-hotkeys my-bind-to="parentScope" 
                                        my-hotkeys="{'z': onKeyPressZ, 'y': onKeyPressY, 'enter': onKeyPressEnter, 'down': onKeyPressDown, 'up': onKeyPressUp, 'esc': onKeyPressEsc}">
                                        <p>expected transcluded content</p>
                            </my-hotkeys>`)(scope)
        scope.$digest()
    }))

    it('should not thrown an error on initialization when bindings are undefined', () => {
        expect(() => compile(`<my-hotkeys></my-hotkeys>`)(scope)).not.toThrowError()
    })

    it('should transclude content', () => {
        expect(element.find('p')[0].innerText).toEqual('expected transcluded content')
    })

    it('should call function in myBindTo context', () => {
        onKey('down', z)
        tick()

        expect(parentScope.called).toEqual(true)
    })

    it('should call function mapped to "z" key', () => {
        onKey('down', z)
        tick()

        expect(scope.onKeyPressZ).toHaveBeenCalledWith()
        expect(scope.onKeyPressY).not.toHaveBeenCalledWith()
    })

    it('should call function mapped to "y" key', () => {
        onKey('down', y)
        tick()

        expect(scope.onKeyPressZ).not.toHaveBeenCalledWith()
        expect(scope.onKeyPressY).toHaveBeenCalledWith()
    })

    it('should unbind hotkeys on destroy', () => {
        scope.$emit('$destroy')

        onKey('down', z)
        tick()
        onKey('down', y)
        tick()

        expect(scope.onKeyPressZ).not.toHaveBeenCalledWith()
        expect(scope.onKeyPressY).not.toHaveBeenCalledWith()
    })

    it('should not call any mapped function when key is not registered', () => {
        onKey('down', a)
        tick()

        expect(scope.onKeyPressZ).not.toHaveBeenCalledWith()
        expect(scope.onKeyPressY).not.toHaveBeenCalledWith()
    })

    it('should call function mapped to "enter" key', () => {
        onKey('down', enter)
        tick()

        expect(scope.onKeyPressEnter).toHaveBeenCalledWith()
    })

    it('should call function mapped to "down" key', () => {
        onKey('down', down)
        tick()

        expect(scope.onKeyPressDown).toHaveBeenCalledWith()
    })

    it('should call function mapped to "up" key', () => {
        onKey('down', up)
        tick()

        expect(scope.onKeyPressUp).toHaveBeenCalledWith()
    })

    it('should call function mapped to "esc" key', () => {
        onKey('down', esc)
        tick()

        expect(scope.onKeyPressEsc).toHaveBeenCalledWith()
    })
})
