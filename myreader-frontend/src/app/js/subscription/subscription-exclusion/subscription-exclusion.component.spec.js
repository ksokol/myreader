import React from 'react'
import {mockNgRedux, reactComponent} from '../../shared/test-utils'

describe('src/app/js/subscription/subscription-exclusion/subscription-exclusion.component.spec.js', () => {

  let scope, myOnError, ngReduxMock, exclusions, chips

  beforeEach(() => {
    chips = reactComponent('Chips')
    angular.mock.module('myreader', chips, mockNgRedux())
  })

  beforeEach(inject(($rootScope, $compile, $ngRedux) => {
    jest.useRealTimers()
    ngReduxMock = $ngRedux

    exclusions = [
      {uuid: '2', pattern: 'a', hitCount: 11},
      {uuid: '3', pattern: 'a', hitCount: 12},
      {uuid: '4', pattern: 'b', hitCount: 13},
      {uuid: '1', pattern: 'c', hitCount: 10}
    ]

    scope = $rootScope.$new(true)
    scope.exclusions = exclusions
    scope.myOnError = myOnError = jest.fn()

    $compile(`<my-subscription-exclusion
                    my-id="1"
                    my-disabled="disabled"
                    my-on-error="myOnError(error)"
                    my-exclusions="exclusions">
                  </my-subscription-exclusion>`)(scope)[0]
    scope.$digest()
  }))

  it('should set component into read only mode when myDisabled is set to true', () => {
    scope.disabled = true
    scope.$digest()

    expect(chips.bindings.disabled).toEqual(true)
  })

  it('should set component into write mode when myDisabled is set false', () => {
    scope.disabled = false
    scope.$digest()

    expect(chips.bindings.disabled).toBeUndefined()
  })

  it('should return key for given value in prop "values" when prop "keyFn" function called', () => {
    expect(chips.bindings.keyFn(chips.bindings.values[0])).toEqual('2')
  })

  it('should show input placeholder', () => {
    expect(chips.bindings.placeholder).toEqual('Enter an exclusion pattern')
  })

  it('should indicate pending delete', () => {
    ngReduxMock.dispatch.mockReturnValueOnce(new Promise(() => {}))
    chips.bindings.onRemove(exclusions[1])

    expect(chips.bindings.placeholder).toEqual('processing...')
  })

  it('should render ordered exclusions', () => {
    expect(chips.bindings.values).toEqual(exclusions)
  })

  it('should render exclusions', () => {
    const value = chips.bindings.values[0]
    expect(chips.bindings.renderItem(value)).toEqual([<strong key="pattern">{value.pattern}</strong>, ' ', <em key="hitCount">({value.hitCount})</em>])
  })

  it('should indicate pending remove', done => {
    ngReduxMock.dispatch.mockReturnValueOnce(new Promise(() => {}))
    chips.bindings.onRemove(exclusions[1])

    setTimeout(() => {
      scope.$digest()
      expect(ngReduxMock.dispatch).toHaveBeenCalledWith(expect.objectContaining({type: 'DELETE_SUBSCRIPTION_EXCLUSION_PATTERNS'}))
      expect(ngReduxMock.dispatch).toHaveBeenCalledWith(expect.objectContaining({url: '/myreader/api/2/exclusions/1/pattern/3'}))
      expect(chips.bindings.placeholder).toEqual('processing...')
      done()
    })
  })

  it('should show default placeholder text in input element when remove finished', done => {
    ngReduxMock.dispatch.mockResolvedValueOnce(null)
    chips.bindings.onRemove(exclusions[1])

    setTimeout(() => {
      scope.$digest()
      expect(chips.bindings.placeholder).toEqual('Enter an exclusion pattern')
      done()
    })
  })

  it('should indicate failing remove', done => {
    ngReduxMock.dispatch.mockRejectedValueOnce('expected error')
    chips.bindings.onRemove(exclusions[1])

    setTimeout(() => {
      scope.$digest()
      expect(chips.bindings.placeholder).toEqual('Enter an exclusion pattern')
      expect(myOnError).toHaveBeenCalledWith('expected error')
      done()
    })
  })

  it('should indicate pending save', done => {
    ngReduxMock.dispatch.mockReturnValueOnce(new Promise(() => {}))
    chips.bindings.onAdd('irrelevant')

    setTimeout(() => {
      scope.$digest()
      expect(chips.bindings.placeholder).toEqual('processing...')
      done()
    })
  })

  it('should show default placeholder text in input element when save finished', done => {
    ngReduxMock.dispatch.mockResolvedValueOnce(null)
    chips.bindings.onAdd('irrelevant')

    setTimeout(() => {
      scope.$digest()
      expect(chips.bindings.placeholder).toEqual('Enter an exclusion pattern')
      done()
    })
  })

  it('should add new exclusion when save finished', () => {
    ngReduxMock.dispatch.mockResolvedValueOnce(null)
    chips.bindings.onAdd('expected pattern')

    expect(ngReduxMock.dispatch).toHaveBeenCalledWith(expect.objectContaining({type: 'POST_SUBSCRIPTION_EXCLUSION_PATTERN'}))
    expect(ngReduxMock.dispatch).toHaveBeenCalledWith(expect.objectContaining({url: '/myreader/api/2/exclusions/1/pattern'}))
    expect(ngReduxMock.dispatch).toHaveBeenCalledWith(expect.objectContaining({body: {pattern: 'expected pattern'}}))
  })

  it('should indicate failing save', done => {
    ngReduxMock.dispatch.mockRejectedValueOnce('expected error')
    chips.bindings.onAdd('irrelevant')

    setTimeout(() => {
      scope.$digest()
      expect(chips.bindings.values).toEqual(exclusions)
      expect(chips.bindings.placeholder).toEqual('Enter an exclusion pattern')
      expect(myOnError).toHaveBeenCalledWith('expected error')
      done()
    })
  })
})
