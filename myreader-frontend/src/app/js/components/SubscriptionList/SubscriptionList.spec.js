import React from 'react'
import {shallow} from 'enzyme'
import SubscriptionList from './SubscriptionList'
import {SUBSCRIPTIONS_URL} from '../../constants'

describe('SubscriptionList', () => {

  let props

  const createWrapper = () => shallow(<SubscriptionList {...props} />)

  beforeEach(() => {
    props= {
      subscriptions: [
        {uuid: '1', title: '1', createdAt: '1'},
        {uuid: '2', title: '2', createdAt: '2'}
      ]
    }
  })

  it('should pass prop "to" to link component', () => {
    const links = createWrapper().find('Link')

    expect(links.at(0).prop('to')).toEqual(`${SUBSCRIPTIONS_URL}/1`)
    expect(links.at(1).prop('to')).toEqual(`${SUBSCRIPTIONS_URL}/2`)
  })
})
