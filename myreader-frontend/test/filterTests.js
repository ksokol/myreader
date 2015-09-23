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

    it('should return empty string when text is null or undefined"', function () {
        expect(targetBlank(null)).toBe('');
        expect(targetBlank(undefined)).toBe('');
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

    it('should not modify given a tag without attribute href', function () {
        expect(targetBlank('<a>test</a>')).toBe('<a>test</a>');
    });

    it('should not modify given a tag with existing target attribute', function () {
        expect(targetBlank('test1 <a target="different" href="test">test</a> test2')).toBe('test1 <a target="different" href="test">test</a> test2');
    });
});

describe("htmlEntities filter", function() {
    var htmlEntities;

    beforeEach(module('common.filters'));
    beforeEach(inject(function ($filter) {
        htmlEntities = $filter('htmlEntities');
    }));

    it('should replace "&lt;" with "<"', function () {
        expect(htmlEntities('&lt;')).toBe('<');
    });

    it('should replace "&lt;" with "<"', function () {
        expect(htmlEntities()).toBe('');
    });
});

describe("timeago filter", function() {
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
