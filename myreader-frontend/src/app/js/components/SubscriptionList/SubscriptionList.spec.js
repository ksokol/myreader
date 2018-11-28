import React from 'react'
import {shallow} from 'enzyme'
import SubscriptionList from './SubscriptionList'

describe('SubscriptionList', () => {

  let props

  const createComponent = () => shallow(<SubscriptionList {...props} />)

  beforeEach(() => {
    props= {
      subscriptions: [
        {uuid: '1', title: '1', createdAt: '1'},
        {uuid: '2', title: '2', createdAt: '2'}
      ],
      navigateTo: jest.fn()
    }
  })

  it('should trigger prop function "navigateTo" with first subscription', () => {
    createComponent().children().at(0).props().onClick()

    expect(props.navigateTo).toHaveBeenCalledWith({uuid: '1', title: '1', createdAt: '1'})
  })

  it('should trigger prop function "navigateTo" with second subscription', () => {
    createComponent().children().at(1).props().onClick()

    expect(props.navigateTo).toHaveBeenCalledWith({uuid: '2', title: '2', createdAt: '2'})
  })
})
