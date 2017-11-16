describe('src/app/js/entry/entry-content/entry-content-sanitizer/entry-content-sanitizer.directive.spec.js', () => {

    let element;

    beforeEach(angular.mock.module('myreader'));

    beforeEach(inject(($compile, $rootScope, $timeout) => {
        element = $compile(`<div my-entry-content-sanitizer>
                                <p><a href='http://url1/'></a></p>
                                <span><a href='http://url2/'></a></span>
                            </div>`)($rootScope.$new());
        $timeout.flush(0);
    }));

    it('should open url1 safely', () => {
        const a = element.find('a')[0];
        a.click();

        expect(a.attributes['href'].value).toEqual('http://url1/');
        expect(a.attributes['target'].value).toEqual('_blank');
        expect(a.attributes['rel'].value).toEqual('noopener noreferrer');
    });

    it('should open url2 safely', () => {
        const a = element.find('a')[1];
        a.click();

        expect(a.attributes['href'].value).toEqual('http://url2/');
        expect(a.attributes['target'].value).toEqual('_blank');
        expect(a.attributes['rel'].value).toEqual('noopener noreferrer');
    });
});
