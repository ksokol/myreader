import {componentMock, mockNgRedux, reactComponent} from '../shared/test-utils'

describe('src/app/js/subscription/subscription.component.spec.js', () => {

  let scope, element, ngReduxMock, subscription, autocompleteInput, mySubscriptionExclusion, title, url, confirmButton, saveButton

  beforeEach(() => {
    title = reactComponent('SubscriptionTitleInput')
    url = reactComponent('SubscriptionUrlInput')
    autocompleteInput = reactComponent('AutocompleteInput')
    mySubscriptionExclusion = componentMock('mySubscriptionExclusion')
    confirmButton = reactComponent('ConfirmButton')
    saveButton = reactComponent('Button')
    angular.mock.module('myreader', autocompleteInput, mySubscriptionExclusion, title, url, confirmButton, saveButton, mockNgRedux())
  })

  beforeEach(inject(($rootScope, $compile, $ngRedux) => {
    scope = $rootScope.$new(true)
    ngReduxMock = $ngRedux

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
    expect(autocompleteInput.bindings.value).toEqual('expected tag')
    expect(autocompleteInput.bindings.disabled).toBeUndefined()
    expect(autocompleteInput.bindings.values).toEqual(['t1', 't2'])
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

  xit('should save updated subscription', () => {
    title.bindings.onChange({target: {value: 'expected new title'}})
    saveButton.bindings.onClick()

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
    title.bindings.onChange({target: {value: 'expected new title'}})
    ngReduxMock.dispatch.mockResolvedValue()
    saveButton.bindings.onClick()

    expect(title.bindings.value).toEqual('expected new title')
  })

  it('should show validation message when validation failed', done => {
    jest.useRealTimers()

    const fieldErrors = [{field: 'title', message: 'expected validation message'}, {
      field: 'other',
      message: 'validation message'
    }]
    ngReduxMock.dispatch.mockRejectedValueOnce({status: 400, data: {fieldErrors}})

    title.bindings.onChange({target: {value: 'some title'}})
    saveButton.bindings.onClick()

    setTimeout(() => {
      scope.$digest()
      expect(title.bindings.validations).toEqual(fieldErrors)
      done()
    })
  })

  it('should not show validation message when request failed', done => {
    jest.useRealTimers()
    ngReduxMock.dispatch.mockRejectedValueOnce({status: 500})

    title.bindings.onChange({target: {value: 'some title'}})
    saveButton.bindings.onClick()

    setTimeout(() => {
      scope.$digest()
      expect(title.bindings.validations).toEqual([])
      done()
    })
  })

  it('should propagate updated subscription tag', () => {
    autocompleteInput.bindings.onSelect('expected value')

    expect(autocompleteInput.bindings.value).toEqual('expected value')
  })

  it('should propagate removed subscription tag', () => {
    autocompleteInput.bindings.onSelect(null)

    expect(autocompleteInput.bindings.value).toEqual(null)
  })

  it('should show notification message when action failed in subscription exclusion panel component', () => {
    mySubscriptionExclusion.bindings.myOnError({error: 'expected error'})
    scope.$digest()

    expect(ngReduxMock.getActionTypes()).toEqual(['SHOW_NOTIFICATION'])
    expect(ngReduxMock.getActions()[0]).toContainActionData({notification: {text: 'expected error', type: 'error'}})
  })

  xit('should navigate to subscription overview page when remove succeeded', () => {
    confirmButton.bindings.onClick()

    expect(ngReduxMock.getActionTypes()).toEqual(['DELETE_SUBSCRIPTION', 'ROUTE_CHANGED'])
    expect(ngReduxMock.getActions()[0].url).toContain('expected uuid')
    expect(ngReduxMock.getActions()[1].route).toEqual(['app', 'subscriptions'])
  })

  it('should disable page elements while ajax call is pending', () => {
    ngReduxMock.dispatch.mockReturnValueOnce(new Promise(() => {}))

    saveButton.bindings.onClick()

    setTimeout(() => {
      expect(title.bindings.disabled).toEqual(true)
      expect(url.bindings.disabled).toEqual(true)
      expect(autocompleteInput.bindings.disabled).toEqual(true)
      expect(mySubscriptionExclusion.bindings.myDisabled).toEqual(true)
    })
  })

  it('should enable page elements as soon as ajax call finished', done => {
    jest.useRealTimers()
    ngReduxMock.dispatch.mockResolvedValueOnce({uuid: ''})

    saveButton.bindings.onClick()

    setTimeout(() => {
      scope.$digest()

      expect(title.bindings.disabled).toEqual(false)
      expect(url.bindings.disabled).toEqual(true)
      expect(autocompleteInput.bindings.disabled).toEqual(false)
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
