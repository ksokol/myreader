import {ScrollIntoViewDirective} from "./scroll-into-view.directive";

describe('myreader-frontend/src/app/js/shared/directive/scroll-into-view/scroll-into-view.directive-spec.js', () => {

    let scope, element, attrs, watcher;

    beforeEach(() => {
        scope = {
            $watch: (watchExp, listener) => watcher = listener
        };
        element = [jasmine.createSpyObj('$element', ['scrollIntoView'])];
        attrs = {myScrollIntoView: null};

        ScrollIntoViewDirective().link(scope, element, attrs);
    });

    it('should scroll element into view when watcher expression becomes true', () => {
        watcher(true);
        expect(element[0].scrollIntoView).toHaveBeenCalledWith({block: 'start', behavior: 'smooth'});
    });

    it('should not scroll element into view when watcher expression becomes false', () => {
        watcher(false);
        expect(element[0].scrollIntoView).not.toHaveBeenCalledWith();
    });
});
