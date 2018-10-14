import {componentMock, mockNgRedux, reactComponent} from '../shared/test-utils'

describe('src/app/js/subscription/subscription.component.spec.js', () => {

  let scope, element, ngReduxMock, subscription, timeout, myAutocompleteInput, mySubscriptionExclusion, title, url

  beforeEach(() => {
    title = reactComponent('SubscriptionTitleInput')
    url = reactComponent('SubscriptionUrlInput')
    myAutocompleteInput = componentMock('myAutocompleteInput')
    mySubscriptionExclusion = componentMock('mySubscriptionExclusion')
    angular.mock.module('myreader', myAutocompleteInput, mySubscriptionExclusion, title, url, mockNgRedux())
  })

  beforeEach(inject(($rootScope, $compile, $ngRedux, $timeout) => {
    scope = $rootScope.$new(true)
    ngReduxMock = $ngRedux
    timeout = $timeout

    subscription = {
      uuid: 'expected uuid',
      title: 'expected title',
      origin: 'expected origin',
      feedTag: {
        uuid: '3',
        name: 'expected tag'
      }
    }

    ngReduxMock.setState({
      router: {query: {uuid: '1'}},
      subscription: {
        editForm: subscription,
        subscriptions: [{feedTag: {uuid: '1', name: 't1'}}, {feedTag: {uuid: '3', name: 't2'}}],
        exclusions: {'1': ['e1', '2']}
      }
    })

    element = $compile('<my-subscription></my-subscription>')(scope)[0]
    scope.$digest()
  }))

  it('should not render page when subscription with given uuid is not available in store', inject($compile => {
    ngReduxMock.setState({subscription: {editForm: null, subscriptions: [], exclusions: {}}})
    element = $compile('<my-subscription></my-subscription>')(scope)[0]
    scope.$digest()

    expect(element.querySelector('form')).toBeNull()
  }))

  it('should render page when subscription has been loaded', () => {
    expect(myAutocompleteInput.bindings.mySelectedItem).toEqual('expected tag')
    expect(myAutocompleteInput.bindings.myDisabled).toBeUndefined()
    expect(myAutocompleteInput.bindings.myValues).toEqual(['t1', 't2'])
    expect(mySubscriptionExclusion.bindings.myId).toEqual('expected uuid')
    expect(mySubscriptionExclusion.bindings.myDisabled).toBeUndefined()
    expect(mySubscriptionExclusion.bindings.myExclusions).toEqual(['e1', '2'])
  })

  it('should pass props to InputWithValidation component for title', () => {
    expect(title.bindings).toContainObject({
      disabled: undefined,
      label: 'Title',
      name: 'title',
      value: subscription.title,
      validations: []
    })
  })

  it('should pass props to Input component for origin', () => {
    expect(url.bindings).toContainObject({
      disabled: true,
      label: 'Url',
      name: 'origin',
      value: subscription.origin
    })
  })

  it('should save updated subscription', () => {
    title.bindings.onChange('expected new title')
    element.querySelectorAll('button')[0].click()

    expect(ngReduxMock.getActionTypes()).toEqual(['PATCH_SUBSCRIPTION'])
    expect(ngReduxMock.getActions()[0]).toContainActionData({
      body: {
        uuid: 'expected uuid',
        title: 'expected new title',
        origin: 'expected origin',
        feedTag: {
          name: 'expected tag'
        }
      }
    })
  })

  it('should update page when save completed', () => {
    title.bindings.onChange('expected new title')
    element.querySelectorAll('button')[0].click()

    expect(title.bindings.value).toEqual('expected new title')
  })

  it('should show validation message when validation failed', done => {
    jest.useRealTimers()

    const fieldErrors = [{field: 'title', message: 'expected validation message'}, {
      field: 'other',
      message: 'validation message'
    }]
    ngReduxMock.dispatch.mockRejectedValueOnce({status: 400, data: {fieldErrors}})

    title.bindings.onChange('some title')
    element.querySelectorAll('button')[0].click()

    setTimeout(() => {
      scope.$digest()
      expect(title.bindings.validations).toEqual(fieldErrors)
      done()
    })
  })

  it('should not show validation message when request failed', done => {
    jest.useRealTimers()
    ngReduxMock.dispatch.mockRejectedValueOnce({status: 500})

    title.bindings.onChange('some title')
    element.querySelectorAll('button')[0].click()

    setTimeout(() => {
      scope.$digest()
      expect(title.bindings.validations).toEqual([])
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
    ngReduxMock.dispatch.mockReturnValueOnce(new Promise(() => {
    }))

    element.querySelectorAll('button')[0].click()
    scope.$digest()

    expect(title.bindings.disabled).toEqual(true)
    expect(url.bindings.disabled).toEqual(true)
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

      expect(title.bindings.disabled).toEqual(false)
      expect(url.bindings.disabled).toEqual(true)
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
