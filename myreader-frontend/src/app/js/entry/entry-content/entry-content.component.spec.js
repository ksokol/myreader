describe('src/app/js/entry/entry-content/entry-content.component.spec.js', function () {

    describe('controller', function () {

        var component, settingsService, $mdMedia;

        beforeEach(require('angular').mock.module('myreader'));

        beforeEach(inject(function (_$componentController_) {
            settingsService = jasmine.createSpyObj('settingsService', ['isShowEntryDetails']);
            $mdMedia = jasmine.createSpy('$mdMedia');

            component = _$componentController_('myEntryContent', { $mdMedia: $mdMedia, settingsService: settingsService }, {});
            component.$onInit();
        }));

        it('should set default values on init', inject(function (_$componentController_) {
            component = _$componentController_('myEntryContent');
            component.$onInit();

            expect(component.item).toEqual({});
            expect(component.show).toEqual(false);
        }));

        it('should set provided values on init', inject(function (_$componentController_) {
            component = _$componentController_('myEntryContent', null, {myItem: 'expected', myShow: true});
            component.$onInit();

            expect(component.item).toEqual('expected');
            expect(component.show).toEqual(true);
        }));

        it('should not update show flag when myShow is undefined on $onChanges', function () {
            component.$onChanges({});

            expect(component.show).toEqual(false);
        });

        it('should update show flag when myShow is defined on $onChanges', function () {
            component.$onChanges({ myShow: { currentValue: true }});

            expect(component.show).toEqual(true);
        });

        describe('showEntryContent()', function () {

            it('should query $mdMedia with "gt-md"', function () {
                component.showEntryContent();
                expect($mdMedia).toHaveBeenCalledWith('gt-md');
            });

            describe('with myShow set to false', function () {

                it('should return false when settingsService and $mdMedia return false', function () {
                    settingsService.isShowEntryDetails.and.returnValue(false);
                    $mdMedia.and.returnValue(false);
                    expect(component.showEntryContent()).toEqual(false);
                });

                it('should return false when settingsService return true and $mdMedia return false', function () {
                    settingsService.isShowEntryDetails.and.returnValue(true);
                    $mdMedia.and.returnValue(false);
                    expect(component.showEntryContent()).toEqual(false);
                });

                it('should return false when settingsService return false and $mdMedia return true', function () {
                    settingsService.isShowEntryDetails.and.returnValue(false);
                    $mdMedia.and.returnValue(true);
                    expect(component.showEntryContent()).toEqual(false);
                });

                it('should return true when settingsService return true and $mdMedia return true', function () {
                    settingsService.isShowEntryDetails.and.returnValue(true);
                    $mdMedia.and.returnValue(true);
                    expect(component.showEntryContent()).toEqual(true);
                });
            });

            describe('with myShow set to true', function () {

                beforeEach(inject(function (_$componentController_) {
                    component = _$componentController_('myEntryContent', { $mdMedia: $mdMedia, settingsService: settingsService }, { myShow: true });
                    component.$onInit();
                }));

                it('should return true when settingsService and $mdMedia return false', function () {
                    settingsService.isShowEntryDetails.and.returnValue(false);
                    $mdMedia.and.returnValue(false);
                    expect(component.showEntryContent()).toEqual(true);
                });

                it('should return true when settingsService return true and $mdMedia return false', function () {
                    settingsService.isShowEntryDetails.and.returnValue(true);
                    $mdMedia.and.returnValue(false);
                    expect(component.showEntryContent()).toEqual(true);
                });

                it('should return true when settingsService return false and $mdMedia return true', function () {
                    settingsService.isShowEntryDetails.and.returnValue(false);
                    $mdMedia.and.returnValue(true);
                    expect(component.showEntryContent()).toEqual(true);
                });

                it('should return true when settingsService return true and $mdMedia return true', function () {
                    settingsService.isShowEntryDetails.and.returnValue(true);
                    $mdMedia.and.returnValue(true);
                    expect(component.showEntryContent()).toEqual(true);
                });
            });
        });
    });

    describe('with html', function () {

        var settingsService, $mdMedia, compile, scope, element;

        beforeEach(require('angular').mock.module('myreader'));

        beforeEach(inject(function ($rootScope, $compile) {
            compile = $compile;
            settingsService = jasmine.createSpyObj('settingsService', ['isShowEntryDetails']);
            $mdMedia = jasmine.createSpy('$mdMedia');

            scope = $rootScope.$new();
            scope.item = {
                content: 'entry content'
            };
            scope.show = true;
        }));

        it('should render entry content', function () {
            element = compile('<my-entry-content my-item="item" my-show="show"></my-entry-content>')(scope);
            scope.$digest();

            expect(element.find('div')[0].innerText).toEqual('entry content');
        });

        it('should render html encoded entry content', function () {
            scope.item.content = '&quot;entry content&quot;';
            element = compile('<my-entry-content my-item="item" my-show="show"></my-entry-content>')(scope);
            scope.$digest();

            expect(element.find('div')[0].innerText).toEqual('"entry content"');
        });

        it('should not render entry content when myShow is set to false', function () {
            scope.show = false;
            element = compile('<my-entry-content my-item="item" my-show="show"></my-entry-content>')(scope);
            scope.$digest();

            expect(element.find('div')[0]).toBeUndefined();
        });
    });

    describe('with targetBlank filter', function () {

        var element;

        beforeEach(require('angular').mock.module('myreader', function($provide) {
            var targetBlankFilter = jasmine.createSpy('targetBlankFilter');
            targetBlankFilter.and.callFake(function (value) {
                return 'targetBlank("' + value + '")';
            });
            $provide.value('targetBlankFilter', targetBlankFilter);
        }));

        beforeEach(inject(function ($rootScope, $compile) {
            var settingsService = jasmine.createSpyObj('settingsService', ['isShowEntryDetails']);
            var $mdMedia = jasmine.createSpy('$mdMedia');
            var scope = $rootScope.$new();

            scope.item = {
                content: 'entry content'
            };
            scope.show = true;

            element = $compile('<my-entry-content my-item="item" my-show="show"></my-entry-content>')(scope);
            scope.$digest();
        }));

        it('should render entry content with targetBlank filter', function () {
            expect(element.find('div')[0].innerText).toEqual('targetBlank("entry content")');
        });
    });
});
