import React from 'react'
import {EntryActions} from './EntryActions'
import {shallow} from 'enzyme'

describe('src/app/js/components/entry-list/Entry/EntryActions/EntryActions.spec.js', () => {

  let props

  beforeEach(() => {
    props = {
      onToggleShowMore: jest.fn(),
      onToggleSeen: jest.fn(),
      seen: true
    }
  })

  const createShallow = () => shallow(<EntryActions {...props} />)

  it('should render expand-more and check-circle icon buttons', () => {
    const wrapper = createShallow()

    expect(wrapper.at(0).prop('type')).toEqual('expand-more')
    expect(wrapper.at(1).prop('type')).toEqual('check-circle')
  })

  it('should render expand-less and check icon buttons', () => {
    props.seen = false
    props.showMore = true
    const wrapper = createShallow()

    expect(wrapper.at(0).prop('type')).toEqual('expand-less')
    expect(wrapper.at(1).prop('type')).toEqual('check')
  })

  it('should trigger onToggleShowMore with expand-more icon button', () => {
    createShallow().find('[type="expand-more"]').props().onClick()

    expect(props.onToggleShowMore).toHaveBeenCalled()
  })

  it('should trigger onToggleSeen with check-circle icon button', () => {
    createShallow().find('[type="check-circle"]').props().onClick()

    expect(props.onToggleSeen).toHaveBeenCalledWith()
  })

  it('should trigger onToggleShowMore with expand-less icon button', () => {
    props.showMore = true
    const wrapper = createShallow()
    wrapper.find('[type="expand-less"]').props().onClick()

    expect(props.onToggleShowMore).toHaveBeenCalled()
  })

  it('should trigger onToggleSeen with check icon button', () => {
    props.seen = false
    const wrapper = createShallow()
    wrapper.find('[type="check"]').props().onClick()

    expect(props.onToggleSeen).toHaveBeenCalledWith()
  })
})
