import {componentMock, mockNgRedux} from '../shared/test-utils'

describe('src/app/js/subscription/subscription.component.spec.js', () => {

    let scope, element, ngReduxMock, subscription, timeout, myAutocompleteInput, mySubscriptionExclusion

    beforeEach(() => {
        myAutocompleteInput = componentMock('myAutocompleteInput')
        mySubscriptionExclusion = componentMock('mySubscriptionExclusion')
        angular.mock.module('myreader', myAutocompleteInput, mySubscriptionExclusion, mockNgRedux())
    })

    beforeEach(inject(($rootScope, $compile, $ngRedux, $timeout) => {
        scope = $rootScope.$new(true)
        ngReduxMock = $ngRedux
        timeout = $timeout

        subscription = {
            uuid: 'expected uuid',
            title: 'expected title',
            origin: 'expected origin',
            tag: 'expected tag'
        }

        ngReduxMock.setState({
            router: {query: {uuid: '1'}},
            subscription: {
                editForm: subscription, tags: {items: ['t1', 't2']},
                exclusions: {'1': ['e1', '2']}
            }
        })

        element = $compile('<my-subscription></my-subscription>')(scope)[0]
        scope.$digest()
    }))

    it('should not render page when subscription with given uuid is not available in store', inject($compile => {
        ngReduxMock.setState({subscription: {editForm: null, tags: {items: []}, exclusions: {}}})
        element = $compile('<my-subscription></my-subscription>')(scope)[0]
        scope.$digest()

        expect(element.querySelector('form')).toBeNull()
    }))

    it('should render page when subscription has been loaded', () => {
        expect(element.querySelectorAll('input')[0].value).toEqual('expected title')
        expect(element.querySelectorAll('input')[1].value).toEqual('expected origin')
        expect(element.querySelectorAll('input')[1].disabled).toEqual(true)
        expect(myAutocompleteInput.bindings.mySelectedItem).toEqual('expected tag')
        expect(myAutocompleteInput.bindings.myDisabled).toBeUndefined()
        expect(myAutocompleteInput.bindings.myValues).toEqual(['t1', 't2'])
        expect(mySubscriptionExclusion.bindings.myId).toEqual('expected uuid')
        expect(mySubscriptionExclusion.bindings.myDisabled).toBeUndefined()
        expect(mySubscriptionExclusion.bindings.myExclusions).toEqual(['e1', '2'])
    })

    it('should save updated subscription', () => {
        element.querySelectorAll('input')[0].value = 'new title'
        element.querySelectorAll('input')[0].dispatchEvent(new Event('input'))
        element.querySelectorAll('button')[0].click()

        expect(ngReduxMock.getActionTypes()).toEqual(['PATCH_SUBSCRIPTION'])
        expect(ngReduxMock.getActions()[0])
            .toContainActionData({body: {uuid: 'expected uuid', title: 'new title', origin: 'expected origin', tag: 'expected tag'}})
    })

    it('should update page when save completed', () => {
        element.querySelectorAll('input')[0].value = 'expected new title'
        element.querySelectorAll('input')[0].dispatchEvent(new Event('input'))
        element.querySelectorAll('button')[0].click()

        expect(element.querySelectorAll('input')[0].value).toEqual('expected new title')
    })

    it('should show validation message when validation failed', done => {
        jest.useRealTimers()
        ngReduxMock.dispatch.mockRejectedValueOnce({status: 400, data: {fieldErrors: [{field: 'title', message: 'expected validation message'}]}})

        element.querySelectorAll('input')[0].value = 'new title'
        element.querySelectorAll('input')[0].dispatchEvent(new Event('input'))
        element.querySelectorAll('button')[0].click()

        setTimeout(() => {
            scope.$digest()
            expect(element.querySelectorAll('button')[0].disabled).toEqual(true)
            expect(element.querySelectorAll('my-validation-message > div')[0].textContent.trim()).toEqual('expected validation message')
            done()
        })
    })

    it('should not show validation message when request failed', done => {
        jest.useRealTimers()
        ngReduxMock.dispatch.mockRejectedValueOnce({status: 500})

        element.querySelectorAll('input')[0].value = 'new title'
        element.querySelectorAll('input')[0].dispatchEvent(new Event('input'))
        element.querySelectorAll('button')[0].click()

        setTimeout(() => {
            scope.$digest()
            expect(element.querySelectorAll('button')[0].disabled).toEqual(false)
            expect(element.querySelectorAll('my-validation-message > div')[0].textContent.trim()).toEqual('')
            done()
        })
    })

    it('should propagate updated subscription tag', () => {
        myAutocompleteInput.bindings.myOnSelect({value: 'expected value'})
        scope.$digest()

        expect(myAutocompleteInput.bindings.mySelectedItem).toEqual('expected value')
    })

    it('should propagate removed subscription tag', () => {
        myAutocompleteInput.bindings.myOnSelect({value: null})
        scope.$digest()

        expect(myAutocompleteInput.bindings.mySelectedItem).toEqual(null)
    })

    it('should show notification message when action failed in subscription exclusion panel component', () => {
        mySubscriptionExclusion.bindings.myOnError({error: 'expected error'})
        scope.$digest()

        expect(ngReduxMock.getActionTypes()).toEqual(['SHOW_NOTIFICATION'])
        expect(ngReduxMock.getActions()[0]).toContainActionData({notification: {text: 'expected error', type: 'error'}})
    })

    it('should navigate to subscription overview page when remove succeeded', () => {
        element.querySelectorAll('button')[1].click() //click delete
        timeout.flush(1000)
        element.querySelectorAll('button')[1].click() //confirm

        expect(ngReduxMock.getActionTypes()).toEqual(['DELETE_SUBSCRIPTION', 'ROUTE_CHANGED'])
        expect(ngReduxMock.getActions()[0].url).toContain('expected uuid')
        expect(ngReduxMock.getActions()[1].route).toEqual(['app', 'subscriptions'])
    })

    it('should disable page elements while ajax call is pending', () => {
        ngReduxMock.dispatch.mockReturnValueOnce(new Promise(() => {}))

        element.querySelectorAll('button')[0].click()
        scope.$digest()

        expect(element.querySelectorAll('input')[0].disabled).toEqual(true)
        expect(element.querySelectorAll('input')[1].disabled).toEqual(true)
        expect(myAutocompleteInput.bindings.myDisabled).toEqual(true)
        expect(mySubscriptionExclusion.bindings.myDisabled).toEqual(true)
    })

    it('should enable page elements as soon as ajax call finished', done => {
        jest.useRealTimers()
        ngReduxMock.dispatch.mockResolvedValueOnce({uuid: ''})

        element.querySelectorAll('button')[0].click() //click delete
        timeout.flush(1000)
        element.querySelectorAll('button')[0].click() //confirm

        setTimeout(() => {
            scope.$digest()

            expect(element.querySelectorAll('input')[0].disabled).toEqual(false)
            expect(element.querySelectorAll('input')[1].disabled).toEqual(true)
            expect(myAutocompleteInput.bindings.myDisabled).toEqual(false)
            expect(mySubscriptionExclusion.bindings.myDisabled).toEqual(false)
            done()
        })
    })

    it('should open url safely', () => {
        const a = element.querySelectorAll('a')[0]

        expect(a.attributes['ng-href'].value).toEqual('expected origin')
        expect(a.attributes['target'].value).toEqual('_blank')
        expect(a.attributes['rel'].value).toEqual('noopener noreferrer')
    })
})
