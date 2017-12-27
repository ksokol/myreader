import {componentMock, mock, mockNgRedux} from '../shared/test-utils'

describe('src/app/js/subscription/subscription.component.spec.js', () => {

    const currentState = {
        common: {
            pendingRequests: 0,
            notification: {
                nextId: 1
            }
        }
    }

    const mySubscriptionTagPanel = componentMock('mySubscriptionTagPanel')
    const mySubscriptionExclusionPanel = componentMock('mySubscriptionExclusionPanel')

    let scope, element, $state, $stateParams, ngRedux, subscriptionService, subscription, saveDeferred, removeDeferred

    beforeEach(angular.mock.module('myreader',
        mock('$state'),
        mock('$stateParams'),
        mock('subscriptionService'),
        mySubscriptionTagPanel,
        mySubscriptionExclusionPanel,
        mockNgRedux()
    ))

    beforeEach(inject(($rootScope, $compile, $q, _$state_, _$stateParams_, $ngRedux, _subscriptionService_) => {
        scope = $rootScope.$new()
        ngRedux = $ngRedux

        ngRedux.state = currentState

        subscription = {
            uuid: 'expected uuid',
            title: 'expected title',
            origin: 'expected origin',
            tag: 'expected tag'
        }

        saveDeferred = $q.defer()
        removeDeferred = $q.defer()
        const deferred = $q.defer()
        deferred.resolve(subscription)
        subscriptionService = _subscriptionService_
        subscriptionService.find = jasmine.createSpy('subscriptionService.find()')
        subscriptionService.save = jasmine.createSpy('subscriptionService.save()')
        subscriptionService.remove = jasmine.createSpy('subscriptionService.remove()')
        subscriptionService.find.and.returnValue(deferred.promise)
        subscriptionService.save.and.returnValue(saveDeferred.promise)
        subscriptionService.remove.and.returnValue(removeDeferred.promise)

        $state = _$state_
        $state.go = jasmine.createSpy('$state.go()')

        $stateParams = _$stateParams_
        $stateParams.uuid = subscription.uuid

        element = $compile('<my-subscription></my-subscription>')(scope)
        scope.$digest()
    }))

    it('should not render page when subscription has not yet been loaded', inject($compile => {
        delete $stateParams.uuid
        element = $compile('<my-subscription></my-subscription>')(scope)
        scope.$digest()

        expect(element.children().length).toEqual(0)
        expect(subscriptionService.find).toHaveBeenCalledWith('expected uuid')
    }))

    it('should render page when subscription has been loaded', () => {
        expect(element.find('input')[0].value).toEqual('expected title')
        expect(element.find('input')[1].value).toEqual('expected origin')
        expect(element.find('input')[1].disabled).toEqual(true)
        expect(mySubscriptionTagPanel.bindings.mySelectedItem).toEqual('expected tag')
        expect(mySubscriptionExclusionPanel.bindings.myId).toEqual('expected uuid')
        expect(mySubscriptionTagPanel.bindings.myDisabled).toBeUndefined()
        expect(mySubscriptionExclusionPanel.bindings.myDisabled).toBeUndefined()
    })

    it('should save updated subscription', () => {
        angular.element(element.find('input')[0]).val('new title').triggerHandler('input')
        element.find('button')[0].click()

        expect(subscriptionService.save)
            .toHaveBeenCalledWith({ uuid: 'expected uuid', title: 'new title', origin: 'expected origin', tag: 'expected tag' })
    })

    it('should update page when save completed', () => {
        saveDeferred.resolve({title: 'expected new title'})
        angular.element(element.find('input')[0]).val('new title').triggerHandler('input')
        element.find('button')[0].click()

        expect(element.find('input')[0].value).toEqual('expected new title')

        ngRedux.thunk(currentState)
        expect(ngRedux.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
            type: 'SHOW_NOTIFICATION',
            notification: jasmine.objectContaining({
                text: 'Subscription saved',
                type: 'success'
            })
        }))
    })

    it('should show notification message when save failed', () => {
        saveDeferred.reject({data: {status: 500, message: 'expected error'}})
        angular.element(element.find('input')[0]).val('new title').triggerHandler('input')
        element.find('button')[0].click()

        ngRedux.thunk(currentState)
        expect(ngRedux.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
            type: 'SHOW_NOTIFICATION',
            notification: jasmine.objectContaining({
                text: {data: {status:500, message: 'expected error'}},
                type: 'error'
            })
        }))
    })

    it('should show validation message when validation failed', () => {
        saveDeferred.reject({data: {status: 400, fieldErrors: [{field: 'title', message: 'expected validation message'}]}})
        angular.element(element.find('input')[0]).val('new title').triggerHandler('input')
        element.find('button')[0].click()

        expect(element.find('button')[0].disabled).toEqual(true)
        expect(element.find('my-validation-message').children().find('div')[0].innerText).toEqual('expected validation message')
    })

    it('should propagate updated subscription tag', () => {
        mySubscriptionTagPanel.bindings.myOnSelect({value: 'expected value'})
        scope.$digest()

        expect(mySubscriptionTagPanel.bindings.mySelectedItem).toEqual('expected value')
    })

    it('should propagate removed subscription tag', () => {
        mySubscriptionTagPanel.bindings.myOnClear()
        scope.$digest()

        expect(mySubscriptionTagPanel.bindings.mySelectedItem).toEqual(null)
    })

    it('should show notification message when action failed in subscription exclusion panel component', () => {
        mySubscriptionExclusionPanel.bindings.myOnError({error: 'expected error'})
        scope.$digest()

        ngRedux.thunk(currentState)
        expect(ngRedux.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
            type: 'SHOW_NOTIFICATION',
            notification: jasmine.objectContaining({
                text: 'expected error',
                type: 'error'
            })
        }))
    })

    it('should navigate to subscription overview page when remove succeeded', inject($timeout => {
        removeDeferred.resolve()
        element.find('button')[1].click() //click delete
        $timeout.flush(1000)
        element.find('button')[1].click() //confirm

        expect(subscriptionService.remove).toHaveBeenCalledWith('expected uuid')
        expect($state.go).toHaveBeenCalledWith('app.subscriptions')
    }))

    it('should disable page elements while ajax call is pending', () => {
        element.find('button')[0].click()
        scope.$digest()

        expect(element.find('input')[0].disabled).toEqual(true)
        expect(element.find('input')[1].disabled).toEqual(true)
        expect(mySubscriptionTagPanel.bindings.myDisabled).toEqual(true)
        expect(mySubscriptionExclusionPanel.bindings.myDisabled).toEqual(true)
    })

    it('should enable page elements as soon as ajax call finished', inject($timeout => {
        saveDeferred.resolve({uuid:''})
        element.find('button')[0].click() //click delete
        $timeout.flush(1000)
        element.find('button')[0].click() //confirm
        scope.$digest()

        expect(element.find('input')[0].disabled).toEqual(false)
        expect(element.find('input')[1].disabled).toEqual(true)
        expect(mySubscriptionTagPanel.bindings.myDisabled).toEqual(false)
        expect(mySubscriptionExclusionPanel.bindings.myDisabled).toEqual(false)
    }))

    it('should open url safely', () => {
        const a = element.find('a')[0]

        expect(a.attributes['href'].value).toEqual('expected origin')
        expect(a.attributes['target'].value).toEqual('_blank')
        expect(a.attributes['rel'].value).toEqual('noopener noreferrer')
    })
})
