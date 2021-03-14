import React from 'react'
import {EntryActions} from './EntryActions'
import {shallow} from 'enzyme'

describe('EntryActions', () => {

  let props

  beforeEach(() => {
    props = {
      onToggleShowMore: jest.fn(),
      onToggleSeen: jest.fn(),
      seen: true
    }
  })

  const createShallow = () => shallow(<EntryActions {...props} />)

  it('should render chevron-down and check-circle icon button', () => {
    const wrapper = createShallow()

    expect(wrapper.at(0).prop('type')).toEqual('chevron-down')
    expect(wrapper.at(1).prop('type')).toEqual('check-circle')
  })

  it('should render chevron-up and check icon button', () => {
    props.seen = false
    props.showMore = true
    const wrapper = createShallow()

    expect(wrapper.at(0).prop('type')).toEqual('chevron-up')
    expect(wrapper.at(1).prop('type')).toEqual('check')
  })

  it('should trigger onToggleShowMore with chevron-down icon button', () => {
    createShallow().find('[type="chevron-down"]').props().onClick()

    expect(props.onToggleShowMore).toHaveBeenCalled()
  })

  it('should trigger onToggleSeen with check-circle icon button', () => {
    createShallow().find('[type="check-circle"]').props().onClick()

    expect(props.onToggleSeen).toHaveBeenCalledWith()
  })

  it('should trigger onToggleShowMore with chevron-up icon button', () => {
    props.showMore = true
    const wrapper = createShallow()
    wrapper.find('[type="chevron-up"]').props().onClick()

    expect(props.onToggleShowMore).toHaveBeenCalled()
  })

  it('should trigger onToggleSeen with check icon button', () => {
    props.seen = false
    const wrapper = createShallow()
    wrapper.find('[type="check"]').props().onClick()

    expect(props.onToggleSeen).toHaveBeenCalledWith()
  })
})
