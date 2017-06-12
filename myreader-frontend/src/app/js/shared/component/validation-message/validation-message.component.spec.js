describe('src/app/js/shared/component/validation-message/validation-message.component.spec.js', function () {

    beforeEach(require('angular').mock.module('myreader'));

    describe('with html', function () {

        var scope, element;

        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope.$new();

            scope.control = {
                $pristine: false
            };

            element = $compile('<my-validation-message my-form-control="control"></my-validation-message>')(scope);
            scope.$digest();
        }));

        it('should hide validation messages when no error occurred', function () {
            var messages = element.children().find('div');

            expect(messages.length).toEqual(0);
        });

        it('should show one validation message', function () {
            scope.control.$error = { 'expected error': true };
            scope.$digest();

            var messages = element.children().find('div');

            expect(messages.length).toEqual(1);
            expect(messages[0].innerText).toEqual('expected error');
        });

        it('should show multiple validation messages', function () {
            scope.control.$error = { 'expected error1': true, 'expected error2': true };
            scope.$digest();

            var messages = element.children().find('div');

            expect(messages.length).toEqual(2);
            expect(messages[0].innerText).toEqual('expected error1');
            expect(messages[1].innerText).toEqual('expected error2');
        });

        it('should hide validation messages when control is pristine', function () {
            scope.control.$pristine = true;
            scope.control.$error = { 'expected error': true };
            scope.$digest();

            var messages = element.children().find('div');

            expect(messages.length).toEqual(0);
        });
    });
});
