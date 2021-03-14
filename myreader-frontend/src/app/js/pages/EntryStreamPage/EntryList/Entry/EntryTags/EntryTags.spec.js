import {EntryTags} from './EntryTags'
import React from 'react'
import {shallow} from 'enzyme'

const expectedTag = 'expected tag'

describe('EntryTags', () => {

  let props

  beforeEach(() => {
    props = {
      tags: ['tag1', 'tag2'],
      onChange: jest.fn()
    }
  })

  const createComponent = () => shallow(<EntryTags {...props} />)

  it('should pass expected props', () => {
    expect(createComponent().props()).toEqual(expect.objectContaining({
      values: ['tag1', 'tag2'],
      placeholder: 'Enter a tag...'
    }))
  })

  it('should return key for given value when prop "keyFn" function called', () => {
    expect(createComponent().props().keyFn(expectedTag)).toEqual(expectedTag)
  })

  it('should return renderer tag for given value when prop "renderItem" function called', () => {
    expect(createComponent().props().renderItem(expectedTag)).toEqual(expectedTag)
  })

  it('should trigger prop "onChange" function when tag has been removed', () => {
    createComponent().props().onRemove('tag1')

    expect(props.onChange).toHaveBeenCalledWith(['tag2'])
  })

  it('should trigger prop "onChange" function when first tag has been added', () => {
    props.tags = []
    createComponent().props().onAdd('tag1')

    expect(props.onChange).toHaveBeenCalledWith(['tag1'])
  })

  it('should trigger prop "onChange" function when tag has been added', () => {
    createComponent().props().onAdd('tag3')

    expect(props.onChange).toHaveBeenCalledWith(['tag1', 'tag2', 'tag3'])
  })

  it('should prevent duplicate tags', () => {
    createComponent().props().onAdd('tag2')

    expect(props.onChange).not.toHaveBeenCalled()
  })

  it('should trigger prop "onChange" function with null value when tag has been removed', () => {
    props.tags = ['tag1']
    createComponent().props().onRemove('tag1')

    expect(props.onChange).toHaveBeenCalledWith(null)
  })
})
