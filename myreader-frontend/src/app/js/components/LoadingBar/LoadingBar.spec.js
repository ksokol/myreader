import React from 'react'
import {mount} from 'enzyme'
import LoadingBar from './LoadingBar'

describe('LoadingBar', () => {

  let state

  const createWrapper = () => mount(<LoadingBar state={state} />)

  beforeEach(() => {
    state = {
      common: {
        pendingRequests: 0
      }
    }
  })

  it('should not render loading bar when prop "pendingRequests" is equal to 0', () => {
    expect(createWrapper().find('.my-loading-bar').exists()).toEqual(false)
  })

  it('should render loading bar when prop "pendingRequests" is greater than 0', () => {
    state.common.pendingRequests = 1

    expect(createWrapper().find('.my-loading-bar').exists()).toEqual(true)
  })
})
