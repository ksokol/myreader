import React from 'react'
import {NavigationItem} from '.'
import {shallow} from 'enzyme'
import {Badge} from '..'

describe('NavigationItem', () => {

  let props

  const createShallow = () => shallow(<NavigationItem {...props} />)

  beforeEach(() => {
    props = {
      className: 'expected-class',
      title: 'expected title',
      to: 'expected to',
      badgeCount: 3,
      selected: true,
      onClick: jest.fn()
    }
  })

  it('should pass prop "className" to component', () => {
    expect(createShallow().find('li').prop('className')).toContain(props.className)
  })

  it('should pass props to link component', () => {
    const link = createShallow().find('Link')

    expect(link.prop('to')).toEqual('expected to')
    expect(link.prop('children')[0]).toEqual(<span>expected title</span>)
    expect(link.prop('children')[1]).toEqual(<Badge text={3} />)
  })

  it('should trigger prop function "onClick" when link component clicked', () => {
    createShallow().find('Link').props().onClick()

    expect(props.onClick).toHaveBeenCalledWith()
  })

  it('should bass prop "badgeCount" to Badge component', () => {
    expect(createShallow().find('li').find(Badge).prop('text')).toEqual(props.badgeCount)
  })

  it('should not render badge component when value for prop "badgeCount" is undefined', () => {
    props.badgeCount = undefined

    expect(createShallow().find('li').find(Badge).exists()).toEqual(false)
  })
})
