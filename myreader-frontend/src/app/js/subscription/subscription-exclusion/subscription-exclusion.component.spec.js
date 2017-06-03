describe('src/app/js/subscription/subscription-exclusion/subscription-exclusion.component.spec.js', function () {

    beforeEach(require('angular').mock.module('myreader'));

    describe('controller', function () {

        var component;

        beforeEach(inject(function ($componentController) {
           component = $componentController('mySubscriptionExclusion', null, { myOnAdd: jasmine.createSpy('myOnAdd') });
        }));

        it('should not copy exclusions when currentValue is undefined', function () {
            component.$onChanges({ myExclusions: { currentValue: undefined }});

            expect(component.exclusions).toBeUndefined();
        });

        it('should copy exclusions', function () {
            var currentValue = [1, 2];
            component.$onChanges({ myExclusions: { currentValue: currentValue }});

            expect(component.exclusions).toEqual(currentValue);
            currentValue[2] = 3;

            expect(component.exclusions).toEqual([1, 2]);
        });
    });

    describe('with html', function () {

        var compile, scope, element, myOnAdd, myOnDelete;

        beforeEach(inject(function ($rootScope, $compile) {
            compile = $compile;
            myOnAdd = jasmine.createSpy('myOnAdd');
            myOnDelete = jasmine.createSpy('myOnDelete');

            scope = $rootScope.$new();
            scope.exclusions = [
                { uuid: '1', pattern: 'p1', hitCount: 10},
                { uuid: '2', pattern: 'p2', hitCount: 11}
            ];
            scope.show = true;
            scope.myOnAdd = myOnAdd;
            scope.myOnDelete = myOnDelete;

            element = compile('<my-subscription-exclusion ' +
                                'my-exclusions="exclusions" ' +
                                'my-on-add="myOnAdd(value)" ' +
                                'my-on-delete="myOnDelete(value)">' +
                              '</my-subscription-exclusion>')(scope);

            scope.$digest();
        }));

        it('should render exclusions', function () {
            expect(element.find('md-chip-template').length).toEqual(2);

            var first = angular.element(element.find('md-chip-template')[0]).find('strong')[0];
            var second = angular.element(element.find('md-chip-template')[1]).find('strong')[0];
            expect(first.innerText).toEqual('p1');
            expect(second.innerText).toEqual('p2');
        });

        it('should render exclusion hit count', function () {
            var first = angular.element(element.find('md-chip-template')[0]).find('em')[0];
            expect(first.innerText).toEqual('(10)');
        });

        it('should emit onDelete event', function () {
            angular.element(element.find('md-chip')[0]).find('button')[0].click();
            expect(myOnDelete).toHaveBeenCalledWith(jasmine.objectContaining(scope.exclusions[0]));
        });

        it('should emit onAdd event', function () {
            element.find('input').val('expected value').triggerHandler('input');
            element.find('input').triggerHandler({ type: 'keydown', keyCode: 13 });

            expect(myOnAdd).toHaveBeenCalledWith('expected value');
        });

        it('should not render new exclusion', function () {
            element.find('input').val('expected value').triggerHandler('input');
            element.find('input').triggerHandler({ type: 'keydown', keyCode: 13 });

            expect(element.find('md-chip-template').length).toEqual(2);

            var first = angular.element(element.find('md-chip-template')[0]).find('strong')[0];
            var second = angular.element(element.find('md-chip-template')[1]).find('strong')[0];
            expect(first.innerText).toEqual('p1');
            expect(second.innerText).toEqual('p2');
        });
    });
});
