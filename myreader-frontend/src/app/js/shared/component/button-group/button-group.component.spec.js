describe('button-group', function () {

    var component, button1, button2;

    beforeEach(require('angular').mock.module('myreader'));

    beforeEach(inject(function(_$componentController_) {
        component = _$componentController_('myButtonGroup');

        button1 = {
            enable: jasmine.createSpy('button1.enable()'),
            disable: jasmine.createSpy('button1.disable()')
        };

        button2 = {
            enable: jasmine.createSpy('button2.enable()'),
            disable: jasmine.createSpy('button2.disable()')
        };

        component.addButton(button1);
        component.addButton(button2);
    }));

    it('should have to buttons', function() {
        expect(component.buttons).toEqual([button1, button2])
    });

    it('should disable all buttons when disableButtons() called', function() {
        component.disableButtons();

        expect(button1.disable).toHaveBeenCalled();
        expect(button2.disable).toHaveBeenCalled();
    });

    it('should enable all buttons when enableButtons() called', function() {
        component.enableButtons();

        expect(button1.enable).toHaveBeenCalled();
        expect(button2.enable).toHaveBeenCalled();
    });

    it('should transclude content', inject(function ($compile, $rootScope) {
        var scope = $rootScope.$new();
        var element = $compile('<my-button-group><p>expected transclution</p></my-button-group>')(scope);
        scope.$digest();

        expect(element.find('p')[0].innerText).toEqual('expected transclution');
    }));
});
