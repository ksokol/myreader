import React from 'react'
import {mount} from 'enzyme'
import SubscribePage from './SubscribePage'

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

  it('should pass expected props to origin input component', () => {
    expect(createWrapper().find('form > [name="origin"]').props()).toContainObject({
      value: 'origin',
      label: 'Url',
      disabled: true,
      validations: [{field: 'origin', message: 'may not be empty'}],
    })
  })

  it('should dispatch action SUBSCRIPTION_EDIT_FORM_CHANGE_DATA when origin input changed', () => {
    createWrapper().find('form > [name="origin"]').props().onChange({target: {value: 'changed url'}})

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SUBSCRIPTION_EDIT_FORM_CHANGE_DATA',
      data: {origin: 'changed url'}
    })
  })

  it('should pass expected props to primary button component', () => {
    expect(createWrapper().find('[primary=true]').props()).toContainObject({
      disabled: true,
      children: 'Subscribe'
    })
  })

  it('should dispatch action POST_SUBSCRIPTION when primary button clicked', () => {
    createWrapper().find('[primary=true]').props().onClick()

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'POST_SUBSCRIPTION',
      url: 'api/2/subscriptions',
      body: {origin: 'origin', feedTag: null}
    }))
  })
})
