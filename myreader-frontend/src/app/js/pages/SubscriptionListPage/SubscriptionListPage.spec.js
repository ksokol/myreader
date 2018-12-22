import React from 'react'
import {shallow} from 'enzyme'
import SubscriptionListPage from './SubscriptionListPage'

describe('SubscriptionListPage', () => {

  let props

  const createComponent = () => shallow(<SubscriptionListPage {...props} />)

  beforeEach(() => {
    props = {
      router: {
        query: {
          a: 'b'
        }
      },
      subscriptions: [
        {uuid: '1', title: '1', createdAt: '1'}
      ],
      onSearchChange: jest.fn(),
      onRefresh: jest.fn(),
      navigateTo: jest.fn()
    }
  })

  it('should pass expected props', () => {
    expect(createComponent().first().props()).toContainObject({
      router: {query: {a: 'b'}},
      onSearchChange: props.onSearchChange,
      onRefresh: props.onRefresh,
      listPanel: {
        props: {
          subscriptions: [{uuid: '1', title: '1', createdAt: '1'}],
          navigateTo: props.navigateTo
        }
      }
    })
  })
})
