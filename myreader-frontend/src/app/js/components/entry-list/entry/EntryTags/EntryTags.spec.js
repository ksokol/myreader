import EntryTags from './EntryTags'
import React from 'react'
import {shallow} from 'enzyme'

describe('src/app/js/components/entry-list/entry/EntryTags/EntryTags.spec.js', () => {

  let props

  beforeEach(() => {
    props = {
      tags: 'tag1, tag2',
      onChange: jest.fn()
    }
  })

  const createShallow = () => shallow(<EntryTags {...props} />)

  it('should pass expected props', () => {
    expect(createShallow().props()).toContainObject({
      values: ['tag1', 'tag2'],
      placeholder: 'Enter a tag...'
    })
  })

  it('should return key for given value when prop "keyFn" function called', () => {
    expect(createShallow().props().keyFn('expected tag')).toEqual('expected tag')
  })

  it('should return renderer tag for given value when prop "renderItem" function called', () => {
    expect(createShallow().props().renderItem('expected tag')).toEqual('expected tag')
  })

  it('should trigger prop "onChange" function when tag has been removed', () => {
    createShallow().props().onRemove('tag1')

    expect(props.onChange).toHaveBeenCalledWith('tag2')
  })

  it('should trigger prop "onChange" function when first tag has been added', () => {
    props.tags = undefined
    createShallow().props().onAdd('tag1')

    expect(props.onChange).toHaveBeenCalledWith('tag1')
  })

  it('should trigger prop "onChange" function when tag has been added', () => {
    createShallow().props().onAdd('tag3')

    expect(props.onChange).toHaveBeenCalledWith('tag1, tag2, tag3')
  })

  it('should prevent duplicate tags', () => {
    createShallow().props().onAdd('tag2')

    expect(props.onChange).not.toHaveBeenCalled()
  })

  it('should trigger prop "onChange" function with null value when tag has been removed', () => {
    props.tags = 'tag1'
    createShallow().props().onRemove('tag1')

    expect(props.onChange).toHaveBeenCalledWith(null)
  })
})
