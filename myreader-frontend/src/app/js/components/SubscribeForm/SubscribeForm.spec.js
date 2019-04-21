import React from 'react'
import {mount} from 'enzyme'
import SubscribeForm from './SubscribeForm'

describe('SubscribeForm', () => {

  let props

  const createWrapper = () => mount(<SubscribeForm {...props} />)

  beforeEach(() => {
    props = {
      data: {
        origin: 'origin'
      },
      validations: [{field: 'origin', message: 'may not be empty'}],
      changePending: true,
      subscriptionEditFormChangeData: jest.fn(),
      saveSubscribeEditForm: jest.fn()
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

  it('should trigger prop function "subscriptionEditFormChangeData" when origin input changed', () => {
    createWrapper().find('form > [name="origin"]').props().onChange({target: {value: 'changed url'}})

    expect(props.subscriptionEditFormChangeData).toHaveBeenCalledWith({
      origin: 'changed url'
    })
  })

  it('should pass expected props to primary button component', () => {
    expect(createWrapper().find('[primary=true]').props()).toContainObject({
      disabled: true,
      children: 'Subscribe'
    })
  })

  it('should trigger prop function "saveSubscribeEditForm" when primary button clicked', () => {
    createWrapper().find('[primary=true]').props().onClick()

    expect(props.saveSubscribeEditForm).toHaveBeenCalledWith(expect.objectContaining({
      origin: 'origin'
    }))
  })
})
