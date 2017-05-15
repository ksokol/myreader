describe('button', function () {

    var component, bindings, buttonGroupCtrl, myOnClick;

    beforeEach(require('angular').mock.module('myreader'));

    beforeEach(function () {
        buttonGroupCtrl = jasmine.createSpyObj('buttonGroupCtrl', ['addButton', 'enableButtons', 'disableButtons']);

        myOnClick = jasmine.createSpy('myOnClick');

        bindings = {
            buttonGroupCtrl: buttonGroupCtrl,
            myOnClick: myOnClick,
            myOnSuccess: jasmine.createSpy('myOnSuccess'),
            myOnError: jasmine.createSpy('myOnError')
        };
    });

    describe('without confirmation', function () {

        beforeEach(inject(function (_$componentController_) {
            component = _$componentController_('myButton', null, bindings);
            component.$onInit();
        }));

        it('should register button in buttonGroupCtrl on init', function () {
            expect(buttonGroupCtrl.addButton).toHaveBeenCalledWith(component);
        });

        it('should disable and enable other buttons in same button group', inject(function ($rootScope) {
            component.onClick();
            expect(buttonGroupCtrl.disableButtons).toHaveBeenCalled();
            $rootScope.$digest();
            expect(buttonGroupCtrl.enableButtons).toHaveBeenCalled();
        }));

        it('should enable other buttons in same button group when error occurred', inject(function ($rootScope, $q) {
            var deferred = $q.defer();
            deferred.reject('expected error');
            myOnClick.and.returnValue(deferred.promise);

            component.onClick();
            $rootScope.$digest();

            expect(buttonGroupCtrl.enableButtons).toHaveBeenCalled();
        }));
    });

    describe('with confirmation', function () {

        beforeEach(inject(function (_$componentController_) {
            bindings.myConfirm = 'true';

            component = _$componentController_('myButton', null, bindings);
            component.$onInit();
        }));

        it('should register button in buttonGroupCtrl on init', function () {
            expect(buttonGroupCtrl.addButton).toHaveBeenCalledWith(component);
        });

        it('should disable and enable other buttons in same button group', inject(function ($rootScope) {
            component.onClick();
            expect(buttonGroupCtrl.disableButtons).toHaveBeenCalled();

            component.processOnClick();
            $rootScope.$digest();
            expect(buttonGroupCtrl.enableButtons).toHaveBeenCalled();
        }));

        it('should enable other buttons in same button group when error occurred', inject(function ($q, $timeout) {
            var deferred = $q.defer();
            deferred.reject('expected error');
            myOnClick.and.returnValue(deferred.promise);

            component.onClick();
            $timeout.flush(250);

            component.reset();

            expect(buttonGroupCtrl.enableButtons).toHaveBeenCalled();
        }));

        it('should enable other buttons in same button group when cancelled', inject(function ($q, $timeout) {
            component.onClick();
            $timeout.flush(250);

            component.reset();

            expect(buttonGroupCtrl.enableButtons).toHaveBeenCalled();
        }));
    });

    describe('with html', function () {

        var Page;
        var withoutConfirmation = false;
        var withConfirmation = true;

        var Button = function (button) {
            return {
                click: function () {
                    button.click();
                },
                title: function () {
                    return button.innerText;
                },
                disabled: function () {
                    return button.disabled;
                },
                classes: function () {
                    return button.classList;
                }
            }
        };

        beforeEach(inject(function ($rootScope, $compile, $q, $timeout) {
            Page = function (myConfirm) {

                var expected = {
                    onClickFn: false,
                    onSuccessFn: false,
                    onErrorFn: false
                };

                var deferred = $q.defer();
                var scope = $rootScope.$new();

                scope.buttonGroupCtrl = {};

                scope.onClickFn = function () {
                    expected.onClickFn = true;
                    return deferred.promise;
                };

                scope.onSuccessFn = function (data) {
                    expected.onSuccessFn = data;
                };

                scope.onErrorFn = function (error) {
                    expected.onErrorFn = error;
                };

                scope.disableButton = false;

                var element = $compile('<my-button-group>' +
                    '                   <my-button my-type="warn" ' +
                    '                              my-text="Test" ' +
                    '                              my-confirm="' + myConfirm + '" ' +
                    '                              my-disabled="disableButton" ' +
                    '                              my-on-click="onClickFn()" ' +
                    '                              my-on-success="onSuccessFn(data)" ' +
                    '                              my-on-error="onErrorFn(error)">' +
                    '                   </my-button>' +
                    '                  </my-button-group>')(scope);

                scope.$digest();

                return {
                    disableButton: function() {
                        scope.disableButton = true;
                        $rootScope.$digest();
                    },
                    button: function () {
                        return new Button(element.find('button')[0]);
                    },
                    confirm: function () {
                        return new Button(element.find('button')[0]);
                    },
                    cancel: function () {
                        return new Button(element.find('button')[1]);
                    },
                    onClickSuccess: function () {
                        deferred.resolve('onClickSuccess');
                    },
                    onClickError: function () {
                        deferred.reject('onClickError');
                    },
                    onClickFn: function () {
                        return expected.onClickFn
                    },
                    onSuccessFn: function () {
                        return expected.onSuccessFn
                    },
                    onErrorFn: function () {
                        return expected.onErrorFn
                    },
                    wait: function (milliseconds) {
                        $timeout.flush(milliseconds);
                    }
                };
            };
        }));

        it('should throw error when required buttonGroupCtrl unavailable', inject(function ($rootScope, $compile) {
            expect(function () {
                return $compile('<my-button></my-button>')($rootScope.$new());
            }).toThrowError(/Controller 'myButtonGroup', required by directive 'myButton', can't be found!/);
        }));

        it('should set my-type and my-text', function () {
            var page = Page(withoutConfirmation);

            expect(page.button().classes()).toContain('md-warn');
            expect(page.button().title()).toEqual('Test');
        });

        it('blub', function () {
            var page = Page(withoutConfirmation);

            expect(page.button().disabled()).toEqual(false);
            page.disableButton();

            expect(page.button().disabled()).toEqual(true);
        });

        it('should call myOnClick function when button clicked', function () {
            var page = Page(withoutConfirmation);

            expect(page.onClickFn()).toEqual(false);
            page.button().click();
            expect(page.onClickFn()).toEqual(true);
        });

        it('should disable button when button clicked', function () {
            var page = Page(withoutConfirmation);

            expect(page.button().disabled()).toEqual(false);
            page.button().click();
            expect(page.button().disabled()).toEqual(true);
        });

        it('should not call myOnClick when confirmation required', function () {
            var page = Page(withConfirmation);
            page.button().click();

            expect(page.onClickFn()).toEqual(false);
        });

        it('should show confirmation button', function () {
            var page = Page(withConfirmation);
            page.button().click();

            expect(page.confirm().title()).toEqual('Yes');
            expect(page.confirm().classes()).toContain('md-warn');
            expect(page.cancel().title()).toEqual('No');
        });

        it('should activate confirmation button after a predefined amount of time', function () {
            var page = Page(withConfirmation);
            page.button().click();

            expect(page.confirm().disabled()).toEqual(true);
            expect(page.cancel().disabled()).toEqual(true);

            page.wait(249);
            expect(page.confirm().disabled()).toEqual(true);
            expect(page.cancel().disabled()).toEqual(true);

            page.wait(1);
            expect(page.confirm().disabled()).toEqual(false);
            expect(page.cancel().disabled()).toEqual(false);
        });

        it('should show button again when cancelled', function () {
            var page = Page(withConfirmation);
            page.onClickSuccess();

            page.button().click();
            page.wait(250);
            page.cancel().click();

            expect(page.button().title()).toEqual('Test');
            expect(page.button().disabled()).toEqual(false);
        });

        it('should not call myOnClick, myOnSuccess or myOnError functions when cancelled', function () {
            var page = Page(withConfirmation);
            page.onClickSuccess();

            page.button().click();
            page.wait(250);
            page.cancel().click();

            expect(page.onClickFn()).toEqual(false);
            expect(page.onSuccessFn()).toEqual(false);
            expect(page.onErrorFn()).toEqual(false);
        });

        it('should show button again when confirmed button clicked', function () {
            var page = Page(withConfirmation);
            page.onClickSuccess();

            page.button().click();
            page.wait(250);
            page.confirm().click();

            expect(page.button().title()).toEqual('Test');
            expect(page.button().disabled()).toEqual(false);
        });

        it('should call myOnClick and myOnSuccess functions when confirmed', function () {
            var page = Page(withConfirmation);
            page.onClickSuccess();

            page.button().click();
            page.wait(250);
            page.confirm().click();

            expect(page.onClickFn()).toEqual(true);
            expect(page.onSuccessFn()).toEqual('onClickSuccess');
            expect(page.onErrorFn()).toEqual(false);
        });

        it('should show button again when error occurred', function () {
            var page = Page(withConfirmation);
            page.onClickError();

            page.button().click();
            page.wait(250);
            page.confirm().click();

            expect(page.button().title()).toEqual('Test');
            expect(page.button().disabled()).toEqual(false);
        });

        it('should call myOnError function when error occurred', function () {
            var page = Page(withConfirmation);
            page.onClickError();

            page.button().click();
            page.wait(250);
            page.confirm().click();

            expect(page.onSuccessFn()).toEqual(false);
            expect(page.onErrorFn()).toEqual('onClickError');
        });
    });
});
