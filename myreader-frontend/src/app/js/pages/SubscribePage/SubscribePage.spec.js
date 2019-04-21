import React from 'react'
import {mount} from 'enzyme'
import SubscribePage from './SubscribePage'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  SubscribeForm: () => null
}))
/* eslint-enable */

describe('SubscribePage', () => {

  let state, dispatch

  const createWrapper = () => mount(<SubscribePage state={state} dispatch={dispatch} />)

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

  it('should pass expected props to component', () => {
    expect(createWrapper().find('SubscribeForm').props()).toEqual(expect.objectContaining({
      data: {origin: 'origin'},
      changePending: true,
      validations: [{field: 'origin', message: 'may not be empty'}],
    }))
  })

  it('should dispatch action SUBSCRIPTION_EDIT_FORM_CHANGE_DATA when origin input changed', () => {
    createWrapper().find('SubscribeForm').props().subscriptionEditFormChangeData({origin: 'changed url'})

    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: 'SUBSCRIPTION_EDIT_FORM_CHANGE_DATA',
      data: {origin: 'changed url'}
    })
  })

  it('should dispatch action POST_SUBSCRIPTION when primary button clicked', () => {
    createWrapper().find('SubscribeForm').props().saveSubscribeEditForm({origin: 'origin'})

    expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
      type: 'POST_SUBSCRIPTION',
      url: 'api/2/subscriptions',
      body: {origin: 'origin', feedTag: null}
    }))
  })

  it('should clear edit form when mounted', () => {
    createWrapper()

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SUBSCRIPTION_EDIT_FORM_CLEAR'
    })
  })
})
