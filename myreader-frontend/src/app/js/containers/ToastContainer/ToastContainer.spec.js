import React from 'react'
import {mount} from 'enzyme'
import ToastContainer from './ToastContainer'
import {createMockStore} from '../../shared/test-utils'
import {Provider} from 'react-redux'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  Toast: () => null
}))
/* eslint-enable */

describe('ToastContainer', () => {

  let store

  const createWrapper = () => {
    return mount(
      <Provider store={store}>
        <ToastContainer />
      </Provider>
    ).find('Toast')
  }

  beforeEach(() => {
    store = createMockStore()
    store.setState({
      common: {
        notification: {
          nextId: 5,
          notifications: [
            {id: 1, text: 'text1', type: 'success'},
            {id: 2, text: 'text2', type: 'success'}
          ]
        }
      }
    })
  })

  it('should initialize toast component with given notifications', () => {
    expect(createWrapper().prop('notifications')).toEqual([
      {id: 1, text: 'text1', type: 'success'},
      {id: 2, text: 'text2', type: 'success'}
    ])
  })

  it('should dispatch action REMOVE_NOTIFICATION with notification id when prop function "removeNotification" triggered', () => {
    const wrapper = createWrapper()
    wrapper.props().removeNotification({id: 1, a: 'b'})

    expect(store.getActions()[0]).toEqual({
      type: 'REMOVE_NOTIFICATION',
      id: 1
    })
  })
})
