import {mockNgRedux, reactComponent} from '../../shared/test-utils'

describe('src/app/js/subscription/subscribe/subscribe.component.spec.js', () => {

  let scope, element, ngReduxMock, originInput, saveButton

  beforeEach(() => {
    originInput = reactComponent('SubscribeOriginInput')
    saveButton = reactComponent('Button')
    angular.mock.module('myreader', mockNgRedux(), originInput, saveButton)
  })

  beforeEach(inject(($rootScope, $compile, $ngRedux) => {
    scope = $rootScope.$new(true)
    ngReduxMock = $ngRedux

    element = $compile('<my-subscribe></my-subscribe>')(scope)[0]
    scope.$digest()
  }))

  it('should pass expected props to origin input component', () => {
    expect(originInput.bindings).toContainObject({
      type: 'url',
      label: 'Url',
      name: 'origin',
      value: ''
    })
  })

  it('should disable button when action is pending', done => {
    jest.useRealTimers()
    ngReduxMock.dispatch.mockReturnValueOnce(new Promise(() => {}))

    saveButton.bindings.onClick()

    setTimeout(() => {
      scope.$digest()
      expect(saveButton.bindings.disabled).toEqual(true)
      done()
    })
  })

  it('should dispatch save subscription action with given url', done => {
    jest.useRealTimers()

    ngReduxMock.dispatch.mockImplementationOnce(action => {
      expect(action).toEqualActionType('POST_SUBSCRIPTION')
      expect(action).toContainActionData({body: {origin: 'expected url'}})
      done()
      return new Promise(() => {})
    })

    originInput.bindings.onChange('expected url')
    saveButton.bindings.onClick()
  })

  it('should navigate user to detail page when action completed successfully', done => {
    jest.useRealTimers()
    ngReduxMock.dispatch.mockResolvedValueOnce({uuid: 'expected uuid'})
    originInput.bindings.onChange('expected url')
    saveButton.bindings.onClick()
    ngReduxMock.dispatch.mockClear()

    setTimeout(() => {
      scope.$digest()
      const action = ngReduxMock.dispatch.mock.calls[0][0]
      expect(action).toContainObject({
        type: 'ROUTE_CHANGED',
        route: ['app', 'subscription'],
        query: {uuid: 'expected uuid'}
      })
      done()
    })
  })

  it('should show backend validation message', done => {
    jest.useRealTimers()
    ngReduxMock.dispatch.mockRejectedValueOnce({
      status: 400,
      data: {
        fieldErrors: [
          {field: 'origin', message: 'expected validation message'}
        ]
      }
    })

    originInput.bindings.onChange('expected url')
    saveButton.bindings.onClick()

    setTimeout(() => {
      scope.$digest()
      expect(originInput.bindings.validations).toEqual([{field: 'origin', message: 'expected validation message'}])
      done()
    })
  })

  xit('should clear backend validation message when save button clicked again', done => {
    jest.useRealTimers()
    ngReduxMock.dispatch.mockRejectedValueOnce({
      status: 400,
      data: {
        fieldErrors: [
          {field: 'origin', message: 'expected validation message'}
        ]
      }
    })

    originInput.bindings.onChange('expected url')
    saveButton.bindings.onClick()

    setTimeout(() => {
      scope.$digest()
      expect(originInput.bindings.validations).toEqual([{field: 'origin', message: 'expected validation message'}])
      saveButton.bindings.onClick()
      expect(originInput.bindings.validations).toBeUndefined()
      done()
    })
  })

  it('should not show validation message when request failed', done => {
    jest.useRealTimers()
    ngReduxMock.dispatch.mockRejectedValueOnce({status: 500})

    originInput.bindings.onChange('expected url')
    saveButton.bindings.onClick()

    setTimeout(() => {
      scope.$digest()
      expect(originInput.bindings.validations).toBeUndefined()
      done()
    })
  })
})
