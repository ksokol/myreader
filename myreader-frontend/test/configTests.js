describe('test/configTests.js', function() {

    var provider = undefined;

    beforeEach(angular.mock.module("myreader"));

    var withProvider = function(providerName) {
        beforeEach(function() {
            angular.mock.module([providerName, function ($provider) {
                provider = $provider;
            }]);
        });
        beforeEach(inject());
    };

    describe('hotkeysProvider', function() {
        withProvider("hotkeysProvider");

        describe('configuration property ', function() {
            it('includeCheatSheet ', function() {
                expect(provider.includeCheatSheet ).toBeFalsy();
            });

            it('useNgRoute ', function() {
                expect(provider.useNgRoute ).toBeFalsy();
            });
        });
    });
});
