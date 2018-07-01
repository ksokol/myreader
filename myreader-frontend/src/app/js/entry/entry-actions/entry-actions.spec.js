import React from 'react'
import {EntryActions} from './entry-actions'
import TestRenderer from 'react-test-renderer'

describe('src/app/js/entry/entry-actions/entry-actions.spec.js', () => {

  let props

  beforeEach(() => {
    props = {
      onToggleShowMore: jest.fn(),
      onToggleSeen: jest.fn(),
      seen: true
    }
  })

  const createInstance = () => TestRenderer.create(<EntryActions {...props} />).root

  it('should render expand-more and check-circle icon buttons', () => {
    const instance = createInstance()

    expect(instance.children[0].props).toContainObject({type: 'expand-more'})
    expect(instance.children[1].props).toContainObject({type: 'check-circle'})
  })

  it('should render expand-less and check icon buttons', () => {
    props.seen = false
    props.showMore = true
    const instance = createInstance()

    expect(instance.children[0].props).toContainObject({type: 'expand-less'})
    expect(instance.children[1].props).toContainObject({type: 'check'})
  })

  it('should trigger onToggleShowMore with expand-more icon button', () => {
    createInstance().findByProps({type: 'expand-more'}).props.onClick()

    expect(props.onToggleShowMore).toHaveBeenCalled()
  })

  it('should trigger onToggleSeen with check-circle icon button', () => {
    createInstance().findByProps({type: 'check-circle'}).props.onClick()

    expect(props.onToggleSeen).toHaveBeenCalledWith()
  })

  it('should trigger onToggleShowMore with expand-less icon button', () => {
    props.showMore = true
    const instance = createInstance()
    instance.findByProps({type: 'expand-less'}).props.onClick()

    expect(props.onToggleShowMore).toHaveBeenCalled()
  })

  it('should trigger onToggleSeen with check icon button', () => {
    props.seen = false
    const instance = createInstance()
    instance.findByProps({type: 'check'}).props.onClick()

    expect(props.onToggleSeen).toHaveBeenCalledWith()
  })
})
