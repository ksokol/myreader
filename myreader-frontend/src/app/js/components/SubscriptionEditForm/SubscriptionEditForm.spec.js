import React from 'react'
import {shallow} from 'enzyme'
import SubscriptionEditForm from './SubscriptionEditForm'

/* eslint-disable react/prop-types */
jest.mock('./SubscriptionExclusions/SubscriptionExclusions', () => ({
  SubscriptionExclusions: () => null
}))
/* eslint-enable */


describe('SubscriptionEditForm', () => {

  let props

  const createWrapper = () => shallow(<SubscriptionEditForm {...props} />)

  beforeEach(() => {
    props = {
      data: {
        uuid: 'uuid1',
        title: 'title1',
        origin: 'origin1',
        feedTag: {
          uuid: '2',
          name: 'name 1'
        },
        createdAt: '2017-12-29'
      },
      exclusions: [
        {uuid: '10', pattern: 'exclusion1', hitCount: 1},
        {uuid: '11', pattern: 'exclusion2', hitCount: 2}
      ],
      subscriptionTags: [
        {name: 'name 1'},
        {name: 'name 2'}
      ],
      validations: [
        {field: 'title', message: 'validation message'}
      ],
      changePending: true,
      saveSubscriptionEditForm: jest.fn(),
      deleteSubscription: jest.fn(),
      addSubscriptionExclusionPattern: jest.fn(),
      removeSubscriptionExclusionPattern: jest.fn()
    }
  })

  it('should render component when prop "data" is defined', () => {
    expect(createWrapper().find('form').exists()).toEqual(true)
  })

  it('should pass expected props to title input component', () => {
    expect(createWrapper().find('form > [name="title"]').props()).toEqual(expect.objectContaining({
      value: 'title1',
      name: 'title',
      label: 'Title',
      disabled: true,
      validations: [{field: 'title', message: 'validation message'}]
    }))
  })

  it('should pass expected props to origin input component', () => {
    expect(createWrapper().find('Input[name="origin"]').props()).toEqual(expect.objectContaining({
      value: 'origin1',
      label: 'Url',
      disabled: true
    }))
  })

  it('should pass expected props to tag input component', () => {
    expect(createWrapper().find('form > [name="tag"]').props()).toEqual(expect.objectContaining({
      value: 'name 1',
      label: 'Tag',
      disabled: true,
      values: ['name 1', 'name 2']
    }))
  })

  it('should pass expected props to subscription exclusions component', () => {
    expect(createWrapper().find('SubscriptionExclusions').props()).toEqual(expect.objectContaining({
      subscription: {...props.data},
      changePending: true,
      exclusions: [
        {uuid: '10', pattern: 'exclusion1', hitCount: 1},
        {uuid: '11', pattern: 'exclusion2', hitCount: 2}
      ],
      onAdd: props.addSubscriptionExclusionPattern,
      onRemove: props.removeSubscriptionExclusionPattern,
    }))
  })

  it('should pass expected props to primary button component', () => {
    expect(createWrapper().find('[primary=true]').props()).toContainObject({
      disabled: true,
      children: 'Save'
    })
  })

  it('should trigger prop function "saveSubscriptionEditForm" when primary button clicked', () => {
    createWrapper().find('[primary=true]').props().onClick()

    expect(props.saveSubscriptionEditForm).toHaveBeenCalledWith({
      uuid: 'uuid1',
      title: 'title1',
      origin: 'origin1',
      createdAt: '2017-12-29',
      feedTag: {
        uuid: '2',
        name: 'name 1'
      }
    })
  })

  it('should pass expected props to caution button component', () => {
    expect(createWrapper().find('ConfirmButton').props()).toEqual(expect.objectContaining({
      disabled: true,
      children: 'Delete'
    }))
  })

  it('should trigger prop function "deleteSubscription" when caution button clicked', () => {
    createWrapper().find('ConfirmButton').props().onClick()

    expect(props.deleteSubscription).toHaveBeenCalledWith('uuid1')
  })
})
