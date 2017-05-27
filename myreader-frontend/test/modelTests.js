describe('test/modelTests.js', function() {

    describe("Feeds", function() {
        var link = {
            rel: 'next',
            href: 'nextHref'
        };

        it('should return empty object', function () {
            var result = new Feeds(undefined, undefined);

            expect(result.feeds).toEqual([]);
            expect(result.links).toEqual([]);
        });

        it('should return converted object', function () {
            var result = new Feeds([1], [link]);

            expect(result.feeds).toEqual([1]);
            expect(result.links).toEqual([link]);
        });

        it('should return href for rel "next"', function () {
            var result = new Feeds([1], [link]);

            expect(result.next()).toEqual(link.href);
        });

        it('should return undefined href for rel not equal to "next"', function () {
            var clone = angular.copy(link).rel = 'irrelevant';
            var result = new Feeds([1], [clone]);

            expect(result.next()).toEqual(undefined);
        });
    });
});
