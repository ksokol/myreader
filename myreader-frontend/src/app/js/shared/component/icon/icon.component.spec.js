describe('src/app/js/shared/component/icon/icon.component.spec.js', function () {

    var angular = require('angular');

    beforeEach(angular.mock.module('myreader'));

    describe('with html', function () {

        var scope, compile;

        beforeEach(inject(function ($rootScope, $compile) {
            compile = $compile;
            scope = $rootScope.$new();
        }));

        it('should render close icon', function () {
            var element = compile('<my-icon my-type="close"></my-icon>')(scope);
            scope.$digest();

            expect(element.find('md-icon')[0].classList).toContain('my-icon__icon--close');
        });

        it('should render icon with default color', function () {
            var element = compile('<my-icon my-type="close"></my-icon>')(scope);
            scope.$digest();

            expect(element.find('md-icon')[0].classList).toContain('my-icon__icon--grey');
        });

        it('should render icon with given color', function () {
            var element = compile('<my-icon my-color="white"></my-icon>')(scope);
            scope.$digest();

            expect(element.find('md-icon')[0].classList).toContain('my-icon__icon--white');
        });
    });
});
