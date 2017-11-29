import {mockNgRedux, ngReduxMock, spy} from '../../shared/test-utils';

describe('src/app/js/entry/entry-content/entry-content.component.spec.js', () => {

    describe('controller', () => {

        let component, $mdMedia, $ngRedux;

        beforeEach(angular.mock.module('myreader'));

        beforeEach(inject(_$componentController_ => {
            $ngRedux = ngReduxMock();
            $ngRedux.onConnect = {showEntryDetails: false};

            $mdMedia = jasmine.createSpy('$mdMedia');

            component = _$componentController_('myEntryContent', {$mdMedia: $mdMedia, $ngRedux: $ngRedux}, {});
            component.$onInit();
        }));

        it('should set default values on init', inject(_$componentController_ => {
            component = _$componentController_('myEntryContent');
            component.$onInit();

            expect(component.item).toEqual({});
            expect(component.show).toEqual(false);
        }));

        it('should set provided values on init', inject(_$componentController_ => {
            component = _$componentController_('myEntryContent', null, {myItem: 'expected', myShow: true});
            component.$onInit();

            expect(component.item).toEqual('expected');
            expect(component.show).toEqual(true);
        }));

        it('should not update show flag when myShow is undefined on $onChanges', () => {
            component.$onChanges({});

            expect(component.show).toEqual(false);
        });

        it('should update show flag when myShow is defined on $onChanges', () => {
            component.$onChanges({myShow: {currentValue: true}});

            expect(component.show).toEqual(true);
        });

        describe('showEntryContent()', () => {

            it('should query $mdMedia with "gt-md"', () => {
                component.showEntryContent();
                expect($mdMedia).toHaveBeenCalledWith('gt-md');
            });

            describe('with myShow set to false', function () {

                it('should return false when settingsService and $mdMedia return false', () => {
                    $ngRedux.stateChange({showEntryDetails: false});
                    $mdMedia.and.returnValue(false);
                    expect(component.showEntryContent()).toEqual(false);
                });

                it('should return false when settingsService return true and $mdMedia return false', () => {
                    $ngRedux.stateChange({showEntryDetails: true});
                    $mdMedia.and.returnValue(false);
                    expect(component.showEntryContent()).toEqual(false);
                });

                it('should return false when settingsService return false and $mdMedia return true', () => {
                    $ngRedux.stateChange({showEntryDetails: false});
                    $mdMedia.and.returnValue(true);
                    expect(component.showEntryContent()).toEqual(false);
                });

                it('should return true when settingsService return true and $mdMedia return true', () => {
                    $ngRedux.stateChange({showEntryDetails: true});
                    $mdMedia.and.returnValue(true);
                    expect(component.showEntryContent()).toEqual(true);
                });
            });

            describe('with myShow set to true', () => {

                beforeEach(inject(_$componentController_ => {
                    $ngRedux = ngReduxMock();
                    $ngRedux.onConnect = {showEntryDetails: true};

                    component = _$componentController_('myEntryContent', {$mdMedia: $mdMedia, $ngRedux: $ngRedux}, {myShow: true});
                    component.$onInit();
                }));

                it('should return true when settingsService and $mdMedia return false', () => {
                    $ngRedux.stateChange({showEntryDetails: false});
                    $mdMedia.and.returnValue(false);
                    expect(component.showEntryContent()).toEqual(true);
                });

                it('should return true when settingsService return true and $mdMedia return false', () => {
                    $ngRedux.stateChange({showEntryDetails: true});
                    $mdMedia.and.returnValue(false);
                    expect(component.showEntryContent()).toEqual(true);
                });

                it('should return true when settingsService return false and $mdMedia return true', () => {
                    $ngRedux.stateChange({showEntryDetails: false});
                    $mdMedia.and.returnValue(true);
                    expect(component.showEntryContent()).toEqual(true);
                });

                it('should return true when settingsService return true and $mdMedia return true', () => {
                    $ngRedux.stateChange({showEntryDetails: true});
                    $mdMedia.and.returnValue(true);
                    expect(component.showEntryContent()).toEqual(true);
                });
            });
        });
    });

    describe('with html', () => {

        let $mdMedia, $ngRedux, compile, scope, element;

        beforeEach(angular.mock.module('myreader', spy('$mdMedia'), mockNgRedux()));

        beforeEach(inject(($rootScope, $compile, _$mdMedia_, _$ngRedux_) => {
            compile = $compile;
            $mdMedia = _$mdMedia_;
            $ngRedux = _$ngRedux_;

            $ngRedux.onConnect = {showEntryDetails: true};

            scope = $rootScope.$new();
            scope.item = {
                content: 'entry content'
            };
            scope.show = true;
        }));

        it('should render entry content', () => {
            element = compile('<my-entry-content my-item="item" my-show="show"></my-entry-content>')(scope);
            scope.$digest();

            expect(element.find('div')[0].innerText).toEqual('entry content');
        });

        it('should render html encoded entry content', () => {
            scope.item.content = '&quot;entry content&quot;';
            element = compile('<my-entry-content my-item="item" my-show="show"></my-entry-content>')(scope);
            scope.$digest();

            expect(element.find('div')[0].innerText).toEqual('"entry content"');
        });

        it('should not render entry content when myShow is set to false', () => {
            $mdMedia.and.returnValue(false);

            scope.show = false;
            element = compile('<my-entry-content my-item="item" my-show="show"></my-entry-content>')(scope);
            scope.$digest();

            expect(element.find('div')[0]).toBeUndefined();
        });

        it('should contain myEntryContentSanitizer directive', () => {
            element = compile('<my-entry-content my-item="item" my-show="show"></my-entry-content>')(scope);
            scope.$digest();

            expect(element.children()[0].hasAttribute('my-entry-content-sanitizer')).toEqual(true);
        })
    });
});
