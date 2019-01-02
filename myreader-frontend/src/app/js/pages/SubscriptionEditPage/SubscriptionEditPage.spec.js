import React from 'react'
import {shallow} from 'enzyme'
import SubscriptionEditPage from './SubscriptionEditPage'
import {Chips} from '../../components'

describe('SubscriptionEditPage', () => {

  let props

  const createComponent = () => shallow(<SubscriptionEditPage {...props} />)

  beforeEach(() => {
    props = {
      data: {
        uuid: 'uuid 1',
        title: 'title 1',
        origin: 'origin 1',
        feedTag: {
          name: 'name 1'
        }
      },
      subscriptionTags: [
        {name: 'name 1'},
        {name: 'name 2'}
      ],
      validations: [
        {field: 'title', message: 'validation message'}
      ],
      exclusions: [
        {uuid: '10', pattern: 'pattern 10', hitCount: 1},
        {uuid: '11', pattern: 'pattern 11', hitCount: 2}
      ],
      changePending: true,
      onChangeFormData: jest.fn(),
      onAddExclusionPattern: jest.fn(),
      onRemoveExclusionPattern: jest.fn(),
      onSaveFormData: jest.fn(),
      onRemoveSubscription: jest.fn()
    }
  })

  it('should not render component when prop "data" is defined', () => {
    props.data = undefined

    expect(createComponent().children().length).toEqual(0)
  })

  it('should render component when prop "data" is defined', () => {
    expect(createComponent().children().length).toBeGreaterThan(0)
  })

  it('should pass expected props to title input component', () => {
    expect(createComponent().find('[name="title"]').props()).toContainObject({
      value: 'title 1',
      label: 'Title',
      disabled: true,
      validations: [{field: 'title', message: 'validation message'}]
    })
  })

  it('should trigger prop function "onChangeFormData" when title input changed', () => {
    createComponent().find('[name="title"]').props().onChange({target: {value: 'changed title'}})

    expect(props.onChangeFormData).toHaveBeenCalledWith({
      uuid: 'uuid 1',
      title: 'changed title',
      origin: 'origin 1',
      feedTag: {
        name: 'name 1'
      }
    })
  })

  it('should pass expected props to origin input component', () => {
    props.changepending = false

    expect(createComponent().find('[name="origin"]').props()).toContainObject({
      value: 'origin 1',
      label: 'Url',
      disabled: true
    })
  })

  it('should pass expected props to tag input component', () => {
    expect(createComponent().find('[name="tag"]').props()).toContainObject({
      value: 'name 1',
      label: 'Tag',
      disabled: true,
      values: ['name 1', 'name 2']
    })
  })

  it('should trigger prop function "onChangeFormData" when tag selected', () => {
    createComponent().find('[name="tag"]').props().onSelect('changed name')

    expect(props.onChangeFormData).toHaveBeenCalledWith({
      uuid: 'uuid 1',
      title: 'title 1',
      origin: 'origin 1',
      feedTag: {
        name: 'changed name'
      }
    })
  })

  it('should pass expected props to chips component', () => {
    expect(createComponent().find(Chips).props()).toContainObject({
      disabled: true,
      values: [
        {uuid: '10', pattern: 'pattern 10', hitCount: 1},
        {uuid: '11', pattern: 'pattern 11', hitCount: 2}
      ],
    })
  })

  it('should return expected chip item key', () => {
    expect(createComponent().find(Chips).props().keyFn({uuid: '10'})).toEqual('10')
  })

  it('should trigger prop function "onAddExclusionPattern" when tag added', () => {
    createComponent().find(Chips).props().onAdd('changed tag')

    expect(props.onAddExclusionPattern).toHaveBeenCalledWith('uuid 1', 'changed tag')
  })

  it('should trigger prop function "onRemoveExclusionPattern" when tag deleted', () => {
    createComponent().find(Chips).props().onRemove({uuid: 'uuid 2'})

    expect(props.onRemoveExclusionPattern).toHaveBeenCalledWith('uuid 2')
  })

  it('should render chip item', () => {
    const Item = createComponent().find(Chips).props().renderItem

    expect(shallow(<Item {...props.exclusions[1]}/>).html()).toEqual('<strong>pattern 11</strong> <em>(2)</em>')
  })

  it('should pass expected props to primary button component', () => {
    expect(createComponent().find('[primary=true]').props()).toContainObject({
      disabled: true,
      children: 'Save'
    })
  })

  it('should trigger prop function "onSaveFormData" when primary button clicked', () => {
    createComponent().find('[primary=true]').props().onClick()

    expect(props.onSaveFormData).toHaveBeenCalledWith({
      uuid: 'uuid 1',
      title: 'title 1',
      origin: 'origin 1',
      feedTag: {
        name: 'name 1'
      }
    })
  })

  it('should pass expected props to caution button component', () => {
    expect(createComponent().find('[caution=true]').props()).toContainObject({
      disabled: true,
      children: 'Delete'
    })
  })

  it('should trigger prop function "onRemoveSubscription" when caution button clicked', () => {
    createComponent().find('[caution=true]').props().onClick()

    expect(props.onRemoveSubscription).toHaveBeenCalledWith('uuid 1')
  })
})
