import React from 'react'
import {mount} from 'enzyme'
import SubscribePageContainer from './SubscribePageContainer'

/* eslint-disable react/prop-types */
jest.mock('../../pages', () => ({
  SubscribePage: () => null
}))
/* eslint-enable */

describe('SubscribePageContainer', () => {

  let state, dispatch

  const createWrapper = () => {
    return mount(<SubscribePageContainer dispatch={dispatch} {...state} />).find('SubscribePage')
  }

  beforeEach(() => {
    dispatch = jest.fn()

    state = {
      subscription: {
        editForm: {
          changePending: true,
          data: {
            origin: 'origin'
          },
          validations: [{field: 'origin', message: 'may not be empty'}]
        }
      }
    }
  })

  it('should initialize component with given props', () => {
    expect(createWrapper().props()).toContainObject({
      changePending: true,
      data: {origin: 'origin'},
      validations: [{field: 'origin', message: 'may not be empty'}],
    })
  })

  it('should dispatch expected action when prop function "onChangeFormData" triggered', () => {
    createWrapper().props().onChangeFormData({a: 'b', c: 'd'})

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SUBSCRIPTION_EDIT_FORM_CHANGE_DATA',
      data: {a: 'b', c: 'd'}
    })
  })

  it('should dispatch expected action when prop function "onSaveFormData" triggered', () => {
    createWrapper().props().onSaveFormData({feedTag: {name: 'expected tag'}})

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'POST_SUBSCRIPTION',
      url: 'api/2/subscriptions',
      body: {feedTag: {name: 'expected tag'}}
    }))
  })
})
