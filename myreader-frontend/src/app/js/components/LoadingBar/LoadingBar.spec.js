import React from 'react'
import {mount} from 'enzyme'
import LoadingBar from './LoadingBar'
import {createMockStore} from '../../shared/test-utils'
import {Provider} from 'react-redux'

describe('LoadingBar', () => {

  let store

  const createWrapper = () => mount(
    <Provider store={store}>
      <LoadingBar />
    </Provider>
  )

  beforeEach(() => {
    store = createMockStore()
    store.setState({
      common: {
        pendingRequests: 0
      }
    })
  })

  it('should not render loading bar when prop "pendingRequests" is equal to 0', () => {
    expect(createWrapper().find('.my-loading-bar').exists()).toEqual(false)
  })

  it('should render loading bar when prop "pendingRequests" is greater than 0', () => {
    store.setState({
      common: {
        pendingRequests: 1
      }
    })

    expect(createWrapper().find('.my-loading-bar').exists()).toEqual(true)
  })
})
