import {removeNotification, showErrorNotification, showSuccessNotification} from './actions';

describe('src/app/js/store/common/actions.spec.js', () => {

    const currentState = {
        common: {
            notification: {
                nextId: 1
            }
        }
    };

    let dispatch;

    beforeEach(() => {
        dispatch = jasmine.createSpy('dispatch');
        jasmine.clock().install();
    });

    afterEach(() => jasmine.clock().uninstall());

    it('action removeNotification', () => {
        expect(removeNotification({id: 1})).toEqual({type: 'REMOVE_NOTIFICATION', id: 1});
    });

    it('action showSuccessNotification', () => {
        const expectedAction = {
            type: 'SHOW_NOTIFICATION',
            notification: {
                id: 1, text: 'expected text', type: 'success'
            }
        };

        showSuccessNotification('expected text')(dispatch, () => currentState);
        expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('action showSuccessNotification should dispatch removeNotification action after 3 seconds', () => {
        const expectedAction = {
            type: 'REMOVE_NOTIFICATION',
            id: 1
        };

        showSuccessNotification('expected text')(dispatch, () => currentState);
        jasmine.clock().tick(3000);

        expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('action showErrorNotification', () => {
        const expectedAction = {
            type: 'SHOW_NOTIFICATION',
            notification: {
                id: 1, text: 'expected text', type: 'error'
            }
        };

        showErrorNotification('expected text')(dispatch, () => currentState);
        expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('action showErrorNotification should dispatch removeNotification action after 3 seconds', () => {
        const expectedAction = {
            type: 'REMOVE_NOTIFICATION',
            id: 1
        };

        showErrorNotification('expected text')(dispatch, () => currentState);
        jasmine.clock().tick(3000);

        expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });
});
