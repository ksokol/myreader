import React from 'react'
import {mount} from 'enzyme'
import SubscribePage from './SubscribePage'
import {SUBSCRIPTION_URL} from '../../constants'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  SubscribeForm: () => null
}))

jest.mock('../../contexts', () => ({
  withLocationState: Component => Component
}))
/* eslint-enable */

describe('SubscribePage', () => {

  let state, dispatch, props

  const createWrapper = () => mount(<SubscribePage {...props} state={state} dispatch={dispatch} />)

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
      }
    }

    props = {
      historyReplace: jest.fn()
    }
  })

  it('should pass expected props to component', () => {
    expect(createWrapper().find('SubscribeForm').props()).toEqual(expect.objectContaining({
      changePending: false,
      validations: []
    }))
  })

  it('should trigger action POST_SUBSCRIPTION when prop function "saveSubscribeEditForm" called', () => {
    createWrapper().find('SubscribeForm').props().saveSubscribeEditForm({origin: 'url'})

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'POST_SUBSCRIPTION',
      url: 'api/2/subscriptions',
      body: {origin: 'url'}
    }))
  })

  it('should set prop "changePending" to true when prop function "saveSubscribeEditForm" called', () => {
    const wrapper = createWrapper()
    wrapper.find('SubscribeForm').props().saveSubscribeEditForm({origin: 'url'})
    wrapper.update()

    expect(wrapper.find('SubscribeForm').prop('changePending')).toEqual(true)
  })

  it('should dispatch action SHOW_NOTIFICATION when prop function "saveSubscribeEditForm" succeeded', () => {
    const wrapper = createWrapper()
    wrapper.find('SubscribeForm').props().saveSubscribeEditForm({origin: 'url'})
    wrapper.update()
    dispatch.mock.calls[0][0].success[0]()(dispatch, () => state)

    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: 'SHOW_NOTIFICATION',
      notification: {
        id: 1,
        text: 'Subscribed',
        type: 'success'
      }
    })
  })

  it('should redirect to feed detail page when prop function "saveSubscribeEditForm" succeeded', () => {
    const wrapper = createWrapper()
    wrapper.find('SubscribeForm').props().saveSubscribeEditForm({origin: 'url'})
    wrapper.update()

    dispatch.mock.calls[0][0].success[1]({uuid: '1'})

    expect(props.historyReplace).toHaveBeenCalledWith({
      pathname: SUBSCRIPTION_URL,
      params: {
        uuid: '1'
      }
    })
  })

  it('should pass state "validations" to feed edit page when prop function "saveSubscribeEditForm" failed', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('SubscribeForm').props().saveSubscribeEditForm({origin: 'url'})
    wrapper.update()
    dispatch.mock.calls[0][0].error({status: 400, fieldErrors: ['error']})
    wrapper.update()

    expect(wrapper.find('SubscribeForm').prop('validations')).toEqual(['error'])
  })

  it('should clear state "validations" when prop function "saveSubscribeEditForm" triggered', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('SubscribeForm').props().saveSubscribeEditForm({origin: 'url'})
    wrapper.update()
    dispatch.mock.calls[0][0].error({status: 400, fieldErrors: ['error']})
    wrapper.update()
    wrapper.find('SubscribeForm').props().saveSubscribeEditForm({origin: 'url'})
    wrapper.update()

    expect(wrapper.find('SubscribeForm').prop('validations')).toEqual([])
  })

  it('should not pass state "validations" to feed edit page when prop function "saveSubscribeEditForm" failed', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('SubscribeForm').props().saveSubscribeEditForm({origin: 'url'})
    wrapper.update()
    dispatch.mock.calls[0][0].error({status: 401, fieldErrors: ['error']})
    wrapper.update()

    expect(wrapper.find('SubscribeForm').prop('validations')).toEqual([])
  })

  it('should set prop "changePending" to false when prop function "saveSubscribeEditForm" failed', () => {
    const wrapper = createWrapper()
    wrapper.find('SubscribeForm').props().saveSubscribeEditForm({origin: 'url'})
    wrapper.update()
    dispatch.mock.calls[0][0].error({})
    wrapper.update()

    expect(wrapper.find('SubscribeForm').prop('changePending')).toEqual(false)
  })
})
