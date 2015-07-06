describe("navigationItemTitle filter", function() {
    var navigationItemTitle;

    beforeEach(module('common.filters'));
    beforeEach(inject(function ($filter) {
        navigationItemTitle = $filter('navigationItemTitle');
    }));

    it('should return empty string when undefined given', function () {
        expect(navigationItemTitle(undefined)).toBe("");
    });

    it('should return empty string when empty object given', function () {
        expect(navigationItemTitle({})).toBe("");
    });

    it('should return "a title"', function () {
        expect(navigationItemTitle({title: 'a title'})).toBe("a title");
    });

    it('should return "a title"', function () {
        expect(navigationItemTitle({title: 'a title', unseen: undefined})).toBe("a title");
    });

    it('should return "a title (1)"', function () {
        expect(navigationItemTitle({title: 'a title', unseen: 1})).toBe("a title (1)");
    });

    it('should return "a title"', function () {
        expect(navigationItemTitle({title: 'a title', unseen: 0})).toBe("a title");
    });
});
