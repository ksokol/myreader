import React from 'react'
import {shallow} from 'enzyme'
import SubscribePage from './SubscribePage'

describe('SubscribePage', () => {

  let props

  const createComponent = () => shallow(<SubscribePage {...props} />)

  beforeEach(() => {
    props = {
      data: {
        origin: 'origin 1'
      },
      changePending: true,
      validations: [{field: 'origin', message: 'may not be empty'}],
      onChangeFormData: jest.fn(),
      onSaveFormData: jest.fn()
    }
  })

  it('should pass expected props to origin input component', () => {
    props.changepending = false

    expect(createComponent().find('[name="origin"]').props()).toContainObject({
      value: 'origin 1',
      label: 'Url',
      disabled: true,
      validations: [{field: 'origin', message: 'may not be empty'}],
    })
  })

  it('should trigger prop function "onChangeFormData" when origin input changed', () => {
    createComponent().find('[name="origin"]').props().onChange({target: {value: 'changed url'}})

    expect(props.onChangeFormData).toHaveBeenCalledWith({
      origin: 'changed url'
    })
  })

  it('should pass expected props to primary button component', () => {
    expect(createComponent().find('[primary=true]').props()).toContainObject({
      disabled: true,
      children: 'Subscribe'
    })
  })

  it('should trigger prop function "onSaveFormData" when primary button clicked', () => {
    createComponent().find('[primary=true]').props().onClick()

    expect(props.onSaveFormData).toHaveBeenCalledWith({
      origin: 'origin 1'
    })
  })
})
