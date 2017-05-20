describe('notificationPanel', function () {

    beforeEach(require('angular').mock.module('myreader'));

    describe('controller', function () {

        var component, myOnDismiss;

        beforeEach(inject(function (_$componentController_) {
            myOnDismiss = jasmine.createSpy('myOnDismiss');
            component = _$componentController_('myNotificationPanel', null, { myOnDismiss: myOnDismiss });
        }));

        it('should not set type and message when currentValue has no type and message properties', function () {
            component.$onChanges({ myMessage: { currentValue: '' }});

            expect(component.type).toBeUndefined();
            expect(component.message).toBeUndefined();
        });

        it('should set type and message when currentValue has type and message properties', function () {
            component.$onChanges({ myMessage: { currentValue: { type: 'expected type', message: 'expected message' }}});

            expect(component.type).toEqual('expected type');
            expect(component.message).toEqual('expected message');
        });

        it('should reset type and message after a predefined amount of time', inject(function ($timeout) {
            component.$onChanges({ myMessage: { currentValue: { type: 'a', message: 'b' }}});

            $timeout.flush(4999);
            expect(component.type).toEqual('a');
            expect(component.message).toEqual('b');

            $timeout.flush(1);
            expect(component.type).toBeNull();
            expect(component.message).toBeNull();
        }));

        it('should call myOnDismiss after a predefined amount of time', inject(function ($timeout) {
            component.$onChanges({ myMessage: { currentValue: { type: 'a', message: 'b' }}});

            $timeout.flush(4999);
            expect(myOnDismiss).not.toHaveBeenCalled();

            $timeout.flush(1);
            expect(myOnDismiss).toHaveBeenCalled();
        }));

        it('should reset timeout when new type and message arrived', inject(function ($timeout) {
            component.$onChanges({ myMessage: { currentValue: { type: 'a', message: 'b' }}});

            $timeout.flush(4999);
            expect(component.type).toEqual('a');
            expect(component.message).toEqual('b');

            component.$onChanges({ myMessage: { currentValue: { type: 'c', message: 'd' }}});

            $timeout.flush(4999);
            expect(component.type).toEqual('c');
            expect(component.message).toEqual('d');

            $timeout.flush(1);
            expect(component.type).toBeNull();
            expect(component.message).toBeNull();
        }));

        it('should call myOnDismiss only once when new type and message arrived', inject(function ($timeout) {
            component.$onChanges({ myMessage: { currentValue: { type: 'a', message: 'b' }}});

            $timeout.flush(4999);
            expect(myOnDismiss).not.toHaveBeenCalled();

            component.$onChanges({ myMessage: { currentValue: { type: 'c', message: 'd' }}});

            $timeout.flush(4999);
            expect(myOnDismiss).not.toHaveBeenCalled();

            $timeout.flush(1);
            expect(myOnDismiss).toHaveBeenCalled();
        }));
    });

    describe('with html', function () {

        var scope, element, message, myOnDismiss;
        var aMessage = { type: 'success', message: 'expected message' };

        beforeEach(inject(function ($rootScope, $compile) {
            myOnDismiss = jasmine.createSpy('myOnDismiss');
            scope = $rootScope.$new();
            scope.message = aMessage;
            scope.onDismiss = myOnDismiss;

            element = $compile('<my-notification-panel my-message="message" my-on-dismiss="onDismiss()"></my-notification-panel>')(scope);
            scope.$digest();
        }));

        it('should hide notification when message is empty', function () {
            scope.message = {};
            scope.$digest();

            expect(element.find('div').children().length).toEqual(0);
        });

        it('should show notification when message is not empty', function () {
            expect(element.find('div').children().length).toBeGreaterThan(0);
        });

        it('should render message', function () {
            expect(element.find('span')[0].innerText).toEqual('expected message');
        });

        it('should append notification type to classList', function () {
            expect(element.find('div').children()[0].classList).toContain('my-notification-panel__message-success');
        });

        it('should hide notification when close icon clicked', function () {
            element.find('md-icon')[0].click();

            expect(element.find('div').children().length).toEqual(0);
        });

        it('should call myOnDismiss when close icon clicked', function () {
            element.find('md-icon')[0].click();

            expect(myOnDismiss).toHaveBeenCalled();
        });

        it('should hide notification after a predefined amount of time', inject(function ($timeout) {
            $timeout.flush(5000);

            expect(element.find('div').children().length).toEqual(0);
        }));
    });
});
