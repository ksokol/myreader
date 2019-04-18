import React from 'react'
import {mount} from 'enzyme'
import SubscriptionListPage from './SubscriptionListPage'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  SubscriptionList: () => null,
  ListLayout: ({listPanel}) => <div>{listPanel}</div>
}))
/* eslint-enable */

describe('SubscriptionListPage', () => {

  let state

  const createComponent = () => mount(<SubscriptionListPage state={state} />)

  beforeEach(() => {
    state = {
      router: {
        query: {}
      },
      subscription: {
        subscriptions: [
          {uuid: '1', title: 'title1'},
          {uuid: '2', title: 'title2'}
        ]
      }
    }
  })

  it('should initialize list panel component with given props', () => {
    expect(createComponent().find('ListLayout').props()).toContainObject({
      listPanel: {
        props: {
          subscriptions: [
            {uuid: '1', title: 'title1'},
            {uuid: '2', title: 'title2'}
          ]
        }
      }
    })
  })

  it('should initialize list panel  component with given props filtered by state "router.query.q"', () => {
    state.router.query.q = 'title2'

    expect(createComponent().find('ListLayout').props()).toContainObject({
      listPanel: {
        props: {
          subscriptions: [
            {uuid: '2', title: 'title2'}
          ]
        }
      }
    })
  })
})
