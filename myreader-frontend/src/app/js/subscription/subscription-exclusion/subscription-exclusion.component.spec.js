describe('src/app/js/subscription/subscription-exclusion/subscription-exclusion.component.spec.js', function () {

    var testUtils = require('../../shared/test-utils');

    beforeEach(require('angular').mock.module('myreader', testUtils.mock('exclusionService')));

    describe('with html', function () {

        var compile, scope, q, findDeferred, myOnError, exclusionService, exclusions;

        var ExclusionPageObject = function (el) {

            var _pendingRemove = function () {
                angular.element(el).find('button')[0].click();
                scope.$digest();
            };

            return {
                text: function () {
                    return angular.element(el).find('strong')[0].innerText;
                },
                hitCount: function () {
                    return angular.element(el).find('em')[0].innerText
                },
                pendingRemove: function () {
                    _pendingRemove();
                },
                successfulRemove: function () {
                    var deferred = q.defer();
                    exclusionService.delete.and.returnValue(deferred.promise);
                    deferred.resolve();
                    _pendingRemove();
                    return this;
                },
                failedRemove: function (value) {
                    var deferred = q.defer();
                    exclusionService.delete.and.returnValue(deferred.promise);
                    deferred.reject(value);
                    _pendingRemove();
                    scope.$digest();
                    return this;
                }
            }
        };

        var PageObject = function (attributes) {

            var toComponentAttributes = function () {
                var attributesAsString = '';
                Object.keys(attributes).map(function (key) {
                    attributesAsString += ' ' + key + '="' + attributes[key] + '" ';
                });
                return attributesAsString;
            };

            var element = compile('<my-subscription-exclusion ' + toComponentAttributes() + '></my-subscription-exclusion>')(scope);
            scope.$digest();

            var _input = function (value) {
                element.find('input').val(value).triggerHandler('input');
                element.find('input').triggerHandler({ type: 'keydown', keyCode: 13 });
                scope.$digest();
            };

            return {
                element: function () {
                    return element.find('md-chips-wrap')[0];
                },
                initExclusions: function () {
                    findDeferred.resolve(exclusions);
                    scope.$digest();
                    return this;
                },
                initExclusionsFailed: function (value) {
                    findDeferred.reject(value);
                    scope.$digest();
                    return this;
                },
                chips: function () {
                    return element.find('md-chips');
                },
                exclusions: function () {
                    var exclusionElements = element.find('md-chip');
                    var exclusions = [];
                    for(var i=0; i < exclusionElements.length; i++) {
                        exclusions.push(new ExclusionPageObject(exclusionElements[i]));
                    }
                    return exclusions;
                },
                loadingIndicator: function () {
                    return element.find('p')[0];
                },
                inputPlaceholderText: function () {
                    return element.find('input').attr('placeholder');
                },
                removeExclusionAtPosition: function (index) {
                    angular.element(element.find('md-chip')[index]).find('button')[0].click();
                    return this;
                },
                pendingInput: function (value) {
                    _input(value);
                },
                successfulSave: function (value) {
                    var deferred = q.defer();
                    exclusionService.save.and.returnValue(deferred.promise);
                    deferred.resolve(value);
                    scope.$digest();
                    _input(value);
                },
                failedSave: function (value) {
                    var deferred = q.defer();
                    exclusionService.save.and.returnValue(deferred.promise);
                    deferred.reject(value);
                    scope.$digest();
                    _input(value);
                }
            }
        };

        beforeEach(inject(function ($rootScope, $compile, $q, _exclusionService_) {
            compile = $compile;
            q = $q;

            exclusionService = _exclusionService_;
            exclusionService.find = jasmine.createSpy('exclusionService.find()');
            exclusionService.delete = jasmine.createSpy('exclusionService.delete()');
            exclusionService.save = jasmine.createSpy('exclusionService.save()');

            exclusions = [
                { uuid: '1', pattern: 'c', hitCount: 10},
                { uuid: '2', pattern: 'a', hitCount: 11},
                { uuid: '2', pattern: 'a', hitCount: 12},
                { uuid: '2', pattern: 'b', hitCount: 13}
            ];

            findDeferred = $q.defer();
            exclusionService.find.and.returnValue(findDeferred.promise);
            exclusionService.delete.and.returnValue($q.defer().promise);
            exclusionService.save.and.returnValue($q.defer().promise);

            scope = $rootScope.$new();
            scope.myOnError = myOnError = jasmine.createSpy('myOnError');
        }));

        describe('', function () {

            it('should set component into read only mode when myId is not set', function () {
                var page = new PageObject({});

                expect(page.element().classList).toContain('md-readonly');
            });

            it('should set component into write mode when myId is set', function () {
                var page = new PageObject({ 'my-id': '1' }).initExclusions();

                expect(page.element().classList).not.toContain('md-readonly');
            });

            it('should set component into read only mode when myDisabled is set to true', function () {
                var page = new PageObject({ 'my-id': '1', 'my-disabled': true }).initExclusions();

                expect(page.element().classList).toContain('md-readonly');
            });

            it('should set component into write mode when myDisabled is set true', function () {
                var page = new PageObject({ 'my-id': '1', 'my-disabled': false }).initExclusions();

                expect(page.element().classList).not.toContain('md-readonly');
            });

            it('should show loading indicator', function () {
                var page = new PageObject({ 'my-id': '1' });

                expect(page.chips().length).toEqual(0);
                expect(page.loadingIndicator().innerText).toEqual('Loading exclusion patterns...');
            });

            it('should show component when initial loading finished', function () {
                var page = new PageObject({ 'my-id': '1' }).initExclusions();

                expect(page.chips().length).toEqual(1);
                expect(page.loadingIndicator()).toBeUndefined();
                expect(page.inputPlaceholderText()).toEqual('Enter an exclusion pattern');
            });

            it('should indicate pending delete', function () {
                var page = new PageObject({ 'my-id': '1' })
                    .initExclusions()
                    .removeExclusionAtPosition(1);

                expect(page.inputPlaceholderText()).toEqual('processing...');
            });

            it('should call exclusionService.find() on init', function () {
                new PageObject({ 'my-id': '1' }).initExclusions();

                expect(exclusionService.find).toHaveBeenCalledWith(1)
            });

            it('should emit onError event when initial loading failed', function () {
                new PageObject({ 'my-id': '1', 'my-on-error': 'myOnError(error)' })
                    .initExclusionsFailed('expected error');

                expect(myOnError).toHaveBeenCalledWith('expected error');
            });
        });

        describe('', function () {

            var page;

            beforeEach(function () {
                page = new PageObject({ 'my-id': '99', 'my-on-error': 'myOnError(error)' })
                    .initExclusions();
            });

            it('should render ordered exclusions', function () {
                var exclusions = page.exclusions();
                expect(exclusions.length).toEqual(4);

                expect(exclusions[0].text()).toEqual('a');
                expect(exclusions[1].text()).toEqual('a');
                expect(exclusions[2].text()).toEqual('b');
                expect(exclusions[3].text()).toEqual('c');
            });

            it('should render exclusion hit count', function () {
                expect(page.exclusions()[0].hitCount()).toEqual('(11)');
            });

            it('should indicate pending remove', function () {
                page.exclusions()[1].pendingRemove();

                expect(exclusionService.delete).toHaveBeenCalledWith(99, '2');
                expect(page.inputPlaceholderText()).toEqual('processing...');
            });

            it('should show default placeholder text in input element when remove finished', function () {
                page.exclusions()[1].successfulRemove();

                expect(page.inputPlaceholderText()).toEqual('Enter an exclusion pattern');
                expect(page.exclusions().length).toEqual(3);
            });

            it('should indicate failing remove', function () {
                page.exclusions()[1].failedRemove('expected error');

                expect(page.exclusions().length).toEqual(4);
                expect(page.inputPlaceholderText()).toEqual('Enter an exclusion pattern');
                expect(myOnError).toHaveBeenCalledWith('expected error');
            });

            it('should indicate pending save', function () {
                page.pendingInput('expected value');

                expect(exclusionService.save).toHaveBeenCalledWith(99, 'expected value');
                expect(page.inputPlaceholderText()).toEqual('processing...');
            });

            it('should show default placeholder text in input element when save finished', function () {
                page.successfulSave({ uuid: 50, pattern: 'expected-from-service', hitCount: 0});

                expect(page.inputPlaceholderText()).toEqual('Enter an exclusion pattern');
            });

            it('should add new exclusion when save finished', function () {
                page.successfulSave({ uuid: 50, pattern: 'expected-from-service', hitCount: 0});

                expect(page.exclusions().length).toEqual(5);
                expect(page.exclusions()[4].text()).toEqual('expected-from-service');
            });

            it('should indicate failing save', function () {
                page.failedSave('expected error');

                expect(page.exclusions().length).toEqual(4);
                expect(page.inputPlaceholderText()).toEqual('Enter an exclusion pattern');
                expect(myOnError).toHaveBeenCalledWith('expected error');
            });
        });
    });
});
