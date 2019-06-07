import React from 'react'
import {shallow} from 'enzyme'
import {SubscriptionExclusions} from './SubscriptionExclusions'

describe('SubscriptionExclusions', () => {

  let props

  const createWrapper = () => shallow(<SubscriptionExclusions {...props} />)

  beforeEach(() => {
    props = {
      subscription: {
        uuid: 'uuid1'
      },
      exclusions: [
        {uuid: '10', pattern: 'exclusion1', hitCount: 1},
        {uuid: '11', pattern: 'exclusion2', hitCount: 2}
      ],
      changePending: true,
      onAdd: jest.fn(),
      onRemove: jest.fn()
    }
  })

  it('should pass expected props to component', () => {
    expect(createWrapper().find('Chips').props()).toEqual(expect.objectContaining({
      disabled: true,
      values: [
        {uuid: '10', pattern: 'exclusion1', hitCount: 1},
        {uuid: '11', pattern: 'exclusion2', hitCount: 2}
      ],
    }))
  })

  it('should return expected chip item key', () => {
    expect(createWrapper().find('Chips').props().keyFn({uuid: '10'})).toEqual('10')
  })

  it('should trigger prop function "onAdd" when tag added', () => {
    createWrapper().find('Chips').props().onAdd('changed tag')

    expect(props.onAdd).toHaveBeenCalledWith('uuid1', 'changed tag')
  })

  it('should trigger prop function "onRemove" when tag deleted', () => {
    createWrapper().find('Chips').props().onRemove({uuid: 'uuid 2'})

    expect(props.onRemove).toHaveBeenCalledWith('uuid1', 'uuid 2')
  })

  it('should render chip item', () => {
    const Item = createWrapper().find('Chips').props().renderItem

    expect(shallow(<Item {...props.exclusions[1]}/>).html()).toEqual('<strong>exclusion2</strong> <em>(2)</em>')
  })
})
