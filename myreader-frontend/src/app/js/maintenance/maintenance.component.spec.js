describe('src/app/js/maintenance/maintenance.component.spec.js', function () {

    describe('with html', function () {

        var testUtils = require('../shared/test-utils');

        var scope, element;

        beforeEach(require('angular')
            .mock.module('myreader',
                         testUtils.componentMock('myMaintenanceActions'),
                         testUtils.componentMock('myAbout'))
            );

        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope.$new();
            element = $compile('<my-maintenance></my-maintenance>')(scope);
            scope.$digest();
        }));

        it('should contain maintenance actions component', function () {
            expect(element.find('my-maintenance-actions').length).toEqual(1);
        });

        it('should contain about component', function () {
            expect(element.find('my-about').length).toEqual(1);
        });
    });
});
