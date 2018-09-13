import React from 'react'
import {NavigationItem} from '.'
import {shallow} from 'enzyme'
import {Badge} from '../Badge'

describe('src/app/js/components/Navigation/NavigationItem.spec.js', () => {

  let props

  const createShallow = () => shallow(<NavigationItem {...props} />)

  beforeEach(() => {
    props = {
      className: 'expected-class',
      title: 'expected title',
      badgeCount: 3,
      selected: true,
      onClick: jest.fn()
    }
  })

  it('should pass prop "className" to component', () => {
    expect(createShallow().find('li').prop('className')).toContain(props.className)
  })

  it('should render prop "title"', () => {
    expect(createShallow().find('li > span').text()).toEqual(props.title)
  })

  it('should trigger prop function "onClick" when component clicked', () => {
    createShallow().props().onClick()

    expect(props.onClick).toHaveBeenCalledWith()
  })

  it('should bass prop "badgeCount" to Badge component', () => {
    expect(createShallow().find('li').find(Badge).prop('count')).toEqual(props.badgeCount)
  })

  it('should not render badge component when value for prop "badgeCount" is undefined', () => {
    props.badgeCount = undefined

    expect(createShallow().find('li').find(Badge).exists()).toEqual(false)
  })
})
