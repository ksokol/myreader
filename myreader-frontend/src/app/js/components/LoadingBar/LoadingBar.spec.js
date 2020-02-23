import React from 'react'
import {mount} from 'enzyme'
import {LoadingBar} from './LoadingBar'
import {api} from '../../api'

/* eslint-disable react/prop-types */
jest.mock('../../api', () => ({
  api: {
    addInterceptor: jest.fn(),
    removeInterceptor: jest.fn()
  }
}))
/* eslint-enable */

const CLASS_LOADING_BAR = '.my-loading-bar'

describe('LoadingBar', () => {

  const createWrapper = () => mount(<LoadingBar />)

  beforeEach(() => {
    api.addInterceptor.mockClear()
  })

  it('should not render loading bar when state prop "pendingRequests" is equal to 0', () => {
    expect(createWrapper().find(CLASS_LOADING_BAR).exists()).toEqual(false)
  })

  it('should render loading bar when prop "pendingRequests" is greater than 0', done => {
    jest.useRealTimers()
    const wrapper = createWrapper()
    api.addInterceptor.mock.calls[0][0].onBefore()

    setTimeout(() => {
      wrapper.update()
      expect(wrapper.find(CLASS_LOADING_BAR).exists()).toEqual(true)
      done()
    })
  })

  it('should not render loading bar when prop "pendingRequests" is equal to 0 again', done => {
    const wrapper = createWrapper()
    api.addInterceptor.mock.calls[0][0].onBefore()
    wrapper.update()
    api.addInterceptor.mock.calls[0][0].onFinally()

    setTimeout(() => {
      wrapper.update()
      expect(wrapper.find(CLASS_LOADING_BAR).exists()).toEqual(false)
      done()
    })
  })

  it('should remove component from api interceptors on unmount', () => {
    const wrapper = createWrapper()
    const instance = wrapper.instance()
    wrapper.unmount()

    expect(api.removeInterceptor).toHaveBeenCalledWith(instance)
  })
})
