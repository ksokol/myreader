import React from 'react'
import {shallow} from 'enzyme'
import FeedEditForm from './FeedEditForm'

describe('FeedEditPageForm', () => {

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
        {field: 'title', message: 'validation message'}
      ],
      links: {next: {path: 'next', query: {a: 'b'}}},
      failures: [{uuid: '2', createdAt: '2017-01-29'}, {uuid: '3', createdAt: '2017-02-28'}],
      changePending: true,
      fetchFailuresLoading: true,
      onChangeFormData: jest.fn(),
      onSaveFormData: jest.fn(),
      onRemove: jest.fn(),
      onMore: jest.fn()
    }
  })

  it('should not render component when prop "data" is defined', () => {
    props.data = undefined

    expect(createWrapper().children().length).toEqual(0)
  })

  it('should render component when prop "data" is defined', () => {
    expect(createWrapper().children().length).toBeGreaterThan(0)
  })

  it('should pass expected props to title input component', () => {
    expect(createWrapper().find('[name="title"]').props()).toContainObject({
      value: 'title 1',
      label: 'Title',
      disabled: true,
      validations: [{field: 'title', message: 'validation message'}]
    })
  })

  it('should trigger prop function "onChangeFormData" when title input changed', () => {
    createWrapper().find('[name="title"]').props().onChange({target: {value: 'changed title'}})

    expect(props.onChangeFormData).toHaveBeenCalledWith({
      uuid: 'uuid 1',
      title: 'changed title',
      url: 'url 1'
    })
  })

  it('should pass expected props to url input component', () => {
    props.changepending = false

    expect(createWrapper().find('[name="url"]').props()).toContainObject({
      value: 'url 1',
      label: 'Url',
      disabled: true,
      validations: [{field: 'title', message: 'validation message'}]
    })
  })

  it('should trigger prop function "onChangeFormData" when url input changed', () => {
    createWrapper().find('[name="url"]').props().onChange({target: {value: 'changed url'}})

    expect(props.onChangeFormData).toHaveBeenCalledWith({
      uuid: 'uuid 1',
      title: 'title 1',
      url: 'changed url'
    })
  })

  it('should pass expected props to feed fetch errors component', () => {
    expect(createWrapper().find('FeedFetchErrors').props()).toContainObject({
      loading: true,
      links: {next: {path: 'next', query: {a: 'b'}}},
      failures: [{uuid: '2', createdAt: '2017-01-29'}, {uuid: '3', createdAt: '2017-02-28'}]
    })
  })

  it('should trigger prop function "onMore"', () => {
    createWrapper().find('FeedFetchErrors').props().onMore('link')

    expect(props.onMore).toHaveBeenCalledWith('link')
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
