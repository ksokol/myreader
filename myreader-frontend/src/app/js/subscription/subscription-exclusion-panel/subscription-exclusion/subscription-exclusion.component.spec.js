import {mock, mockNgRedux} from '../../../shared/test-utils'

describe('src/app/js/subscription/subscription-exclusion-panel/subscription-exclusion/subscription-exclusion.component.spec.js', () => {

    beforeEach(angular.mock.module('myreader', mock('exclusionService'), mockNgRedux()))

    beforeEach(() => jasmine.clock().uninstall())

    describe('with html', () => {

        let compile, scope, q, initDispatchResolve, initDispatchReject, myOnError, exclusionService, ngReduxMock, exclusions

        const ExclusionPageObject = el => {

            const _pendingRemove = () => {
                angular.element(el).find('button')[0].click()
                scope.$digest()
            }

            return {
                text: () => angular.element(el).find('strong')[0].innerText,
                hitCount: () => angular.element(el).find('em')[0].innerText,
                pendingRemove: () => _pendingRemove(),
                successfulRemove: function () {
                    const deferred = q.defer()
                    exclusionService.delete.and.returnValue(deferred.promise)
                    deferred.resolve()
                    _pendingRemove()
                    return this
                },
                failedRemove: function (value) {
                    const deferred = q.defer()
                    exclusionService.delete.and.returnValue(deferred.promise)
                    deferred.reject(value)
                    _pendingRemove()
                    scope.$digest()
                    return this
                }
            }
        }

        const PageObject = attributes => {

            const toComponentAttributes = () => {
                let attributesAsString = ''
                Object.keys(attributes).map(key => {
                    attributesAsString += ' ' + key + '="' + attributes[key] + '" '
                })
                return attributesAsString
            }

            const promise = new Promise((resolve, reject) => {
                initDispatchResolve = resolve
                initDispatchReject = reject
            })

            ngReduxMock.dispatch.and.returnValue(promise)

            const element = compile(`<my-subscription-exclusion ${toComponentAttributes()}></my-subscription-exclusion>`)(scope)
            scope.$digest()

            const _input = value => {
                element.find('input').val(value).triggerHandler('input')
                element.find('input').triggerHandler({type: 'keydown', keyCode: 13})
                scope.$digest()
            }

            return {
                element: () =>element.find('md-chips-wrap')[0],
                initExclusions: function () {
                    ngReduxMock.setState({subscription: {exclusions: {'1': exclusions}}})
                    initDispatchResolve()
                    scope.$digest()
                    return callback =>
                            setTimeout(() => {
                                scope.$digest()
                                callback(this)
                            }, 0)
                },
                initExclusionsFailed: function (value) {
                    initDispatchReject(value)
                    scope.$digest()
                    return callback =>
                        setTimeout(() => {
                            scope.$digest()
                            callback(this)
                        }, 0)
                },
                chips: function () {
                    return element.find('md-chips')
                },
                exclusions: function () {
                    const exclusionElements = element.find('md-chip')
                    const exclusions = []
                    for(let i=0; i < exclusionElements.length; i++) {
                        exclusions.push(new ExclusionPageObject(exclusionElements[i]))
                    }
                    return exclusions
                },
                loadingIndicator: function () {
                    return element.find('p')[0]
                },
                inputPlaceholderText: function () {
                    return element.find('input').attr('placeholder')
                },
                removeExclusionAtPosition: function (index) {
                    angular.element(element.find('md-chip')[index]).find('button')[0].click()
                    return this
                },
                pendingInput: function (value) {
                    _input(value)
                },
                successfulSave: function (value) {
                    const deferred = q.defer()
                    exclusionService.save.and.returnValue(deferred.promise)
                    deferred.resolve(value)
                    scope.$digest()
                    _input(value)
                },
                failedSave: function (value) {
                    const deferred = q.defer()
                    exclusionService.save.and.returnValue(deferred.promise)
                    deferred.reject(value)
                    scope.$digest()
                    _input(value)
                }
            }
        }

        beforeEach(inject(($rootScope, $compile, $q, _exclusionService_, $ngRedux) => {
            compile = $compile
            q = $q
            ngReduxMock = $ngRedux

            exclusionService = _exclusionService_
            exclusionService.delete = jasmine.createSpy('exclusionService.delete()')
            exclusionService.save = jasmine.createSpy('exclusionService.save()')

            exclusions = [
                {uuid: '2', pattern: 'a', hitCount: 11},
                {uuid: '3', pattern: 'a', hitCount: 12},
                {uuid: '4', pattern: 'b', hitCount: 13},
                {uuid: '1', pattern: 'c', hitCount: 10}
            ]

            exclusionService.delete.and.returnValue($q.defer().promise)
            exclusionService.save.and.returnValue($q.defer().promise)

            scope = $rootScope.$new(true)
            scope.myOnError = myOnError = jasmine.createSpy('myOnError')
        }))

        describe('', () => {

            it('should set component into read only mode when myId is not set', done => {
                const whenStable = new PageObject({}).initExclusions()

                whenStable(page => {
                    expect(page.element().classList).toContain('md-readonly')
                    done()
                })
            })

            it('should set component into write mode when myId is set', done => {
                const whenStable = new PageObject({'my-id': '1'}).initExclusions()

                whenStable(page => {
                    expect(page.element().classList).not.toContain('md-readonly')
                    done()
                })
            })

            it('should set component into read only mode when myDisabled is set to true', done => {
                const whenStable = new PageObject({'my-id': '1', 'my-disabled': true}).initExclusions()

                whenStable(page => {
                    expect(page.element().classList).toContain('md-readonly')
                    done()
                })
            })

            it('should set component into write mode when myDisabled is set true', done => {
                const whenStable = new PageObject({'my-id': '1', 'my-disabled': false}).initExclusions()

                whenStable(page => {
                    expect(page.element().classList).not.toContain('md-readonly')
                    done()
                })
            })

            it('should show loading indicator', () => {
                const page = new PageObject({'my-id': '1'})

                expect(page.chips().length).toEqual(0)
                expect(page.loadingIndicator().innerText).toEqual('Loading exclusion patterns...')
            })

            it('should show component when initial loading finished', done => {
                const whenStable = new PageObject({'my-id': '1'}).initExclusions()

                whenStable(page => {
                    expect(page.chips().length).toEqual(1)
                    expect(page.loadingIndicator()).toBeUndefined()
                    expect(page.inputPlaceholderText()).toEqual('Enter an exclusion pattern')
                    done()
                })
            })

            it('should indicate pending delete', done => {
                const whenStable = new PageObject({'my-id': '1'}).initExclusions()

                whenStable(page => {
                    page.removeExclusionAtPosition(1)
                    expect(page.inputPlaceholderText()).toEqual('processing...')
                    done()
                })
            })

            it('should fetch exclusions on initialization', () => {
                new PageObject({'my-id': '1'})

                expect(ngReduxMock.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({type: 'GET_SUBSCRIPTION_EXCLUSION_PATTERNS'}))
            })

            it('should emit onError event when initial loading failed', done => {
                const whenStable = new PageObject({'my-id': '1', 'my-on-error': 'myOnError(error)'}).initExclusionsFailed('expected error')

                whenStable(() => {
                    expect(myOnError).toHaveBeenCalledWith('expected error')
                    done()
                })
            })
        })

        describe('', () => {

            let whenStable

            beforeEach(() => whenStable = new PageObject({'my-id': '1', 'my-on-error': 'myOnError(error)'}).initExclusions())

            it('should render ordered exclusions', done => {
                whenStable(page => {
                    const exclusions = page.exclusions()
                    expect(exclusions.length).toEqual(4)

                    expect(exclusions[0].text()).toEqual('a')
                    expect(exclusions[1].text()).toEqual('a')
                    expect(exclusions[2].text()).toEqual('b')
                    expect(exclusions[3].text()).toEqual('c')
                    done()
                })
            })

            it('should render exclusion hit count', done => {
                whenStable(page => {
                    expect(page.exclusions()[0].hitCount()).toEqual('(11)')
                    done()
                })
            })

            it('should indicate pending remove', done => {
                whenStable(page => {
                    page.exclusions()[1].pendingRemove()

                    expect(exclusionService.delete).toHaveBeenCalledWith(1, '3')
                    expect(page.inputPlaceholderText()).toEqual('processing...')
                    done()
                })
            })

            it('should show default placeholder text in input element when remove finished', done => {
                whenStable(page => {
                    page.exclusions()[1].successfulRemove()

                    expect(page.inputPlaceholderText()).toEqual('Enter an exclusion pattern')
                    expect(page.exclusions().length).toEqual(3)
                    done()
                })
            })

            it('should indicate failing remove', done => {
                whenStable(page => {
                    page.exclusions()[1].failedRemove('expected error')

                    expect(page.exclusions().length).toEqual(4)
                    expect(page.inputPlaceholderText()).toEqual('Enter an exclusion pattern')
                    expect(myOnError).toHaveBeenCalledWith('expected error')
                    done()
                })
            })

            it('should indicate pending save', done => {
                whenStable(page => {
                    page.pendingInput('expected value')

                    expect(exclusionService.save).toHaveBeenCalledWith(1, 'expected value')
                    expect(page.inputPlaceholderText()).toEqual('processing...')
                    done()
                })
            })

            it('should show default placeholder text in input element when save finished', done => {
                whenStable(page => {
                    page.successfulSave({uuid: 50, pattern: 'expected-from-service', hitCount: 0})

                    expect(page.inputPlaceholderText()).toEqual('Enter an exclusion pattern')
                    done()
                })
            })

            it('should add new exclusion when save finished', done => {
                whenStable(page => {
                    page.successfulSave({uuid: 50, pattern: 'expected-from-service', hitCount: 0})

                    expect(page.exclusions().length).toEqual(5)
                    expect(page.exclusions()[4].text()).toEqual('expected-from-service')
                    done()
                })
            })

            it('should indicate failing save', done => {
                whenStable(page => {
                    page.failedSave('expected error')

                    expect(page.exclusions().length).toEqual(4)
                    expect(page.inputPlaceholderText()).toEqual('Enter an exclusion pattern')
                    expect(myOnError).toHaveBeenCalledWith('expected error')
                    done()
                })
            })
        })
    })
})
