import {mock, mockNgRedux} from '../../shared/test-utils';

describe('src/app/js/maintenance/maintenance-actions/maintenance-actions.component.spec.js', () => {

    const currentState = {
        common: {
            notification: {
                nextId: 1
            }
        }
    };

    let scope, element, ngRedux, processingService, deferred;

    beforeEach(angular.mock.module('myreader', mock('processingService'), mockNgRedux()));

    beforeEach(inject(($rootScope, $compile, $q, $ngRedux, _processingService_) => {
        scope = $rootScope.$new();
        ngRedux = $ngRedux;

        deferred = $q.defer();

        processingService = _processingService_;
        processingService.rebuildSearchIndex = jasmine.createSpy('processingService.rebuildSearchIndex()');
        processingService.rebuildSearchIndex.and.returnValue(deferred.promise);

        element = $compile('<my-maintenance-actions></my-maintenance-actions>')(scope);
        scope.$digest();
    }));

    it('should start indexing job when button clicked', () => {
        deferred.resolve();
        element.find('button')[0].click();
        scope.$digest();

        expect(processingService.rebuildSearchIndex).toHaveBeenCalledWith();
    });

    it('should show success message when indexing job started', () => {
        deferred.resolve();
        element.find('button')[0].click();
        scope.$digest();

        ngRedux.thunk(currentState);
        expect(ngRedux.dispatch).toHaveBeenCalledWith({type: 'SHOW_NOTIFICATION', notification: {id: 1, text: 'Refreshing index', type: 'success'}});
    });

    it('should show error message when indexing job failed', () => {
        deferred.reject('expected error');
        element.find('button')[0].click();
        scope.$digest();

        ngRedux.thunk(currentState);
        expect(ngRedux.dispatch).toHaveBeenCalledWith({type: 'SHOW_NOTIFICATION', notification: {id: 1, text: 'expected error', type: 'error'}});
    });
});
