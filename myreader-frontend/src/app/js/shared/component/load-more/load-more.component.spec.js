describe('src/app/js/shared/component/load-more/load-more.component.spec.js', function () {

    beforeEach(require('angular').mock.module('myreader'));

    describe('with html', function () {

        var scope, element, myOnMore;

        beforeEach(inject(function ($rootScope, $compile) {
            myOnMore = jasmine.createSpy('myOnMore');
            scope = $rootScope.$new();
            scope.next = '/anUrl';
            scope.myOnMore = myOnMore;

            element = $compile('<my-load-more my-next="next" my-on-more="myOnMore(more)"></my-load-more>')(scope);
            scope.$digest();
        }));

        it('should not render element when myNext is undefined', function () {
            delete scope.next;
            scope.$digest();
            expect(element.find('button').length).toEqual(0);
        });

        it('should render element when myNext is defined', function () {
            scope.$digest();
            expect(element.find('button').length).toBe(1);
            expect( element.find('button')[0].disabled).toBe(false);
        });

        it('should propagate event when button clicked', function () {
            element.find('button')[0].click();
            scope.$digest();
            expect(myOnMore).toHaveBeenCalledWith('/anUrl');
        });

        it('should disable button when button clicked', function () {
            element.find('button')[0].click();
            scope.$digest();
            expect( element.find('button')[0].disabled).toBe(true);
        });

        it('should enable button when myNext updated', function () {
            element.find('button')[0].click();
            scope.$digest();
            scope.next = '/nextUrl';
            scope.$digest();

            expect( element.find('button')[0].disabled).toBe(false);
        });
    });
});
