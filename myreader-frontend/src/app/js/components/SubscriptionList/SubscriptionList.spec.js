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
      ]
    }
  })

  it('should pass prop "to" to link component', () => {
    const links = createComponent().find('Link')

    expect(links.at(0).prop('to')).toContainObject({query: {uuid: '1'}, route: ['app', 'subscription']})
    expect(links.at(1).prop('to')).toContainObject({query: {uuid: '2'}, route: ['app', 'subscription']})
  })
})
