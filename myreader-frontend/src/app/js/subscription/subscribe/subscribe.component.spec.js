import {mockNgRedux, reactComponent} from '../../shared/test-utils'

describe('src/app/js/subscription/subscribe/subscribe.component.spec.js', () => {

  let scope, element, ngReduxMock, originInput

  beforeEach(() => {
    originInput = reactComponent('SubscribeOriginInput')
    angular.mock.module('myreader', mockNgRedux(), originInput)
  })

  beforeEach(inject(($rootScope, $compile, $ngRedux) => {
    scope = $rootScope.$new(true)
    ngReduxMock = $ngRedux

    element = $compile('<my-subscribe></my-subscribe>')(scope)[0]
    scope.$digest()
  }))

  it('should pass expected props to origin input component', () => {
    expect(originInput.bindings).toContainObject({
      label: 'Url',
      name: 'origin',
      value: ''
    })
  })

  it('should disable button when action is pending', done => {
    jest.useRealTimers()
    ngReduxMock.dispatch.mockReturnValueOnce(new Promise(() => {}))

    element.querySelector('button').click()

    setTimeout(() => {
      scope.$digest()
      expect(element.querySelector('button').disabled).toEqual(true)
      done()
    })
  })

  it('should enable button when action finished', done => {
    jest.useRealTimers()
    ngReduxMock.dispatch.mockResolvedValueOnce({uuid: 'expected uuid'})
    originInput.bindings.onChange('expected url')

    element.querySelector('button').click()

    setTimeout(() => {
      scope.$digest()
      expect(element.querySelector('button').disabled).toEqual(false)
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
    element.querySelector('button').click()
  })

  it('should navigate user to detail page when action completed successfully', done => {
    jest.useRealTimers()
    ngReduxMock.dispatch.mockResolvedValueOnce({uuid: 'expected uuid'})
    originInput.bindings.onChange('expected url')
    element.querySelector('button').click()
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
    element.querySelector('button').click()

    setTimeout(() => {
      scope.$digest()
      expect(originInput.bindings.validations).toEqual([{field: 'origin', message: 'expected validation message'}])
      done()
    })
  })

  it('should clear backend validation message when save button clicked again', done => {
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
    element.querySelector('button').click()

    setTimeout(() => {
      scope.$digest()
      expect(originInput.bindings.validations).toEqual([{field: 'origin', message: 'expected validation message'}])
      element.querySelector('button').click()
      expect(originInput.bindings.validations).toBeUndefined()
      done()
    })
  })

  it('should not show validation message when request failed', done => {
    jest.useRealTimers()
    ngReduxMock.dispatch.mockRejectedValueOnce({status: 500})

    originInput.bindings.onChange('expected url')
    element.querySelector('button').click()

    setTimeout(() => {
      scope.$digest()
      expect(originInput.bindings.validations).toBeUndefined()
      done()
    })
  })
})
