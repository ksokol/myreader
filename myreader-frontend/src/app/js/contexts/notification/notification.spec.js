import React from 'react'
import {mount} from 'enzyme'
import {NotificationProvider, withNotification} from '.'

const WrappedComponent = () => <span>wrapped component</span>

describe('notification context', () => {

  let state, dispatch

  const createWrapper = () => {
    const Component = withNotification(WrappedComponent)
    return mount(
      <NotificationProvider state={state} dispatch={dispatch}>
        <Component />
      </NotificationProvider>
    )
  }

  beforeEach(() => {
    dispatch = jest.fn().mockImplementation(action => {
      if (typeof action === 'function') {
        action(dispatch, () => state)
      }
    })

    state = {
      common: {
        notification: {
          nextId: 1
        }
      },
    }
  })

  it('should dispatch action "SHOW_NOTIFICATION" when prop function "showSuccessNotification" called', () => {
    createWrapper().find('WrappedComponent').props().showSuccessNotification()

    expect(dispatch).toHaveBeenCalledWith( {
      notification: {
        id: 1,
        text: undefined,
        type: 'success'
      },
      type: 'SHOW_NOTIFICATION'
    })
  })
})
