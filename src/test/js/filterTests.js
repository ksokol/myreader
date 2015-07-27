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

describe("targetBlank filter", function() {
    var targetBlank;

    beforeEach(module('common.filters'));
    beforeEach(inject(function ($filter) {
        targetBlank = $filter('targetBlank');
    }));

    it('should not modify given a tag with attribute target="_blank"', function () {
        expect(targetBlank(null)).toBe('');
    });

    it('should return all a tags with attribute target="_blank" added', function () {
        expect(targetBlank('<a href="test">test</a>')).toBe('<a target="_blank" href="test">test</a>');
    });

    it('should not modify given a tag with attribute target="_blank"', function () {
        expect(targetBlank('<a target="_blank" href="test">test</a>')).toBe('<a target="_blank" href="test">test</a>');
    });

    it('should not modify given text"', function () {
        expect(targetBlank('text without a tag')).toBe('text without a tag');
    });
});
