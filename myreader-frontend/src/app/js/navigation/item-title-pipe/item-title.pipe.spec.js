describe("src/app/js/navigation/item-title-pipe/item-title.pipe.spec.js", function() {
    var tenCharacters = 'abcdefghij';
    var navigationItemTitle;

    beforeEach(require('angular').mock.module('myreader'));

    beforeEach(inject(function ($filter) {
        navigationItemTitle = $filter('myNavigationItemTitle');
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

    it('should truncate title after 32 characters when unseen count unavailable', function () {
        var longTitle = tenCharacters + tenCharacters + tenCharacters + tenCharacters;
        var expected  = tenCharacters + tenCharacters + tenCharacters + 'ab...';

        expect(navigationItemTitle({title: longTitle, unseen: 0})).toBe(expected);
    });

    it('should truncate title after 29 characters when unseen count is available', function () {
        var longTitle = tenCharacters + tenCharacters + tenCharacters + tenCharacters;
        var expected  = tenCharacters + tenCharacters + 'abcdefghi... (1)';

        expect(navigationItemTitle({title: longTitle, unseen: 1})).toBe(expected);
    });
});
