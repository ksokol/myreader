describe('src/app/js/entry/entry-tags/entry-tags.component.spec.js', function () {

    describe('controller', function () {

        var $componentController, component, myOnChange;

        beforeEach(require('angular').mock.module('myreader'));

        beforeEach(inject(function (_$componentController_) {
            $componentController = _$componentController_;
            myOnChange = jasmine.createSpy('myOnChange');
        }));

        it('should initialize with empty array', function () {
            component = $componentController('myEntryTags', null, {myItem: { tag: null }});
            component.$onInit();

            expect(component.tags).toEqual([]);
        });

        it('should initialize with given tags', function () {
            var tag = 'tag1,tag2 tag3, tag-tag';
            component = $componentController('myEntryTags', null, {myItem: { tag: tag }});
            component.$onInit();

            expect(component.tags).toEqual(['tag1', 'tag2', 'tag3', 'tag-tag']);
        });

        it('should trigger onChange event', function () {
            var bindings = {myItem: { tag: 'tag1 tag2' }, myOnChange: myOnChange};
            component = $componentController('myEntryTags', null, bindings);
            component.$onInit();

            component.onTagChange();

            expect(myOnChange).toHaveBeenCalledWith({ tag: 'tag1, tag2'});
        });
    });

    describe('with html', function () {

        var myOnChange, compile, scope, element;

        beforeEach(require('angular').mock.module('myreader'));

        beforeEach(inject(function ($rootScope, $compile) {
            compile = $compile;
            myOnChange = jasmine.createSpy('myOnChange');

            scope = $rootScope.$new();
            scope.item = {
                tag: 'tag1 tag2'
            };
            scope.show = true;
            scope.myOnChange = myOnChange;
        }));

        it('should show tags component when myShow is true', function () {
            element = compile('<my-entry-tags my-item="item" my-show="show"></my-entry-tags>')(scope);
            scope.$digest();

            expect(element.children().length).toBeGreaterThan(0);
        });

        it('should not show render tags component when myShow is false', function () {
            scope.show = false;
            element = compile('<my-entry-tags my-item="item" my-show="show"></my-entry-tags>')(scope);
            scope.$digest();

            expect(element.children().length).toEqual(0);
        });

        it('should render tags somehow', function () {
            element = compile('<my-entry-tags my-item="item" my-show="show"></my-entry-tags>')(scope);
            scope.$digest();

            expect(element.find('md-chip').length).toEqual(2);
        });

        it('should trigger onChange event when tag has been removed', function () {
            element = compile('<my-entry-tags my-item="item" my-show="show" my-on-change="myOnChange(tag)"></my-entry-tags>')(scope);
            scope.$digest();

            element.find('md-chip').find('button')[0].click();
            expect(myOnChange).toHaveBeenCalledWith('tag2');

            element.find('md-chip').find('button')[0].click();
            expect(myOnChange).toHaveBeenCalledWith('');
        });

        it('should trigger onChange event when tag has been added', function () {
            element = compile('<my-entry-tags my-item="item" my-show="show" my-on-change="myOnChange(tag)"></my-entry-tags>')(scope);
            scope.$digest();

            element.find('input').val('tag3').triggerHandler('input');
            element.find('input').triggerHandler({ type: 'keydown', keyCode: 13 });

            expect(myOnChange).toHaveBeenCalledWith('tag1, tag2, tag3');
        });
    });
});
