describe('src/app/js/maintenance/about/about.component.spec.js', function () {

    describe('with html', function () {

        var Table = function (table) {
            return {
                rowValue: function (index) {
                    var tr = angular.element(table).find('tr')[index];
                    return angular.element(tr).find('td')[1].innerText;
                }
            }
        };

        var testUtils = require('../../shared/test-utils');

        var scope, element, deferred, aboutService, table;

        beforeEach(require('angular').mock.module('myreader', testUtils.mock('aboutService'), testUtils.filterMock('timeago')));

        beforeEach(inject(function ($rootScope, $compile, $q, _aboutService_) {
            scope = $rootScope.$new();

            deferred = $q.defer();

            aboutService = _aboutService_;
            aboutService.getProperties = jasmine.createSpy('aboutService.getProperties()');
            aboutService.getProperties.and.returnValue(deferred.promise);

            element = $compile('<my-about></my-about>')(scope);
            scope.$digest();
        }));

        it('should show loading indicator', function () {
            expect(element.find('p').text()).toEqual('loading...');
            expect(element.find('table').length).toEqual(0);
        });

        it('should show application build information', function () {
            deferred.resolve({
                branch: 'a-branch-name',
                commitId: 'aec45',
                version: '1.0',
                buildTime: 'time'
            });
            scope.$digest();

            expect(element.find('p').length).toEqual(0);

            table = new Table(element.find('table'));
            expect(table.rowValue(0)).toEqual('a-branch-name');
            expect(table.rowValue(1)).toEqual('aec45');
            expect(table.rowValue(2)).toEqual('1.0');
            expect(table.rowValue(3)).toEqual('timeago("time")');
        });

        it('should indicate missing properties', function () {
            deferred.reject();
            scope.$digest();

            expect(element.find('table').length).toEqual(0);
            expect(element.find('p').length).toEqual(1);
            expect(element.find('p').text()).toEqual('Properties missing');
        });
    });
});
