import React from 'react'
import {shallow} from 'enzyme'
import ConfirmButton from './ConfirmButton'
import {Button} from '..'

describe('ConfirmButton', () => {

  let props

  const createComponent = () => shallow(<ConfirmButton {...props}>expect button text</ConfirmButton>)

  beforeEach(() => {
    props = {
      onClick: jest.fn()
    }
  })

  it('should pass expected props to call to action button', () => {
    expect(createComponent().find(Button).length).toEqual(1)
    expect(createComponent().find(Button).props()).toContainObject({
      disabled: false,
      children: 'expect button text'
    })
  })

  it('should disable call to action button when prop "disabled" is set to true', () => {
    props.disabled = true

    expect(createComponent().find(Button).prop('disabled')).toEqual(true)
  })

  it('should pass additional props to call to action button', () => {
    props.a = 'b'
    props.c = 'd'

    expect(createComponent().find(Button).props()).toContainObject({
      a: 'b',
      c: 'd'
    })
  })

  it('should render confirm and reject button when call to action button clicked', () => {
    const wrapper = createComponent()
    wrapper.find(Button).props().onClick()

    expect(wrapper.find(Button).length).toEqual(2)
    expect(wrapper.find(Button).at(0).prop('children')).toEqual('Yes')
    expect(wrapper.find(Button).at(1).prop('children')).toEqual('No')
  })

  it('should disabled confirm and reject button when prop "disabled" is set to false', () => {
    props.disabled = true
    const wrapper = createComponent()
    wrapper.find(Button).props().onClick()

    expect(wrapper.find(Button).length).toEqual(2)
    expect(wrapper.find(Button).at(0).prop('disabled')).toEqual(true)
    expect(wrapper.find(Button).at(1).prop('disabled')).toEqual(true)
  })

  it('should render call to action button again when reject button clicked', () => {
    const wrapper = createComponent()
    wrapper.find(Button).props().onClick()
    wrapper.find(Button).at(1).props().onClick()

    expect(wrapper.find(Button).length).toEqual(1)
    expect(createComponent().find(Button).prop('children')).toEqual('expect button text')
  })

  it('should render call to action button again when confirm button clicked', () => {
    const wrapper = createComponent()
    wrapper.find(Button).props().onClick()
    wrapper.find(Button).at(0).props().onClick()

    expect(wrapper.find(Button).length).toEqual(1)
    expect(createComponent().find(Button).prop('children')).toEqual('expect button text')
  })

  it('should not trigger prop function "onClick" when reject button clicked', () => {
    const wrapper = createComponent()
    wrapper.find(Button).props().onClick()

    expect(props.onClick).not.toHaveBeenCalled()
  })

  it('should trigger prop function "onClick" when confirm button clicked', () => {
    const wrapper = createComponent()
    wrapper.find(Button).props().onClick()
    wrapper.find(Button).at(0).props().onClick()

    expect(props.onClick).toHaveBeenCalledWith()
  })
})
