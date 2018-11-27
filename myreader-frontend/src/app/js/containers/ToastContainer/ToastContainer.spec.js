import React from 'react'
import {Provider} from 'react-redux'
import {mount} from 'enzyme'
import {createMockStore} from '../../shared/test-utils'
import ToastContainer from './ToastContainer'
import {Toast} from '../../components'

describe('ToastContainer', () => {

  let store

  const createContainer = () => {
    const wrapper = mount(
      <Provider store={store}>
        <ToastContainer />
      </Provider>
    )

    return wrapper.find(Toast)
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
    expect(createContainer().prop('notifications')).toEqual([
      {id: 1, text: 'text1', type: 'success'},
      {id: 2, text: 'text2', type: 'success'}
    ])
  })

  it('should dispatch action REMOVE_NOTIFICATION with notification id when prop function "removeNotification" triggered', () => {
    const wrapper = createContainer()
    wrapper.props().removeNotification({id: 1, a: 'b'})

    expect(store.getActions()[0]).toEqual({
      type: 'REMOVE_NOTIFICATION',
      id: 1
    })
  })
})
