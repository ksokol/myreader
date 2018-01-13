import {mock} from '../../../shared/test-utils'

describe('src/app/js/subscription/subscription-exclusion-panel/subscription-exclusion/subscription-exclusion.component.spec.js', () => {

    beforeEach(angular.mock.module('myreader', mock('exclusionService')))

    describe('with html', () => {

        let compile, scope, q, findDeferred, myOnError, exclusionService, exclusions

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
                    findDeferred.resolve(exclusions)
                    scope.$digest()
                    return this
                },
                initExclusionsFailed: function (value) {
                    findDeferred.reject(value)
                    scope.$digest()
                    return this
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

        beforeEach(inject(($rootScope, $compile, $q, _exclusionService_) => {
            compile = $compile
            q = $q

            exclusionService = _exclusionService_
            exclusionService.find = jasmine.createSpy('exclusionService.find()')
            exclusionService.delete = jasmine.createSpy('exclusionService.delete()')
            exclusionService.save = jasmine.createSpy('exclusionService.save()')

            exclusions = [
                {uuid: '1', pattern: 'c', hitCount: 10},
                {uuid: '2', pattern: 'a', hitCount: 11},
                {uuid: '2', pattern: 'a', hitCount: 12},
                {uuid: '2', pattern: 'b', hitCount: 13}
            ]

            findDeferred = $q.defer()
            exclusionService.find.and.returnValue(findDeferred.promise)
            exclusionService.delete.and.returnValue($q.defer().promise)
            exclusionService.save.and.returnValue($q.defer().promise)

            scope = $rootScope.$new(true)
            scope.myOnError = myOnError = jasmine.createSpy('myOnError')
        }))

        describe('', () => {

            it('should set component into read only mode when myId is not set', () => {
                const page = new PageObject({}).initExclusions()

                expect(page.element().classList).toContain('md-readonly')
            })

            it('should set component into write mode when myId is set', () => {
                const page = new PageObject({'my-id': '1'}).initExclusions()

                expect(page.element().classList).not.toContain('md-readonly')
            })

            it('should set component into read only mode when myDisabled is set to true', () => {
                const page = new PageObject({'my-id': '1', 'my-disabled': true}).initExclusions()

                expect(page.element().classList).toContain('md-readonly')
            })

            it('should set component into write mode when myDisabled is set true', () => {
                const page = new PageObject({'my-id': '1', 'my-disabled': false}).initExclusions()

                expect(page.element().classList).not.toContain('md-readonly')
            })

            it('should show loading indicator', () => {
                const page = new PageObject({'my-id': '1'})

                expect(page.chips().length).toEqual(0)
                expect(page.loadingIndicator().innerText).toEqual('Loading exclusion patterns...')
            })

            it('should show component when initial loading finished', () => {
                const page = new PageObject({'my-id': '1'}).initExclusions()

                expect(page.chips().length).toEqual(1)
                expect(page.loadingIndicator()).toBeUndefined()
                expect(page.inputPlaceholderText()).toEqual('Enter an exclusion pattern')
            })

            it('should indicate pending delete', () => {
                const page = new PageObject({'my-id': '1'})
                    .initExclusions()
                    .removeExclusionAtPosition(1)

                expect(page.inputPlaceholderText()).toEqual('processing...')
            })

            it('should call exclusionService.find() on init', () => {
                new PageObject({'my-id': '1'}).initExclusions()

                expect(exclusionService.find).toHaveBeenCalledWith(1)
            })

            it('should emit onError event when initial loading failed', () => {
                new PageObject({'my-id': '1', 'my-on-error': 'myOnError(error)'})
                    .initExclusionsFailed('expected error')

                expect(myOnError).toHaveBeenCalledWith('expected error')
            })
        })

        describe('', () => {

            let page

            beforeEach(() => page = new PageObject({'my-id': '99', 'my-on-error': 'myOnError(error)'}).initExclusions())

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

            it('should indicate pending remove', () => {
                page.exclusions()[1].pendingRemove()

                expect(exclusionService.delete).toHaveBeenCalledWith(99, '2')
                expect(page.inputPlaceholderText()).toEqual('processing...')
            })

            it('should show default placeholder text in input element when remove finished', () => {
                page.exclusions()[1].successfulRemove()

                expect(page.inputPlaceholderText()).toEqual('Enter an exclusion pattern')
                expect(page.exclusions().length).toEqual(3)
            })

            it('should indicate failing remove', () => {
                page.exclusions()[1].failedRemove('expected error')

                expect(page.exclusions().length).toEqual(4)
                expect(page.inputPlaceholderText()).toEqual('Enter an exclusion pattern')
                expect(myOnError).toHaveBeenCalledWith('expected error')
            })

            it('should indicate pending save', () => {
                page.pendingInput('expected value')

                expect(exclusionService.save).toHaveBeenCalledWith(99, 'expected value')
                expect(page.inputPlaceholderText()).toEqual('processing...')
            })

            it('should show default placeholder text in input element when save finished', () => {
                page.successfulSave({uuid: 50, pattern: 'expected-from-service', hitCount: 0})

                expect(page.inputPlaceholderText()).toEqual('Enter an exclusion pattern')
            })

            it('should add new exclusion when save finished', () => {
                page.successfulSave({uuid: 50, pattern: 'expected-from-service', hitCount: 0})

                expect(page.exclusions().length).toEqual(5)
                expect(page.exclusions()[4].text()).toEqual('expected-from-service')
            })

            it('should indicate failing save', () => {
                page.failedSave('expected error')

                expect(page.exclusions().length).toEqual(4)
                expect(page.inputPlaceholderText()).toEqual('Enter an exclusion pattern')
                expect(myOnError).toHaveBeenCalledWith('expected error')
            })
        })
    })
})
