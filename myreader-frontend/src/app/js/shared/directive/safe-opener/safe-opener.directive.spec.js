describe('safeOpener', function() {

    var theWindow, element;

    beforeEach(require('angular').mock.module('myreader', function($provide) {
        $provide.provider(myMock.providerWithObj('$window', {
            open: function() {
                theWindow = {
                    opener: 'theOpener',
                    location: 'someUrl'
                };
                return theWindow;
            }
        }));
    }));

    beforeEach(inject(function ($compile, $rootScope) {
        element = $compile("<div my-safe-opener url='http//example.com/feed'></div>")($rootScope);
        element[0].click();
    }));

    it('should remove opener', function () {
        expect(theWindow.opener).toBeNull();
    });

    it('should set location', function () {
        expect(theWindow.location).toBe('http//example.com/feed');
    });
});
