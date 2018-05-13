import {mockNgRedux} from '../../test-utils'

describe('src/app/js/shared/component/toast/toast.component.spec.js', () => {

    let scope, element, compile, ngReduxMock

    const prepareState = () => {
        const notifications = [
            {id: 1, text: 'text1', type: 'success'},
            {id: 2, text: 'text2', type: 'success'},
            {id: 3, text: 'text3', type: 'error'},
            {id: 4, text: 'text4', type: 'success'}
        ]
        ngReduxMock.setState({
            common: {
                pendingRequests: 0,
                notification: {
                    nextId: 5,
                    notifications: [...notifications]
                }
            }
        })
    }

    function notification(index) {
        return notifications()[index]
    }

    function notifications() {
        return element.find('div').children()
    }

    beforeEach(angular.mock.module('myreader', mockNgRedux()))

    beforeEach(inject(($rootScope, $compile, $ngRedux) => {
        scope = $rootScope.$new()
        compile = $compile
        ngReduxMock = $ngRedux
    }))

    it('should not show any notifications', () => {
        element = compile('<my-toast></my-toast>')(scope)
        scope.$digest()

        expect(notifications().length).toEqual(0)
    })

    it('should show three notifications at most in reversed order', () => {
        prepareState()
        element = compile('<my-toast></my-toast>')(scope)
        scope.$digest()

        expect(notifications().length).toEqual(3)
        expect(notification(0).textContent.trim()).toEqual('text4')
        expect(notification(1).textContent.trim()).toEqual('text3')
        expect(notification(2).textContent.trim()).toEqual('text2')
    })

    it('should show success and error notifications', () => {
        prepareState()
        element = compile('<my-toast></my-toast>')(scope)
        scope.$digest()

        expect(notification(0).classList).not.toContain('my-my-notification__item--error')
        expect(notification(1).classList).toContain('my-notification__item--error')
        expect(notification(2).classList).not.toContain('my-my-notification__item--error')
    })

    it('should dispatch action REMOVE_NOTIFICATION when notification item clicked', () => {
        prepareState()
        element = compile('<my-toast></my-toast>')(scope)
        scope.$digest()

        notification(1).click()
        scope.$digest()

        expect(ngReduxMock.getActions()[0]).toContainObject({type: 'REMOVE_NOTIFICATION', id: 3})
    })
})
