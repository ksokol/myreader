import React from 'react'
import {mount} from 'enzyme'
import withSubscriptions from './withSubscriptions'

describe('withSubscriptions', () => {

  let props, dispatch

  const createWrapper = () => {
    const Component = withSubscriptions(({role}) => <p role={role}>wrapped component</p>)
    return mount(<Component {...props} dispatch={dispatch} />)
  }

  beforeEach(() => {
    dispatch = jest.fn().mockImplementation(action => {
      if (typeof action === 'function') {
        action(dispatch, () => state)
      }
    })

    props = {
      role: 'expected role'
    }
  })

  it('should render wrapped component', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('p').text()).toEqual('wrapped component')
  })

  it('should pass expected props to wrapped component', () => {
    expect(createWrapper().find('p').props()).toEqual(expect.objectContaining({
      role: 'expected role'
    }))
  })

  it('should dispatch action GET_SUBSCRIPTIONS when mounted', () => {
    createWrapper()

    expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({
      type: 'GET_SUBSCRIPTIONS',
      url: 'api/2/subscriptions'
    }))
  })
})
