import React from 'react'
import {shallow} from 'enzyme'
import {FeedEditForm} from './FeedEditForm'

describe('FeedEditForm', () => {

  let props

  const createWrapper = () => shallow(<FeedEditForm {...props} />)

  beforeEach(() => {
    props = {
      data: {
        uuid: 'uuid 1',
        title: 'title 1',
        url: 'url 1'
      },
      validations: [
        {field: 'title', defaultMessage: 'validation message'}
      ],
      failures: [{uuid: '2', createdAt: '2017-01-29'}, {uuid: '3', createdAt: '2017-02-28'}],
      changePending: true,
      onSaveFormData: jest.fn(),
      onRemove: jest.fn()
    }
  })

  it('should render component when prop "data" is defined', () => {
    expect(createWrapper().children().length).toBeGreaterThan(0)
  })

  it('should pass expected props to title input component', () => {
    expect(createWrapper().find('[name="title"]').props()).toContainObject({
      value: 'title 1',
      label: 'Title',
      disabled: true,
      validations: [{field: 'title', defaultMessage: 'validation message'}]
    })
  })

  it('should pass expected props to url input component', () => {
    props.changepending = false

    expect(createWrapper().find('[name="url"]').props()).toContainObject({
      value: 'url 1',
      label: 'Url',
      disabled: true,
      validations: [{field: 'title', defaultMessage: 'validation message'}]
    })
  })

  it('should pass expected props to feed fetch errors component', () => {
    expect(createWrapper().find('FeedFetchErrors').props()).toEqual({
      uuid: 'uuid 1',
    })
  })

  it('should pass expected props to primary button component', () => {
    expect(createWrapper().find('[primary=true]').props()).toContainObject({
      disabled: true,
      children: 'Save'
    })
  })

  it('should trigger prop function "onSaveFormData" when primary button clicked', () => {
    createWrapper().find('[primary=true]').props().onClick()

    expect(props.onSaveFormData).toHaveBeenCalledWith({
      uuid: 'uuid 1',
      title: 'title 1',
      url: 'url 1'
    })
  })

  it('should pass expected props to caution button component', () => {
    expect(createWrapper().find('[caution=true]').props()).toContainObject({
      disabled: true,
      children: 'Delete'
    })
  })

  it('should trigger prop function "onRemoveSubscription" when caution button clicked', () => {
    createWrapper().find('[caution=true]').props().onClick()

    expect(props.onRemove).toHaveBeenCalledWith('uuid 1')
  })
})
