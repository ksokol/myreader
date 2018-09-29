import React from 'react'
import {shallow} from 'enzyme'
import Option from './Option'
import {Button} from '../../Buttons'

describe('Option', () => {

  let props

  const createShallow = () => shallow(<Option {...props} />)

  beforeEach(() => {
    props = {
      value: 2,
      options: [1, {label: 'label1', value: true}, 2, 'value1', false],
      onSelect: jest.fn()
    }
  })

  it('should render option labels', () => {
    const buttonLabels = createShallow().find(Button).reduce((acc, button) => [...acc, button.children().text()], [])

    expect(buttonLabels).toEqual(['1', 'label1', '2', 'value1', 'false'])
  })

  it('should set key for every option', () => {
    const buttonKeys = createShallow().find(Button).reduce((acc, button) => [...acc, button.key()], [])

    expect(buttonKeys).toEqual(['1', 'true', '2', 'value1', 'false'])
  })

  it('should mark option as selected when prop "value" matches option value', () => {
    const wrapper = createShallow()
    expect(wrapper.find('[className="my-option__button--selected"]').key()).toEqual('2')

    wrapper.setProps({value: false})
    expect(wrapper.find('[className="my-option__button--selected"]').key()).toEqual('false')
  })

  it('should trigger prop function "onSelect" when option clicked', () => {
    const buttons = createShallow().find(Button)

    buttons.at(0).props().onClick()
    expect(props.onSelect).toHaveBeenCalledWith(1)

    buttons.at(3).props().onClick()
    expect(props.onSelect).toHaveBeenCalledWith('value1')
  })
})
