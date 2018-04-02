import {mockNgRedux} from 'shared/test-utils'

describe('src/app/js/shared/component/button/button.component.spec.js', () => {

    let scope, component, bindings, buttonGroupCtrl, myOnClick, ngReduxMock

    beforeEach(angular.mock.module('myreader', mockNgRedux()))

    beforeEach(() => {
        buttonGroupCtrl = jasmine.createSpyObj('buttonGroupCtrl', ['addButton', 'enableButtons', 'disableButtons'])

        myOnClick = jasmine.createSpy('myOnClick')

        bindings = {
            buttonGroupCtrl: buttonGroupCtrl,
            myButtonType: 'submit',
            myOnClick: myOnClick,
            myOnSuccess: jasmine.createSpy('myOnSuccess'),
            myOnError: jasmine.createSpy('myOnError')
        }
    })

    beforeEach(inject($ngRedux => ngReduxMock = $ngRedux))

    describe('without confirmation', () => {

        beforeEach(inject(_$componentController_ => {
            component = _$componentController_('myButton', null, bindings)
            component.$onInit()
        }))

        it('should register button in buttonGroupCtrl on init', () => {
            expect(buttonGroupCtrl.addButton).toHaveBeenCalledWith(component)
        })

        it('should disable and enable other buttons in same button group', inject($rootScope => {
            component.onClick()
            expect(buttonGroupCtrl.disableButtons).toHaveBeenCalled()
            $rootScope.$digest()
            expect(buttonGroupCtrl.enableButtons).toHaveBeenCalled()
        }))

        it('should enable other buttons in same button group when error occurred', inject(($rootScope, $q) => {
            const deferred = $q.defer()
            deferred.reject('expected error')
            myOnClick.and.returnValue(deferred.promise)

            component.onClick()
            $rootScope.$digest()

            expect(buttonGroupCtrl.enableButtons).toHaveBeenCalled()
        }))

        it('should use provided myButtonType value', () =>
            expect(component.myButtonType).toBe('submit'))
    })

    describe('with confirmation', () => {

        beforeEach(inject(_$componentController_ => {
            bindings.myConfirm = 'true'

            component = _$componentController_('myButton', null, bindings)
            component.$onInit()
        }))

        it('should register button in buttonGroupCtrl on init', () =>
            expect(buttonGroupCtrl.addButton).toHaveBeenCalledWith(component))

        it('should disable and enable other buttons in same button group', inject($rootScope => {
            component.onClick()
            expect(buttonGroupCtrl.disableButtons).toHaveBeenCalled()

            component.processOnClick()
            $rootScope.$digest()
            expect(buttonGroupCtrl.enableButtons).toHaveBeenCalled()
        }))

        it('should enable other buttons in same button group when error occurred', inject(($q, $timeout) => {
            const deferred = $q.defer()
            myOnClick.and.returnValue(deferred.promise)

            component.onClick()
            $timeout.flush(250)

            deferred.reject('expected error')
            component.reset()

            expect(buttonGroupCtrl.enableButtons).toHaveBeenCalled()
        }))

        it('should enable other buttons in same button group when cancelled', inject(($q, $timeout) => {
            component.onClick()
            $timeout.flush(250)

            component.reset()

            expect(buttonGroupCtrl.enableButtons).toHaveBeenCalled()
        }))
    })

    describe('with html', () => {

        let Page
        const withoutConfirmation = false
        const withConfirmation = true

        const Button = button => {
            return {
                click: () => button.click(),
                title: () => button.innerText.trim(),
                disabled: () => button.disabled,
                classes: () => button.classList,
                type: () => button.type
            }
        }

        beforeEach(inject(($rootScope, $compile, $q, $timeout) => {
            Page = myConfirm => {

                const expected = {
                    onClickFn: false,
                    onSuccessFn: false,
                    onErrorFn: false
                }

                const deferred = $q.defer()
                scope = $rootScope.$new(true)

                scope.buttonGroupCtrl = {}
                scope.disableButton = false

                scope.onClickFn = () => {
                    expected.onClickFn = true
                    return deferred.promise
                }

                scope.onSuccessFn = data => expected.onSuccessFn = data
                scope.onErrorFn = error => expected.onErrorFn = error


                const element = $compile(`<my-button-group>
                                            <my-button my-type="warn"
                                                       my-confirm="${myConfirm}"
                                                       my-disabled="disableButton"
                                                       my-on-click="onClickFn()"
                                                       my-on-success="onSuccessFn(data)"
                                                       my-on-error="onErrorFn(error)">Test
                                            </my-button>
                                          </my-button-group>`)(scope)

                scope.$digest()

                return {
                    disableButton: () => {
                        scope.disableButton = true
                        $rootScope.$digest()
                    },
                    button: () => new Button(element.find('button')[0]),
                    confirm: () => new Button(element.find('button')[0]),
                    cancel: () => new Button(element.find('button')[1]),
                    onClickSuccess: () => deferred.resolve('onClickSuccess'),
                    onClickError: () => deferred.reject('onClickError'),
                    onClickFn: () => expected.onClickFn,
                    onSuccessFn: () => expected.onSuccessFn,
                    onErrorFn: () => expected.onErrorFn,
                    wait: milliseconds => $timeout.flush(milliseconds)
                }
            }
        }))

        it('should set my-type and my-text', () => {
            const page = Page(withoutConfirmation)
            expect(page.button().classes()).toContain('md-warn')
            expect(page.button().type()).toContain('button')
            expect(page.button().title()).toEqual('Test')
        })

        it('should disable button', () => {
            const page = Page(withoutConfirmation)

            expect(page.button().disabled()).toEqual(false)
            page.disableButton()

            expect(page.button().disabled()).toEqual(true)
        })

        it('should call myOnClick function when button clicked', () => {
            const page = Page(withoutConfirmation)

            expect(page.onClickFn()).toEqual(false)
            page.button().click()
            expect(page.onClickFn()).toEqual(true)
        })

        it('should disable button when button clicked', () => {
            const page = Page(withoutConfirmation)

            expect(page.button().disabled()).toEqual(false)
            page.button().click()
            expect(page.button().disabled()).toEqual(true)
        })

        it('should disable button when at least one http request is pending', () => {
            const page = Page(withoutConfirmation)

            expect(page.button().disabled()).toEqual(false)
            ngReduxMock.setState({common: {pendingRequests: 1}})
            scope.$digest()
            expect(page.button().disabled()).toEqual(true)
        })

        it('should not call myOnClick when confirmation required', () => {
            const page = Page(withConfirmation)
            page.button().click()

            expect(page.onClickFn()).toEqual(false)
        })

        it('should show confirmation button', () => {
            const page = Page(withConfirmation)
            page.button().click()

            expect(page.confirm().title()).toEqual('Yes')
            expect(page.confirm().classes()).toContain('md-warn')
            expect(page.cancel().title()).toEqual('No')
        })

        it('should activate confirmation button after a predefined amount of time', () => {
            const page = Page(withConfirmation)
            page.button().click()

            expect(page.confirm().disabled()).toEqual(true)
            expect(page.cancel().disabled()).toEqual(true)

            page.wait(249)
            expect(page.confirm().disabled()).toEqual(true)
            expect(page.cancel().disabled()).toEqual(true)

            page.wait(1)
            expect(page.confirm().disabled()).toEqual(false)
            expect(page.cancel().disabled()).toEqual(false)
        })

        it('should show button again when cancelled', () => {
            const page = Page(withConfirmation)
            page.onClickSuccess()

            page.button().click()
            page.wait(250)
            page.cancel().click()

            expect(page.button().title()).toEqual('Test')
            expect(page.button().disabled()).toEqual(false)
        })

        it('should not call myOnClick, myOnSuccess or myOnError functions when cancelled', () => {
            const page = Page(withConfirmation)
            page.onClickSuccess()

            page.button().click()
            page.wait(250)
            page.cancel().click()

            expect(page.onClickFn()).toEqual(false)
            expect(page.onSuccessFn()).toEqual(false)
            expect(page.onErrorFn()).toEqual(false)
        })

        it('should show button again when confirmed button clicked', () => {
            const page = Page(withConfirmation)
            page.onClickSuccess()

            page.button().click()
            page.wait(250)
            page.confirm().click()

            expect(page.button().title()).toEqual('Test')
            expect(page.button().disabled()).toEqual(false)
        })

        it('should call myOnClick and myOnSuccess functions when confirmed', () => {
            const page = Page(withConfirmation)
            page.onClickSuccess()

            page.button().click()
            page.wait(250)
            page.confirm().click()

            expect(page.onClickFn()).toEqual(true)
            expect(page.onSuccessFn()).toEqual('onClickSuccess')
            expect(page.onErrorFn()).toEqual(false)
        })

        it('should show button again when error occurred', () => {
            const page = Page(withConfirmation)

            page.button().click()
            page.wait(250)
            page.onClickError()
            page.confirm().click()

            expect(page.button().title()).toEqual('Test')
            expect(page.button().disabled()).toEqual(false)
        })

        it('should call myOnError function when error occurred', () => {
            const page = Page(withConfirmation)

            page.button().click()
            page.wait(250)
            page.onClickError()
            page.confirm().click()

            expect(page.onSuccessFn()).toEqual(false)
            expect(page.onErrorFn()).toEqual('onClickError')
        })
    })
})
