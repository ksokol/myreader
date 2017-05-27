describe("test/filterTests.js", function() {
    var timeago;

    beforeEach(module('common.filters'));
    beforeEach(inject(function ($filter) {
        timeago = $filter('timeago');
    }));

    it('should return "sometime" for invalid date', function () {
        expect(timeago('')).toBe('sometime');
    });

    it('should return "sometime" for undefined date', function () {
        expect(timeago()).toBe('sometime');
    });

    it('should return "8 minutes ago" for given date', function () {
        var endDate = new Date();
        var startDate = new Date(endDate);
        var durationInMinutes = 5;
        startDate.setMinutes(endDate.getMinutes() - durationInMinutes);
        expect(timeago(startDate)).toBe('5 minutes ago');
    });
});
