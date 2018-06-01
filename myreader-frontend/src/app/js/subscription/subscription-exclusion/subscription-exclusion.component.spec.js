import {mockNgRedux} from '../../shared/test-utils'
import ReactTestUtils from 'react-dom/test-utils'

describe('src/app/js/subscription/subscription-exclusion/subscription-exclusion.component.spec.js', () => {

    let page, scope, myOnError, ngReduxMock, exclusions

    const ExclusionPageObject = (el, parent) => {

        const _pendingRemove = () => {
            const button = el.querySelectorAll('button')[0]
            ReactTestUtils.Simulate.click(button)
            scope.$digest()
        }

        return {
            text: () => el.querySelectorAll('strong')[0].textContent,
            hitCount: () => el.querySelectorAll('em')[0].textContent,
            removeButton: () => el.querySelectorAll('button')[0],
            pendingRemove: function() {
                ngReduxMock.dispatch.mockReturnValueOnce(new Promise(() => {}))
                scope.$digest()
                _pendingRemove()
                return {
                    whenStable: callback =>
                        setTimeout(() => {
                            scope.$digest()
                            callback(parent)
                        })
                }
            },
            successfulRemove: function () {
                ngReduxMock.dispatch.mockResolvedValueOnce()
                scope.$digest()
                _pendingRemove()
                return {
                    whenStable: callback =>
                        setTimeout(() => {
                            scope.$digest()
                            callback(parent)
                        })
                }
            },
            failedRemove: function (value) {
                ngReduxMock.dispatch.mockRejectedValueOnce(value)
                scope.$digest()
                _pendingRemove()
                return {
                    whenStable: callback =>
                        setTimeout(() => {
                            scope.$digest()
                            callback(parent)
                        })
                }
            }
        }
    }

    const PageObject = el => {

        const _input = value => {
            const input = el.querySelector('input')
            input.value = value
            input.dispatchEvent(new Event('input'))
            input.dispatchEvent(new KeyboardEvent('keyup', {keyCode: 13}))
            scope.$digest()
        }

        return {
            chips: function () {
                return el.find('my-chips')
            },
            exclusions: function () {
                const exclusionElements = el.querySelectorAll('my-chip')
                const exclusions = []
                for(let i=0; i < exclusionElements.length; i++) {
                    exclusions.push(new ExclusionPageObject(exclusionElements[i], this))
                }
                return exclusions
            },
            inputPlaceholderText: function () {
                return el.querySelector('input').attributes['placeholder'].value
            },
            removeExclusionAtPosition: function (index) {
                const button = el.querySelectorAll('my-chip')[index].querySelectorAll('button')[0]
                ReactTestUtils.Simulate.click(button)
                return this
            },
            pendingInput: function (value) {
                ngReduxMock.dispatch.mockReturnValueOnce(new Promise(() => {}))
                scope.$digest()
                _input(value)
                scope.$digest()
                return {
                    whenStable: callback =>
                        setTimeout(() => {
                            scope.$digest()
                            callback(this)
                        })
                }
            },
            successfulSave: function (value) {
                ngReduxMock.dispatch.mockResolvedValueOnce(value)
                scope.$digest()
                _input(value)
                return {
                    whenStable: callback =>
                        setTimeout(() => {
                            scope.$digest()
                            callback(this)
                        })
                }
            },
            failedSave: function (value) {
                ngReduxMock.dispatch.mockRejectedValueOnce(value)
                scope.$digest()
                _input(value)
                return {
                    whenStable: callback =>
                        setTimeout(() => {
                            scope.$digest()
                            callback(this)
                        })
                }
            }
        }
    }

    beforeEach(angular.mock.module('myreader', mockNgRedux()))

    beforeEach(inject(($rootScope, $compile, $ngRedux) => {
        jest.useRealTimers()
        ngReduxMock = $ngRedux

        exclusions = [
            {uuid: '2', pattern: 'a', hitCount: 11},
            {uuid: '3', pattern: 'a', hitCount: 12},
            {uuid: '4', pattern: 'b', hitCount: 13},
            {uuid: '1', pattern: 'c', hitCount: 10}
        ]

        scope = $rootScope.$new(true)
        scope.exclusions = exclusions
        scope.myOnError = myOnError = jest.fn()

        const element = $compile(`<my-subscription-exclusion
                                    my-id="1"
                                    my-disabled="disabled"
                                    my-on-error="myOnError(error)"
                                    my-exclusions="exclusions">
                                  </my-subscription-exclusion>`)(scope)[0]
        scope.$digest()
        page = new PageObject(element)
    }))

    it('should set component into read only mode when myDisabled is set to true', () => {
        scope.disabled = true
        scope.$digest()

        expect(page.exclusions()[0].removeButton()).toBeUndefined()
    })

    it('should set component into write mode when myDisabled is set true', () => {
        scope.disabled = false
        scope.$digest()

        expect(page.exclusions()[0].removeButton()).toBeDefined()
    })

    it('should show input placeholder', () => {
        expect(page.inputPlaceholderText()).toEqual('Enter an exclusion pattern')
    })

    it('should indicate pending delete', () => {
        ngReduxMock.dispatch.mockReturnValueOnce(new Promise(() => {}))
        page.removeExclusionAtPosition(1)
        expect(page.inputPlaceholderText()).toEqual('processing...')
    })

    it('should render ordered exclusions', () => {
        const exclusions = page.exclusions()
        expect(exclusions.length).toEqual(4)

        expect(exclusions[0].text()).toEqual('a')
        expect(exclusions[1].text()).toEqual('a')
        expect(exclusions[2].text()).toEqual('b')
        expect(exclusions[3].text()).toEqual('c')
    })

    it('should render exclusion hit count', () => {
        expect(page.exclusions()[0].hitCount()).toEqual('(11)')
    })

    it('should indicate pending remove', done => {
        page.exclusions()[1].pendingRemove().whenStable(page => {
            expect(ngReduxMock.dispatch).toHaveBeenCalledWith(expect.objectContaining({type: 'DELETE_SUBSCRIPTION_EXCLUSION_PATTERNS'}))
            expect(ngReduxMock.dispatch).toHaveBeenCalledWith(expect.objectContaining({url: '/myreader/api/2/exclusions/1/pattern/3'}))
            expect(page.inputPlaceholderText()).toEqual('processing...')
            done()
        })
    })

    it('should show default placeholder text in input element when remove finished', done => {
        page.exclusions()[1].successfulRemove().whenStable(page => {
            expect(page.inputPlaceholderText()).toEqual('Enter an exclusion pattern')
            done()
        })
    })

    it('should indicate failing remove', done => {
        page.exclusions()[1].failedRemove('expected error').whenStable(page => {
            expect(page.inputPlaceholderText()).toEqual('Enter an exclusion pattern')
            expect(myOnError).toHaveBeenCalledWith('expected error')
            done()
        })
    })

    it('should indicate pending save', done => {
        ngReduxMock.dispatch.mockReturnValueOnce(new Promise(() => {}))
        page.pendingInput('expected value').whenStable(page => {
            expect(page.inputPlaceholderText()).toEqual('processing...')
            done()
        })
    })

    it('should show default placeholder text in input element when save finished', done => {
        page.successfulSave('').whenStable(page => {
            expect(page.inputPlaceholderText()).toEqual('Enter an exclusion pattern')
            done()
        })
    })

    it('should add new exclusion when save finished', () => {
        page.successfulSave('expected pattern')

        expect(ngReduxMock.dispatch).toHaveBeenCalledWith(expect.objectContaining({type: 'POST_SUBSCRIPTION_EXCLUSION_PATTERN'}))
        expect(ngReduxMock.dispatch).toHaveBeenCalledWith(expect.objectContaining({url: '/myreader/api/2/exclusions/1/pattern'}))
        expect(ngReduxMock.dispatch).toHaveBeenCalledWith(expect.objectContaining({body: {pattern: 'expected pattern'}}))
    })

    it('should indicate failing save', done => {
        page.failedSave('expected error').whenStable(page => {
            expect(page.exclusions().length).toEqual(4)
            expect(page.inputPlaceholderText()).toEqual('Enter an exclusion pattern')
            expect(myOnError).toHaveBeenCalledWith('expected error')
            done()
        })
    })
})
