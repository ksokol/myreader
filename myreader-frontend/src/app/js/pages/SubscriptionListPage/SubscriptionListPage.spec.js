import React from 'react'
import {shallow} from 'enzyme'
import SubscriptionListPage from './SubscriptionListPage'

describe('SubscriptionListPage', () => {

  let props

  const createComponent = () => shallow(<SubscriptionListPage {...props} />)

  beforeEach(() => {
    props = {
      subscriptions: [
        {uuid: '1', title: '1', createdAt: '1'}
      ]
    }
  })

  it('should pass expected props', () => {
    expect(createComponent().first().props()).toContainObject({
      listPanel: {
        props: {
          subscriptions: [{uuid: '1', title: '1', createdAt: '1'}]
        }
      }
    })
  })
})
