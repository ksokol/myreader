import React from 'react'
import IconButton from './IconButton'
import {shallow} from 'enzyme'
import {Icon} from '../..'

describe('src/app/js/components/Buttons/IconButton/IconButton.spec.js', () => {

  it('should contain expected props', () => {
    const wrapper = shallow(<IconButton className='expected-className' type='close' color='white' disabled={true}/>)

    expect(wrapper.props()).toContainObject({
      className: 'my-icon-button expected-className',
      type: 'button',
      disabled: true
    })
  })

  it('should pass expected props to Icon component', () => {
    const wrapper = shallow(<IconButton type='close' color='white'/>)

    expect(wrapper.find(Icon).props()).toEqual({type: 'close', color: 'white', disabled: false})
  })

  it('should trigger prop "onClick" function when clicked', () => {
    const onClick = jest.fn()
    const wrapper = shallow(<IconButton type='close' onClick={onClick}/>)

    wrapper.find({onClick}).props().onClick()
    expect(onClick).toHaveBeenCalled()
  })
})