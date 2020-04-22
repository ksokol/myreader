import React from 'react'
import {shallow} from 'enzyme'
import SubscribeForm from './SubscribeForm'

describe('SubscribeForm', () => {

  let props

  const createWrapper = () => shallow(<SubscribeForm {...props} />)

  beforeEach(() => {
    props = {
      validations: [{field: 'origin', defaultMessage: 'may not be empty'}],
      changePending: true,
      subscriptionEditFormChangeData: jest.fn(),
      saveSubscribeEditForm: jest.fn()
    }
  })

  it('should pass expected props to origin input component', () => {
    expect(createWrapper().find('form > [name="origin"]').props()).toEqual(expect.objectContaining({
      value: '',
      label: 'Url',
      disabled: true,
      validations: [{field: 'origin', defaultMessage: 'may not be empty'}],
    }))
  })

  it('should pass expected props to primary button component', () => {
    expect(createWrapper().find('[primary=true]').props()).toEqual(expect.objectContaining({
      disabled: true,
      children: 'Subscribe'
    }))
  })

  it('should trigger prop function "saveSubscribeEditForm" when primary button clicked', () => {
    const wrapper = createWrapper()
    wrapper.find('form > [name="origin"]').props().onChange({target: {value: 'url'}})
    wrapper.find('[primary=true]').props().onClick()

    expect(props.saveSubscribeEditForm).toHaveBeenCalledWith(expect.objectContaining({
      origin: 'url'
    }))
  })
})
