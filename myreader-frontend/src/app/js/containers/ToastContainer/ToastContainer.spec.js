import React from 'react'
import {mount} from 'enzyme'
import ToastContainer from './ToastContainer'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  Toast: () => null
}))
/* eslint-enable */

describe('ToastContainer', () => {

  let state, dispatch

  const createWrapper = () => {
    return mount(<ToastContainer dispatch={dispatch} {...state} />).find('Toast')
  }

  beforeEach(() => {
    dispatch = jest.fn()

    state = {
      common: {
        notification: {
          nextId: 5,
          notifications: [
            {id: 1, text: 'text1', type: 'success'},
            {id: 2, text: 'text2', type: 'success'}
          ]
        }
      }
    }
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

    expect(dispatch).toHaveBeenCalledWith({
      type: 'REMOVE_NOTIFICATION',
      id: 1
    })
  })
})
